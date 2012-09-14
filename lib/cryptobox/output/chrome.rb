require 'fileutils'

def generate_chrome(config)
  verbose "-> GENERATE CHROME PLUGIN"

  Dir.mkdir config[:path][:db_chrome] unless Dir.exist? config[:path][:db_chrome]

  [ File.join(config[:path][:chrome], 'popup.html'),
    File.join(config[:path][:chrome], 'background.js'),
    File.join(config[:path][:chrome], 'content.js'),
    File.join(config[:path][:html], 'js/crypto.js'),
    File.join(config[:path][:html], 'js/login.js'),
    File.join(config[:path][:html], 'js/lock.js'),
    File.join(config[:path][:html], 'js/fill.js'),
    File.join(config[:path][:chrome], 'popup.js'),
  ].each do |filename|
    name = File.basename filename
    t = Template.new(config, filename, name).generate
    File.open(File.join(config[:path][:db_chrome], name), 'w') {|f| f.write t }
  end

  [ File.join(config[:path][:chrome], 'manifest.json'),
    File.join(config[:path][:chrome], 'icon.png'),
    File.join(config[:path][:html], 'extern/jquery/jquery-1.7.2.min.js'),
    File.join(config[:path][:html], 'extern/CryptoJS/components/core-min.js'),
    File.join(config[:path][:html], 'extern/CryptoJS/components/enc-base64-min.js'),
    File.join(config[:path][:html], 'extern/CryptoJS/components/cipher-core-min.js'),
    File.join(config[:path][:html], 'extern/CryptoJS/components/aes-min.js'),
    File.join(config[:path][:html], 'extern/CryptoJS/components/sha1-min.js'),
    File.join(config[:path][:html], 'extern/CryptoJS/components/hmac-min.js'),
    File.join(config[:path][:html], 'extern/CryptoJS/components/pbkdf2-min.js'),
  ].each do |filename|
    name = File.basename filename
    FileUtils.cp filename, File.join(config[:path][:db_chrome], name)
  end

  # TODO: need to remove this when doing cbserve!
  File.open(File.join(config[:path][:db_chrome], 'cfg.js'), 'w') { |f| f.write 'var cfg = ' + File.read(config[:path][:db_json]) }
end
