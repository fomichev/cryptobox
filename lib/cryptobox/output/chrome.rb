require 'fileutils'

def generate_chrome(config)
  verbose "-> GENERATE CHROME PLUGIN"

  Dir.mkdir config[:path][:db_chrome] unless Dir.exist? config[:path][:db_chrome]
  Dir.mkdir File.join(config[:path][:db_chrome], 'lib') unless Dir.exist? File.join(config[:path][:db_chrome], 'lib')

  root = File.join(config[:path][:templates], 'chrome')

  templates = [ File.join(root, 'popup.html'),
    File.join(root, 'manifest.json'),
    File.join('build', 'chrome', 'background.js'),
    File.join('build', 'chrome', 'content.js'),
    File.join('build', 'chrome', 'popup.js'),
  ]

  templates.each do |filename|
    name = File.basename filename
    t = Template.new(config, filename, name).generate
    File.open(File.join(config[:path][:db_chrome], name), 'w') {|f| f.write t }
  end

  copy = [ File.join(root, 'icon.png') ]

  copy.each do |filename|
    name = File.basename filename
    FileUtils.cp filename, File.join(config[:path][:db_chrome], name)
  end
end
