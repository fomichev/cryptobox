require 'aruba/cucumber'

Before do
  @aruba_keep_ansi = true
  @aruba_io_wait_seconds = 1

  @correct_pass = 'hi'
  @incorrect_pass = 'ih'
  @cryptobox_database = File.join('private')
  @cryptobox_file = File.join('private', 'cryptobox')
end

After do
end
