require 'fileutils'

def embed_images(text, images_root)
  text.gsub(/url\("?([^")]*)"?\)*/) do
    verbose "Embed image #{$1}"
    img = File.read(File.join(images_root, $1))

    'url(data:image/png;base64,' + Base64.encode64(img).gsub(/\n/, '') + ')'
  end
end

def generate_html(config)
  verbose "-> GENERATE DESKTOP HTML"

  dirname = File.dirname config[:path][:db_html]
  Dir.mkdir dirname unless Dir.exist? dirname

  t = Template.new(config, File.join(config[:path][:html], 'desktop/index.html')).generate
  t = embed_images(t, config[:path][:jquery_ui_css_images])

  File.open(config[:path][:db_html], 'w') {|f| f.write t }

  # copy clippy
  FileUtils.cp config[:path][:clippy], config[:path][:db_clippy]

  verbose "-> GENERATE MOBILE HTML"
  dirname = File.dirname config[:path][:db_mobile_html]
  Dir.mkdir dirname unless Dir.exist? dirname

  t = Template.new(config, File.join(config[:path][:html], 'mobile/index.html')).generate
  t = embed_images(t, config[:path][:jquery_mobile_css_images])

  File.open(config[:path][:db_mobile_html], 'w') {|f| f.write t }
end
