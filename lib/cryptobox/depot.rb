require 'openssl'
require 'cryptobox/websocket'

module Cryptobox
  # Create self-signed certificate
  def create_certificate(c='RU', st='Moscow', l='Moscow', host='127.0.0.1', email='s@fomichev.me')
    key = OpenSSL::PKey::RSA.generate(1024)

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

  # Register at depot server
  def self.depot_register(config)
    # TODO
  end

  # Change password at depot server
  def self.depot_passwd(config)
    # TODO
  end

  # Update cryptobox.json data on depot server
  def self.depot_put(config)
  end

  # Start local depot servert
  def self.depot_start(config, host, port)
    EM.epoll
    EM.run do
      trap("TERM") { stop }
      trap("INT") { stop }

      puts "Cryptobox server started at #{host}:#{port}"

      WebSocket::EventMachine::Server.start(host: host,
                                            port: port,
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

  #      ws.onclose { puts "Connection closed" }
  #      ws.onopen    { ws.send "New client connected"}
  #      ws.onmessage { |msg| ws.send "Pong: #{msg}" } # TODO: handle
  #      ws.onclose   { puts "Client disconnected" }
  #      ws.onerror   { |e| puts "Error: #{e}" }
      end

    end

    def stop
      puts "Terminating Server"
      EventMachine.stop
    end
  end
end
