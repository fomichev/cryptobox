class FillBookmarkletOutput < Output
  def initialize(config, to, embed)
    super

    @config = config
  end

  protected
  def generate
    source = File.join @config[:path][:build], 'bookmarklet', 'fill.js'
    target = File.join @to, 'bookmarklet', 'fill.js'
    json = File.join @to, 'cryptobox.json'

    t = Template.new(@config, source, @embed).generate

    mkdir_for target
    File.open(target, 'w') do|f|
      f.write t
      f.write 'function openCryptobox() { return '
      f.write File.read(json)
      f.write '; }'
    end
  end
end

class FormBookmarkletOutput < Output
  def initialize(config, to, embed)
    super

    @config = config
  end

  protected
  def generate
    source = File.join @config[:path][:build], 'bookmarklet', 'form.js'
    target = File.join @to, 'bookmarklet', 'form.js'

    t = Template.new(@config, source, @embed).generate

    mkdir_for target
    File.open(target, 'w') {|f| f.write t }
  end
end
