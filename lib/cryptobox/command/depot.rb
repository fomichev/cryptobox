require 'em-websocket'

module Cryptobox
  module Command
    def self.serve(config)
      address = "127.0.0.1"
      port = 22790

      puts "Cryptobox server started at #{address}:#{port}"
      EventMachine.run do
        EventMachine::WebSocket.start(
          :host => address,
          :port => port,
          :secure => true,
          :tls_options => {
          :private_key_file => config[:security][:private_key_path],
          :cert_chain_file => config[:security][:certificate_path],
          :verify_peer => false
        }) do |ws|
          ws.onopen do
            puts "Connection open"

            contents = File.open(File.join(config[:path][:private], 'cryptobox.json'), "r:utf-8") { |f| f.read }

            ws.send(contents)
          end

          ws.onclose { puts "Connection closed" }
        end
      end
    end

    def self.cert(config)
      require 'openssl'

      def create_certificate(c='RU', st='Moscow', l='Moscow', host='127.0.0.1', email='s@fomichev.me')
        key = OpenSSL::PKey::RSA.generate(1024)

        ca = OpenSSL::X509::Name.parse("/C=#{c}/ST=#{st}/L=#{l}/O=Cryptobox/OU=Cryptobox/CN=#{host}/emailAddress=#{email}")
        cert = OpenSSL::X509::Certificate.new
        cert.version = 2
        cert.serial = 1
        cert.subject = cert.issuer = ca
        cert.public_key = key.public_key
        cert.not_before = Time.now
        cert.not_after = Time.now + 365 * 24 * 60 * 60

        ef = OpenSSL::X509::ExtensionFactory.new
        ef.subject_certificate = cert
        ef.issuer_certificate = cert
        cert.extensions = [
          #    ef.create_extension("basicConstraints","CA:TRUE", true),
          ef.create_extension("subjectKeyIdentifier", "hash"),
        ]
        cert.add_extension ef.create_extension("authorityKeyIdentifier",
                                               "keyid:always,issuer:always")

        cert.sign key, OpenSSL::Digest::SHA1.new

        return key.to_pem, cert.to_pem
      end

      key, cert = create_certificate

      File.open("cryptobox.key", "w") { |f| f.write key }
      File.open("cryptobox.crt", "w") { |f| f.write cert }
    end
  end
end
