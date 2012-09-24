class FillBookmarkletOutput < Output
  def initialize(config)
    @config = config
  end

  protected
  def generate
    source = File.join @config[:path][:build], 'bookmarklet', 'fill.js'
    target = File.join @config[:path][:private], 'bookmarklet', 'fill.js'
    json = File.join @config[:path][:private], 'cryptobox.json'

    t = Template.new(@config, source).generate

    mkdir_for target
    File.open(target, 'w') do|f|
      f.write t
      f.write 'function getCryptoboxConfig() { return '
      f.write File.read(json)
      f.write '; }'
    end
  end
end

class FormBookmarkletOutput < Output
  def initialize(config)
    @config = config
  end

  protected
  def generate
    source = File.join @config[:path][:build], 'bookmarklet', 'form.js'
    target = File.join @config[:path][:private], 'bookmarklet', 'form.js'

    t = Template.new(@config, source).generate

    mkdir_for target
    File.open(target, 'w') {|f| f.write t }
  end
end
