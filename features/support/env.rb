#require "bundler/setup"

require 'aruba/cucumber'
require 'capybara/cucumber'
#require 'capybara/poltergeist'
require 'capybara/webkit'

#TODO: MOVE SOMEWHERE ELSE
#require 'simplecov'
#SimpleCov.start

Before do
#  Capybara.default_driver = :selenium
  Capybara.default_driver = :webkit
#  Capybara.default_driver = :poltergeist
#  Capybara.app_host = 'file:///C:/Documents%20and%20Settings/stas.fomichev/My%20Documents/Dropbox/Sources/cryptobox/private3/html/'
  Capybara.app_host = "file:///Users/stanislavfomichev/Dropbox/Sources/cryptobox/private3/html/"

  @dirs = [ TMP_DIR ]

  @aruba_keep_ansi = true
  @aruba_io_wait_seconds = 1
end

After do
end
