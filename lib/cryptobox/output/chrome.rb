require 'fileutils'

class ChromeOutput < Output
  def initialize(config, to, embed)
    super

    @config = config
  end

  protected
  def generate
    target_prefix = File.join @to, 'chrome'
    Dir.mkdir(target_prefix) unless Dir.exist?(target_prefix)

    to = File.join(target_prefix, 'cryptobox-config.js')
    File.open(to, 'w') { |f| f.write("cryptobox.config = #{@config.to_json};") }

    from = File.join(@config[:path][:private], 'cryptobox.json')
    to = File.join(target_prefix, 'cryptobox-data.js')
    File.open(to, 'w') { |f| f.write("cryptobox.json = #{File.read(from)};") }

    templates = [
      File.join(@config[:path][:templates], 'chrome', 'popup.rhtml'),
      File.join(@config[:path][:templates], 'chrome', 'manifest.json'),
      File.join(@config[:path][:build], 'chrome', 'background.js'),
      File.join(@config[:path][:build], 'chrome', 'content.js'),
      File.join(@config[:path][:build], 'chrome', 'popup.js'),
    ]
    copy = [
      File.join(@config[:path][:templates], 'chrome', 'icon.png'),
    ]

    templates.each do |source|
      name = File.basename source
      target = File.join(target_prefix, name).sub(/\.rhtml$/, '.html')
      t = Template.new(@config, source, @embed, name).generate

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
