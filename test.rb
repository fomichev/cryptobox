require 'yaml'
require 'pp'
require 'openssl'
require 'base64'
require 'erb'
require 'json'

require 'io/console'

# for logging:
# require 'logger'

def prn_yaml()
	a1 = {"login/dropbox.com" => "s@fomichev.me", "pwd" => "who knows" }
	a2 = {"login/gmail.com" => "s@fomichev.me", "pwd" => "really don't know" }
	a3 = {"identity" => "test", "firstname" => "my name", "passport" => "qwer" }
	a4 = {"note" => "test", "text" => "test" }

	blabla = [ a1, a2, a3, a4 ]

	print blabla.to_yaml
end

def load_yaml()
	thing = YAML.load_file('some.yml')
	pp thing
end

def derive_key(password, salt, iter)
	return OpenSSL::PKCS5::pbkdf2_hmac_sha1(password, salt, iter, 32)
end

def decrypt(key, iv, data)
	cipher = OpenSSL::Cipher::AES256.new(:CBC)
	cipher.decrypt
	cipher.key = key
	cipher.iv = iv

	return cipher.update(data) + cipher.final
end

def encrypt(key, iv, data)
	cipher = OpenSSL::Cipher::AES256.new(:CBC)
	cipher.encrypt
	cipher.key = key
	cipher.iv = iv

	encrypted = cipher.update(data) + cipher.final
end

def hmac()
DIGEST  = OpenSSL::Digest::Digest.new('sha1')
OpenSSL::HMAC.digest(DIGEST, KEY, DATA)

end

def test_cipher()
	password = "hi"
	salt = Base64.decode64("vyvhYAqR0Os=")
	iter = 1000
	key = derive_key password, salt, iter

	iv = Base64.decode64("O/fqt3VeY4laxfn1B7OyHQ==")
	encrypted = Base64.decode64("JhDP/N2YSG54jHmJgqPqVcWRCh6VoRMqaxq3SzEoFdUwdwm9wIm9ec8DSzTf7NiNEeHTEYZsNjApwSuPGIiTkA==")
	plain = decrypt key, iv, encrypted

	puts plain

	ciphertext = encrypt key, iv, plain
	puts Base64.encode64(ciphertext)
end

def template()
	x = 42
	template = ERB.new <<-EOF
The value of x is: <%= x %>
	EOF
	puts template.result(binding)
end

def test_json()
	pp JSON.parse(File.read('include/app'))
end

def read_pwd()
	puts 'Password: '
	puts STDIN.noecho(&:gets)
end
