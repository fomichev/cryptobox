module Cryptobox
  module Command
    def self.passwd(config, interactive)
      db = Cryptobox::Db.new config[:path][:cryptobox],
        config[:path][:backup],
        config[:cryptobox][:keep_backups],
        Cryptobox::ask_password('Password:', interactive)
      db.load
      db.change_password Cryptobox::ask_password('New password:', interactive),
        Cryptobox::ask_password('Confirm password:', interactive)
      db.save
    end
  end
end
