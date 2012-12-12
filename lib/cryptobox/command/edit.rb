module Cryptobox
  module Command
    # `cryptobox edit` command handler.
    def self.edit(config, interactive, stdout, stdin, edit, update, pipe)
      db = Cryptobox::Db.new config[:path][:yaml],
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
          editor = Editor.new(config[:path][:home],
                              config[:ui][:editor],
                              db.plaintext,
                              pipe)

          new_plaintext = editor.run
          return if new_plaintext == db.plaintext

          db.plaintext = new_plaintext
        end

        db.save
      end

      if update
        # generate embedded versions
        JsonOutput.new(config, config[:path][:cryptobox], true, db).run

        DesktopHtmlOutput.new(config, config[:path][:cryptobox], true).run
        MobileHtmlOutput.new(config, config[:path][:cryptobox], true).run

        FormBookmarkletOutput.new(config, config[:path][:cryptobox], true).run

        ChromeOutput.new(config, config[:path][:cryptobox], true).run

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
