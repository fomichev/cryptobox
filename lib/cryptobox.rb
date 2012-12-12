require 'cryptobox/config'
require 'cryptobox/db'
require 'cryptobox/editor'
require 'cryptobox/util'
require 'cryptobox/lang'
require 'cryptobox/template'
require 'cryptobox/output/output'
require 'cryptobox/output/json'
require 'cryptobox/output/html'
require 'cryptobox/output/bookmarklet'
require 'cryptobox/output/chrome'

module Cryptobox
  # Version of the application, don't confuse with FORMAT_VERSION
  VERSION = "0.9"

  # Class responsible for communicating error from the library to the
  # application. Contains message end exit code.
  class Error < RuntimeError
    # Error message and exit code
    attr_reader :message, :code

    # Create new error instance with given message and exit code.
    def initialize(code, message)
      @code = code
      @message = message
    end

    # This error is raised when actual and confirmed passwords don't match.
    PASSWORDS_DONT_MATCH = Error.new(1, "Passwords don't match")
    # This error is raised when user entered invalid database password.
    INVALID_PASSWORD = Error.new(2, "Invalid password")
    # This error is raised when user tried to use database with
    # invalid/unsupported format.
    INVALID_FORMAT = Error.new(3, "Unsupported format version")
    # This error is raised from the `cryptobox cat` when user tries
    # to read specific key but didn't filtered specified entry.
    TOO_MANY_ENTRIES = Error.new(4, "Too many entries")
    # This error is raised from the `cryptobox cat` when user tries
    # to use non-existing key.
    KEY_NOT_FOUND = Error.new(5, "Key is not found")
    # This error is raised when application can't find database to load.
    DATABASE_NOT_FOUND = Error.new(6, "Database is not found")
  end
end

# Print message if in verbose mode
def verbose(m)
  $stderr.puts(m) if $verbose
end
