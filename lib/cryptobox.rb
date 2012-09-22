require 'cryptobox/config'
require 'cryptobox/db'
require 'cryptobox/editor' # ? -> edit
require 'cryptobox/util'
require 'cryptobox/lang'
require 'cryptobox/template'
require 'cryptobox/output/json'
require 'cryptobox/output/html'
require 'cryptobox/output/bookmarklet'
require 'cryptobox/output/chrome'

module Cryptobox
  VERSION = "0.6"
end

def verbose(m)
  STDERR.puts(m) if $verbose
end
