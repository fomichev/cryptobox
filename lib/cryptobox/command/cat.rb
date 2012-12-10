module Cryptobox
  module Command
    def self.cat(config, interactive, key, args)
      # TODO
      db = Cryptobox::Db.new config[:path][:cryptobox],
        config[:path][:backup],
        config[:cryptobox][:keep_backups],
        Cryptobox::ask_password('Password:', interactive)
      db.load

      entries = []
      db.each do |vars, _|
        add = true

        if args.size != 0
          args.each do |filter|
            k, v = filter.split(/=/)

            if not vars.has_key? k.to_sym or not vars[k.to_sym] == v
              add = false
              next
            end
          end
        end

        entries << vars if add
      end

      if key
        k = key.to_sym

        if entries.size != 1
          $stderr.puts 'error: Too many entries'
          exit 1
        end

        if not entries[0].has_key? k # TODO: add error printout
          $stderr.puts 'error: Key is not found'
          exit 2
        end

        print entries[0][k]
      else
        puts JSON.pretty_generate entries
      end
    end
  end
end
