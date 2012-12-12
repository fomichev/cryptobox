$LOAD_PATH.push File.expand_path("../lib", __FILE__)
require 'cryptobox'

Gem::Specification.new do |s|
  s.name = 'cryptobox'
  s.version = Cryptobox::VERSION
  s.platform = Gem::Platform::RUBY
  s.authors = [ 'Stanislav Fomichev' ]
  s.email = [ 's@fomichev.me' ]
  s.homepage = 'http://github.com/fomichev/cryptobox'
  s.summary = 'Passwords storage solution.'
  s.description = <<-END
Cryptobox is a bunch of Ruby scripts that help you manage
passwords and other sensitive data.
END

  s.rubyforge_project = 'cryptobox'

  s.has_rdoc = true
  s.files = `git ls-files -z`.split("\0")
  s.require_paths << 'lib'
  s.executables = [ 'cryptobox' ]
  s.extra_rdoc_files = [ 'README.rdoc', 'LICENSE' ]

  s.add_dependency('trollop')
end
