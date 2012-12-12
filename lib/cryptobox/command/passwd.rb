module Cryptobox
  module Command
    # `cryptobox passwd` command handler.
    def self.passwd(config, interactive)
      db = Cryptobox::Db.new config[:path][:yaml],
        config[:path][:backup],
        config[:cryptobox][:keep_backups],
        Cryptobox::ask_password('Password:', interactive)

      db.load

      password = Cryptobox::ask_password('New password:', interactive)
      password2 = Cryptobox::ask_password('Confirm password:', interactive)

      raise Error::PASSWORDS_DONT_MATCH if password != password2

      db.change_password password
      db.save
    end
  end
end
