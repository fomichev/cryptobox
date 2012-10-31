require 'yaml'
require 'openssl'
require 'base64'
require 'securerandom'
require 'fileutils'
require 'date'
require 'io/console'

module Cryptobox
  class Db
    FORMAT_VERSION = 6
    PBKDF2_SALT_LEN = 8
    PBKDF2_ITERATIONS = 2000
    AES_KEY_LEN = 128

    attr_accessor :plaintext
    attr_reader :pbkdf2_salt, :pbkdf2_iter, :aes_iv, :aes_keylen

    public

    # @db_path - path to cryptobox database
    # @backup_path - use given path as backup directory
    def initialize(db_path, backup_path, keep_backups, password)
      @db_path = db_path
      @backup_path = backup_path
      @keep_backups = keep_backups
      @password = password

      File.umask(0077)
    end

    # Create empty database, ask user to confirm if it already exists
    def create(password2)
      raise "Passwords don't match!" if @password != password2

      dirname = File.dirname @db_path
      Dir.mkdir dirname unless Dir.exist? dirname

      @aes_keylen = AES_KEY_LEN
      @pbkdf2_iter = PBKDF2_ITERATIONS

      generate_cipher_params
      derive_key
    end

    # Load database from @db_path
    def load
      db = YAML::load(File.read(@db_path))

      @pbkdf2_salt = from_base64 db['pbkdf2_salt']
      @pbkdf2_iter = db['pbkdf2_iter'].to_i
      @aes_iv = from_base64 db['aes_iv']
      @aes_keylen = db['aes_keylen'].to_i
      @ciphertext = from_base64 db['ciphertext']

      raise 'Unsupported format version' if db['format_version'] != FORMAT_VERSION

      derive_key

      @plaintext = decrypt @ciphertext
    end

    # Save database to @db_path
    def save
      backup

      generate_cipher_params
      derive_key

      @ciphertext = encrypt @plaintext

      db = {}
      db['pbkdf2_salt'] = to_base64(@pbkdf2_salt)
      db['pbkdf2_iter'] = @pbkdf2_iter
      db['aes_iv'] = to_base64(@aes_iv)
      db['aes_keylen'] = @aes_keylen
      db['format_version'] = FORMAT_VERSION
      db['version'] = VERSION
      db['timestamp'] = DateTime.now.to_s
      db['ciphertext'] = @ciphertext

      File.open(@db_path, 'w') {|f| f.write YAML.dump(db) }
    end

    # Ask user for password and generate new encryption key
    def change_password(password, password2)
      raise "Passwords don't match!" if password != password2

      @password = password
      derive_key
    end

    # Decrypt given ciphertext
    def decrypt(ciphertext)
      cipher = OpenSSL::Cipher::AES.new(@aes_keylen, :CBC)
      cipher.decrypt
      cipher.key = @key
      cipher.iv = @aes_iv

      # try
      return cipher.update(ciphertext) + cipher.final
      # catch => Invalid password
    end

    # Encrypt given plaintext
    def encrypt(plaintext)
      cipher = OpenSSL::Cipher::AES.new(@aes_keylen, :CBC)
      cipher.encrypt
      cipher.key = @key
      cipher.iv = @aes_iv

      return to_base64(cipher.update(plaintext) + cipher.final)
    end

    # Execute block on each database entry
    def each
      y = YAML::load(plaintext)
      return unless y

      includes = y.has_key?('include') ? y['include'] : {}

      y.each do |type_path, entries|
        next if type_path == 'include'

#        type = type_path.split(File::PATH_SEPARATOR)[0]
        type = type_path.split("/")[0]

        entries.each do |entry|
          raise "Wrong number!!!" if entry.keys.size != 1

          name = entry.keys[0]

          vars = Hash.new {|hash, key| raise "Key #{key} is not found!" }

          vars[:name] = name
          vars[:type_path] = type_path
          vars[:type] = type

          vars.merge! entry[name].symbolize_keys

          # FIXME: do this in runtime !!!
          vars.each {|key, value| vars[key] = value.gsub(/\n/, '\n').gsub(/"/, '\"') if vars[key].instance_of? String }

          yield vars, includes

          # for each alias yield a result with different type_path
          vars[:alias].split(/\s+/).each do |alias_type_path|
            vars[:type_path] = alias_type_path

            yield vars, includes
          end if vars.has_key? :alias
        end
      end
    end

    private

    # Generate default cipher parameters (salf, iv, etc)
    def generate_cipher_params
      @aes_iv = OpenSSL::Cipher::AES.new(@aes_keylen, :CBC).random_iv
      @pbkdf2_salt = SecureRandom.random_bytes PBKDF2_SALT_LEN
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
      return unless @keep_backups
      return unless File.exist? @db_path
      Dir.mkdir @backup_path unless Dir.exist? @backup_path
      FileUtils.cp @db_path, File.join(@backup_path, Time.now.strftime("%H_%M_%S_%d_%m_%Y"))
    end

    # Get encryption key from password and store it in @key
    def derive_key
      @key = OpenSSL::PKCS5::pbkdf2_hmac_sha1(@password, @pbkdf2_salt, @pbkdf2_iter, @aes_keylen / 8)
    end
  end
end
