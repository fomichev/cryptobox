require 'fileutils'

def generate_handlebars(files)
  files.each do |filename|
    path = File.dirname filename
    from = File.basename filename
    to = from.sub(/\.handlebars$/, '.js')

    # TODO: apply optimizations
    # handlebars <input> -f <output> -k each -k if -k unless
    Dir.chdir(path) { `handlebars #{from} -f #{to}` }
  end
end

def generate_chrome(config)
  verbose "-> GENERATE CHROME PLUGIN"

  Dir.mkdir config[:path][:db_chrome] unless Dir.exist? config[:path][:db_chrome]

  handlebars = [ File.join(config[:path][:chrome], 'locked.handlebars'),
    File.join(config[:path][:chrome], 'unlocked.handlebars') ]

  generate_handlebars handlebars

  templates = [ File.join(config[:path][:chrome], 'popup.html'),
    File.join(config[:path][:chrome], 'background.js'),
    File.join(config[:path][:chrome], 'content.js'),
    File.join(config[:path][:templates], 'js/form.js'),
    File.join(config[:path][:templates], 'js/lock.js'),
    File.join(config[:path][:templates], 'js/password.js'),
    File.join(config[:path][:templates], 'js/helpers.js'),
    File.join(config[:path][:templates], 'js/ui.js'),
    File.join(config[:path][:templates], 'js/ui-bootstrap.js'),
    File.join(config[:path][:chrome], 'locked.js'),
    File.join(config[:path][:chrome], 'unlocked.js'),
    File.join(config[:path][:chrome], 'popup.js'),
    File.join(config[:path][:chrome], 'manifest.json'),
  ]

  templates.concat [
    File.join(config[:path][:templates], 'js/cipher.js'),
  ] if config[:chrome][:embed]

  templates.each do |filename|
    name = File.basename filename
    t = Template.new(config, filename, name).generate
    t = embed_images(t, File.join(config[:path][:bootstrap], 'css'))
    File.open(File.join(config[:path][:db_chrome], name), 'w') {|f| f.write t }
  end

  copy = [ File.join(config[:path][:chrome], 'icon.png'),
    File.join(config[:path][:bootstrap], 'css/bootstrap.min.css'),
    File.join(config[:path][:bootstrap], 'js/bootstrap.min.js'),
    File.join(config[:path][:templates], 'extern/handlebars/handlebars.min.js'),
    File.join(config[:path][:templates], 'extern/jquery/jquery.min.js') ]

  copy.concat [
    File.join(config[:path][:templates], 'extern/seedrandom/seedrandom.min.js'),
    File.join(config[:path][:templates], 'extern/CryptoJS/components/core-min.js'),
    File.join(config[:path][:templates], 'extern/CryptoJS/components/enc-base64-min.js'),
    File.join(config[:path][:templates], 'extern/CryptoJS/components/cipher-core-min.js'),
    File.join(config[:path][:templates], 'extern/CryptoJS/components/aes-min.js'),
    File.join(config[:path][:templates], 'extern/CryptoJS/components/sha1-min.js'),
    File.join(config[:path][:templates], 'extern/CryptoJS/components/hmac-min.js'),
    File.join(config[:path][:templates], 'extern/CryptoJS/components/pbkdf2-min.js'),
  ] if config[:chrome][:embed]

  copy.each do |filename|
    name = File.basename filename
    FileUtils.cp filename, File.join(config[:path][:db_chrome], name)
  end

  if config[:chrome][:embed]
    File.open(File.join(config[:path][:db_chrome], 'cfg.js'), 'w') { |f| f.write "var cryptobox = {};\ncryptobox.cfg = " + File.read(config[:path][:db_json]) }
  end
end
