module Cryptobox
  module Command
    def self.edit(config, interactive, stdout, stdin, edit, update, pipe)
      db = Cryptobox::Db.new config[:path][:cryptobox],
        config[:path][:backup],
        config[:cryptobox][:keep_backups],
        Cryptobox::ask_password('Password:', interactive)
      db.load

      if stdout
        $stdout.puts db.plaintext
        return
      end

      if edit
        if stdin
          db.plaintext = $stdin.read
        else
          new_plaintext = run_editor(config[:path][:home], config[:ui][:editor], db.plaintext, pipe)
          return if new_plaintext == db.plaintext

          db.plaintext = new_plaintext
        end

        db.save
      end

      if update
        # generate embedded versions
        JsonOutput.new(config, config[:path][:private], true, db).run

        DesktopHtmlOutput.new(config, config[:path][:private], true).run
        MobileHtmlOutput.new(config, config[:path][:private], true).run

        FormBookmarkletOutput.new(config, config[:path][:private], true).run

        ChromeOutput.new(config, config[:path][:private], true).run

        # generate versions for Dropbox
        JsonOutput.new(config, config[:path][:dropbox], false, db).run

        DesktopHtmlOutput.new(config, config[:path][:dropbox], false).run
        MobileHtmlOutput.new(config, config[:path][:dropbox], false).run

        FormBookmarkletOutput.new(config, config[:path][:dropbox], false).run

        ChromeOutput.new(config, config[:path][:dropbox], false).run
      end
    end
  end
end
