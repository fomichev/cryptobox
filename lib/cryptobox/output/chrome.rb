require 'fileutils'

class ChromeOutput < Output
  def initialize(config)
    @config = config
  end

  protected
  def generate
    templates = [
      File.join(@config[:path][:templates], 'chrome', 'popup.rhtml'),
      File.join(@config[:path][:templates], 'chrome', 'manifest.json'),
      File.join(@config[:path][:build], 'chrome', 'background.js'),
      File.join(@config[:path][:build], 'chrome', 'content.js'),
      File.join(@config[:path][:build], 'chrome', 'popup.js'),
    ]
    copy = [
      File.join(@config[:path][:templates], 'chrome', 'icon.png')
    ]
    target_prefix = File.join @config[:path][:private], 'chrome'

    templates.each do |source|
      name = File.basename source
      target = File.join(target_prefix, name).sub(/\.rhtml$/, '.html')
      t = Template.new(@config, source, name).generate

      mkdir_for target
      File.open(target, 'w') {|f| f.write t }
    end

    copy.each do |source|
      name = File.basename source
      target = File.join target_prefix, name

      mkdir_for target
      FileUtils.cp source, target
    end
  end
end
