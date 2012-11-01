require 'erb'

class Template
  def initialize(config, path, embed, vars = {})
    @path = path
    @config = config
    @text = Cryptobox::I18N_TEXT[config[:ui][:lang]]
    @vars = vars
    @embed = embed
  end

  def incl(path)
    verbose "Include #{path}"

    File.open(path, "r:utf-8") { |f| return ERB.new(f.read).result(binding) }
  end

  def generate
    verbose "Process template #{@path}"
    if @path.instance_of? String
      text = File.open(@path, "r:utf-8") { |f| f.read }
    else
      text = JSON.generate(@path)
    end

    ERB.new(text).result(binding)
  end
end
