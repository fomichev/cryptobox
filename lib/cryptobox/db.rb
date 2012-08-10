require 'yaml'
require 'openssl'
require 'base64'
require 'securerandom'
require 'io/console'

module Cryptobox
  class Db
    attr_accessor :config_path, :plaintext
    @@format_version = 3

    def initialize(db_path, config_path)
      @db_path = db_path
      @config_path = config_path
      @password = ask_password
    end

    def initialize_cipher_params
      @pbkdf2_salt = SecureRandom.random_bytes 8
      @pbkdf2_iter = 1000
      @aes_iv = SecureRandom.random_bytes 16
      @hmac = nil
    end

    def ask_password(prompt='Password: ')
      print prompt
      password = STDIN.noecho(&:gets).sub(/\n$/, '')
      puts
      return password
    end

    def create
      password2 = ask_password 'Confirm password: '
      raise "Passwords don't match!" if @password != password2

      dirname = File.dirname @config_path
      Dir.mkdir dirname unless Dir.exist? dirname

      initialize_cipher_params
      derive_key
    end

    def load_config
      config = YAML.load_file @config_path

      @pbkdf2_salt = from_base64 config['pbkdf2']['salt']
      @pbkdf2_iter = config['pbkdf2']['iter'].to_i
      @aes_iv = from_base64 config['aes']['iv']
      @hmac = from_base64 config['cryptobox']['hmac']

      raise 'Unsupported format version' if config['cryptobox']['format_version'] != @@format_version

      derive_key
    end

    def to_base64(v)
      return Base64.encode64(v).gsub(/\n/, '')
    end

    def from_base64(v)
      return Base64.decode64(v)
    end

    def save_config
      config = {}
      config['pbkdf2'] = { 'salt' => to_base64(@pbkdf2_salt), 'iter' => @pbkdf2_iter }
      config['aes'] = { 'iv' => to_base64(@aes_iv) }
      config['cryptobox'] = { 'hmac' => to_base64(calculate_hmac), 'format_version' => @@format_version }

      File.open(@config_path, 'w') {|f| f.write config.to_yaml }
    end

    def load
      load_config
      @encrypted = from_base64 IO.read(@db_path)
      decrypt
      verify
    end

    def save
      save_config
      encrypt
    end

    def change_password
      password = ask_password 'New password: '
      password2 = ask_password 'Confirm password: '
      raise "Passwords don't match!" if password != password2

      @password = password
      derive_key
    end

    def derive_key
      @key = OpenSSL::PKCS5::pbkdf2_hmac_sha1(@password, @pbkdf2_salt, @pbkdf2_iter, 32)
    end

    def calculate_hmac()
      digest = OpenSSL::Digest::Digest.new('sha1')
      return OpenSSL::HMAC.digest(digest, @key, @plaintext)
    end

    def decrypt
      cipher = OpenSSL::Cipher::AES256.new(:CBC)
      cipher.decrypt
      cipher.key = @key
      cipher.iv = @aes_iv

      # try
      @plaintext = cipher.update(@encrypted) + cipher.final
      # catch => Invalid password
    end

    def encrypt
      cipher = OpenSSL::Cipher::AES256.new(:CBC)
      cipher.encrypt
      cipher.key = @key
      cipher.iv = @aes_iv

      @encrypted = cipher.update(@plaintext) + cipher.final

      File.open(@db_path, 'w') {|f| f.write to_base64(@encrypted) }
    end

    def verify
      raise 'Invalid password' if @hmac != calculate_hmac
    end
  end
end
