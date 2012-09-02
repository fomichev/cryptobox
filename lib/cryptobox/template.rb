require 'erb'

class Template
  def initialize(config, path, vars = {})
    @path = path
    @config = config
    @text = Cryptobox::I18N_TEXT[config[:ui][:lang]]
    @vars = vars
  end

  def incl_plain(path)
    verbose "Include plain #{path}"

    "/* #{path} */\n" + IO.read(path)
  end

  def incl(path)
    verbose "Include #{path}"

    "/* #{path} */\n" + ERB.new(File.read(path)).result(binding)
  end

  def generate
    verbose "Process template #{@path}"

    template = File.read(@path)
    ERB.new(template).result(binding)
  end
end
