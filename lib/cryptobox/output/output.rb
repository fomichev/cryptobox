# Output class represents base class for all generated applications.
class Output
  # Create class instance with *config* which will produce output in the *to*
  # directory. *embed* parameter specifies whether to embed cryptobox.json or
  # not.
  def initialize(config, to, embed)
    @to = to
    @embed = embed
  end

  # Generate application
  def run
    verbose "-> Run #{self.class.name} -> #{@to}"

    Dir.mkdir(@to) unless Dir.exist?(@to)
    generate
  end

  # Classes that derive from the current one should override this method
  # and do actual generation here.
  protected
  def generate
  end

  # This private method create directory for given file.
  private
  def mkdir_for(filename)
    dirname = File.dirname filename
    Dir.mkdir dirname unless Dir.exist? dirname
  end
end
