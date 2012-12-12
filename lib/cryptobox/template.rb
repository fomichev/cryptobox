require 'erb'

# Simple wrapper around ERB which sets appropriate context and defines
# some helper methods.
class Template
  # Create new instance of Template with *config*; load template source from
  # *path*. *embed* is passed to templates as is (from the Output instance)
  # and  indicates whether to embed cryptobox.json or not. *vars* are
  # template specific variables.
  def initialize(config, path, embed, vars = {})
    @path = path
    @config = config

    @text = Cryptobox::I18N_TEXT[config[:ui][:lang]]
    @vars = vars
    @embed = embed
  end

  # Helper method that includes and processes template in context of current
  # object.
  def incl(path)
    verbose "Include #{path}"

    File.open(path, "r:utf-8") { |f| return ERB.new(f.read).result(binding) }
  end

  # Do actual template processing.
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
