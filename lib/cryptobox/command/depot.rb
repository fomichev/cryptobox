module Cryptobox
  module Command
    def self.depot(config)
      host = "0.0.0.0"
      port = 22790

      unless File.exist?(config[:security][:private_key_path])
        puts "No certificate found, generate a new one..."

        key, cert = create_certificate

        File.open(config[:security][:private_key_path], "w") { |f| f.write key }
        File.open(config[:security][:certificate_path], "w") { |f| f.write cert }
      end

      Cryptobox.depot_start(config, host, port)
    end
  end
end
