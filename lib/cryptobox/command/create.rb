module Cryptobox
  module Command
    # `cryptobox create` command handler.
    def self.create(config, interactive)
      if File.exist? config[:path][:yaml]
        return unless Cryptobox::yn "Database already exists, do you want to overwrite it?"
      end

      password = Cryptobox::ask_password('Password:', interactive)
      password2 = Cryptobox::ask_password('Confirm password:', interactive)

      raise Error::PASSWORDS_DONT_MATCH if password != password2

      db = Cryptobox::Db.new config[:path][:yaml],
        config[:path][:backup],
        config[:cryptobox][:keep_backups],
        password

      db.create
      db.plaintext = '# Lines started with # are comments'
      db.save
    end
  end
end
