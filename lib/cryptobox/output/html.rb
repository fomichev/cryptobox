require 'fileutils'

class DesktopHtmlOutput < Output
  def initialize(config, to, embed)
    super

    @config = config
  end

  protected
  def generate
    source = File.join @config[:path][:src], 'desktop', 'index.rhtml'
    target = File.join @to, 'html', 'cryptobox.html'
    source_clippy = File.join(@config[:path][:src], 'extern', 'clippy', 'build', 'clippy.swf')
    target_clippy = File.join(@to, 'html', 'clippy.swf')
    t = Template.new(@config, source, @embed).generate

    mkdir_for target
    File.open(target, 'w') {|f| f.write t }

    FileUtils.cp source_clippy, target_clippy
  end
end

class MobileHtmlOutput < Output
  def initialize(config, to, embed)
    super

    @config = config
  end

  protected
  def generate
    source = File.join @config[:path][:src], 'mobile', 'index.rhtml'
    target = File.join @to, 'html', 'm.cryptobox.html'

    t = Template.new(@config, source, @embed).generate

    mkdir_for target
    File.open(target, 'w') {|f| f.write t }
  end
end
