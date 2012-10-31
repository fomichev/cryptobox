$LOAD_PATH.push File.expand_path("../lib", __FILE__)
require 'cryptobox/config'

Gem::Specification.new do |s|
  s.name = "cryptobox"
  s.version = Cryptobox::Config::VERSION
  s.platform = Gem::Platform::RUBY
  s.authors = ["Stanislav Fomichev"]
  s.email = ["s@fomichev.me"]
  s.homepage = "http://github.com/fomichev/cryptobox"
  s.summary = ""
  s.description = ""

  s.rubyforge_project = "cryptobox"

  s.files = ["bin/xxx", "lib/xxx"]
  s.require_paths << 'lib'
  s.executables = ["bin/xxx", "bin/xxx"]

  # runtime depends: gli, em-websocket
end
