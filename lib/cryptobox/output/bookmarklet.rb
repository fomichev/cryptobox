# Class that generates form bookmarklet.
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
