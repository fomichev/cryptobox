require 'erb'

class Template
  def initialize(config, path, vars = {})
    @path = path
    @config = config
    @text = Cryptobox::I18N_TEXT[config[:ui][:lang]]
    @vars = vars
  end

  def incl(path)
    verbose "Include #{path}"

#    "/* #{path} */\n" + 
    ERB.new(File.read(path).encode('utf-8')).result(binding)
  end

  def generate
    verbose "Process template #{@path}"
    if @path.instance_of? String
      text = File.read(@path).encode 'utf-8'
    else
      text = JSON.generate(@path)
    end

    ERB.new(text).result(binding)
  end
end
