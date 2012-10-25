require "bundler/setup"

require 'aruba/cucumber'
require 'capybara/cucumber'
require 'capybara/poltergeist'

#TODO: MOVE SOMEWHERE ELSE
#require 'simplecov'
#SimpleCov.start

Before do
  Capybara.default_driver = :poltergeist

  # TODO: point to TMP_DIR/private/html when we will generate default DB in the test itself
  Capybara.app_host = "file://#{Dir.getwd}/private/html/"

  @dirs = [ TMP_DIR ]

  @aruba_keep_ansi = true
  @aruba_io_wait_seconds = 1
end

After do
end
