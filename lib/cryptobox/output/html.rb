require 'fileutils'

class DesktopHtmlOutput < Output
  def initialize(config)
    @config = config
  end

  protected
  def generate
    source = File.join @config[:path][:templates], 'desktop', 'index.html'
    target = File.join @config[:path][:private], 'html', 'cryptobox.html'
    source_clippy = File.join(@config[:path][:templates], 'extern', 'clippy', 'build', 'clippy.swf')
    target_clippy = File.join(@config[:path][:private], 'html', 'clippy.swf')
    t = Template.new(@config, source).generate

    mkdir_for target
    File.open(target, 'w') {|f| f.write t }

    FileUtils.cp source_clippy, target_clippy
  end
end

class MobileHtmlOutput < Output
  def initialize(config)
    @config = config
  end

  protected
  def generate
    source = File.join @config[:path][:templates], 'mobile', 'index.html'
    target = File.join @config[:path][:private], 'html', 'm.cryptobox.html'

    t = Template.new(@config, source).generate

    mkdir_for target
    File.open(target, 'w') {|f| f.write t }
  end
end
