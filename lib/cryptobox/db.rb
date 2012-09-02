require 'yaml'
require 'openssl'
require 'base64'
require 'securerandom'
require 'fileutils'
require 'date'
require 'io/console'

module Cryptobox
  class Db
    FORMAT_VERSION = 4
    PBKDF2_SALT_LEN = 8
    PBKDF2_ITERATIONS = 4096
    AES_IV_LEN = 16

    attr_accessor :plaintext
    attr_reader :pbkdf2_salt, :pbkdf2_iter, :aes_iv, :hmac

    public

    # @db_path - path to cryptobox database
    # @backup_path - use given path as backup directory
    def initialize(db_path, backup_path)
      @db_path = db_path
      @backup_path = backup_path
      @password = ask_password
    end

    # Create empty database, ask user to confirm if it already exists
    def create
      password2 = ask_password 'Confirm password: '
      raise "Passwords don't match!" if @password != password2

      dirname = File.dirname @db_path
      Dir.mkdir dirname unless Dir.exist? dirname

      initialize_cipher_params
      derive_key
    end

    # Load database from @db_path
    def load
      db = YAML::load(File.read(@db_path))

      @pbkdf2_salt = from_base64 db['pbkdf2_salt']
      @pbkdf2_iter = db['pbkdf2_iter'].to_i
      @aes_iv = from_base64 db['aes_iv']
      @hmac = from_base64 db['hmac']
      @ciphertext = from_base64 db['ciphertext']

      raise 'Unsupported format version' if db['format_version'] != FORMAT_VERSION

      derive_key
      @plaintext = decrypt @ciphertext
      verify_hmac
    end

    # Save database to @db_path
    def save
      backup
      @ciphertext = encrypt @plaintext

      db = {}
      db['pbkdf2_salt'] = to_base64(@pbkdf2_salt)
      db['pbkdf2_iter'] = @pbkdf2_iter
      db['aes_iv'] = to_base64(@aes_iv)
      db['hmac'] = to_base64(calculate_hmac)
      db['format_version'] = FORMAT_VERSION
      db['version'] = VERSION
      db['timestamp'] = DateTime.now.to_s
      db['ciphertext'] = @ciphertext

      File.open(@db_path, 'w') {|f| f.write YAML.dump(db) }
    end

    # Ask user for password and generate new encryption key
    def change_password
      password = ask_password 'New password: '
      password2 = ask_password 'Confirm password: '
      raise "Passwords don't match!" if password != password2

      @password = password
      derive_key
    end

    # Decrypt given ciphertext
    def decrypt(ciphertext)
      cipher = OpenSSL::Cipher::AES256.new(:CBC)
      cipher.decrypt
      cipher.key = @key
      cipher.iv = @aes_iv

      # try
      return cipher.update(ciphertext) + cipher.final
      # catch => Invalid password
    end

    # Encrypt given plaintext
    def encrypt(plaintext)
      cipher = OpenSSL::Cipher::AES256.new(:CBC)
      cipher.encrypt
      cipher.key = @key
      cipher.iv = @aes_iv

      return to_base64(cipher.update(plaintext) + cipher.final)
    end

    private

    # Generate default cipher parameters (salf, iv, etc)
    def initialize_cipher_params
      @pbkdf2_salt = SecureRandom.random_bytes PBKDF2_SALT_LEN
      @pbkdf2_iter = PBKDF2_ITERATIONS
      @aes_iv = SecureRandom.random_bytes AES_IV_LEN
      @hmac = nil
    end

    # Ask user password and return it
    def ask_password(prompt='Password: ')
      print prompt
      password = STDIN.noecho(&:gets).sub(/\n$/, '')
      puts

      return password
    end

    # Convert given argument to base64 encoding and strip newlines
    def to_base64(v)
      return Base64.encode64(v).gsub(/\n/, '')
    end

    # Wrapper for Base64.decode64 (for consistency with to_base64)
    def from_base64(v)
      return Base64.decode64(v)
    end

    # Backup previous version of database
    def backup
      return unless File.exist? @db_path
      Dir.mkdir @backup_path unless Dir.exist? @backup_path
      FileUtils.cp @db_path, @backup_path + '/' + File.basename(@db_path)
    end

    # Get encryption key from password and store it in @key
    def derive_key
      @key = OpenSSL::PKCS5::pbkdf2_hmac_sha1(@password, @pbkdf2_salt, @pbkdf2_iter, 32)
    end

    # Calculate and return HMAC for @plaintext and @key
    def calculate_hmac()
      digest = OpenSSL::Digest::Digest.new('sha1')
      return OpenSSL::HMAC.digest(digest, @key, @plaintext)
    end

    def verify_hmac
      raise 'Invalid password' if @hmac != calculate_hmac
    end
  end
end
