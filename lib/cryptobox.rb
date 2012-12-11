require 'cryptobox/config'
require 'cryptobox/db'
require 'cryptobox/editor' # ? -> edit
require 'cryptobox/util'
require 'cryptobox/lang'
require 'cryptobox/template'
require 'cryptobox/output/output'
require 'cryptobox/output/json'
require 'cryptobox/output/html'
require 'cryptobox/output/bookmarklet'
require 'cryptobox/output/chrome'

module Cryptobox
  VERSION = "0.9"

  class Error < RuntimeError
    attr_reader :message, :code

    def initialize(code, message)
      @code = code
      @message = message
    end

    PASSWORDS_DONT_MATCH = Error.new(1, "Passwords don't match")
    INVALID_PASSWORD = Error.new(2, "Invalid password")
    INVALID_FORMAT = Error.new(3, "Unsupported format version")
    TOO_MANY_ENTRIES = Error.new(4, "Too many entries")
    KEY_NOT_FOUND = Error.new(5, "Key is not found")
  end
end

def verbose(m)
  $stderr.puts(m) if $verbose
end
