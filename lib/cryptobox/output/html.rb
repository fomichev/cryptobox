require 'fileutils'

def generate_html(config)
  verbose "-> GENERATE DESKTOP HTML"

  dirname = File.dirname config[:path][:db_html]
  Dir.mkdir dirname unless Dir.exist? dirname

  t = Template.new(config, File.join(config[:path][:templates], 'desktop/index.html')).generate

  File.open(config[:path][:db_html], 'w') {|f| f.write t }

  # copy clippy
  FileUtils.cp config[:path][:clippy], config[:path][:db_clippy]

  verbose "-> GENERATE MOBILE HTML"
  dirname = File.dirname config[:path][:db_mobile_html]
  Dir.mkdir dirname unless Dir.exist? dirname

  t = Template.new(config, File.join(config[:path][:templates], 'mobile/index.html')).generate

  File.open(config[:path][:db_mobile_html], 'w') {|f| f.write t }
end
