# `Output` class represents base class for all generated applications.
#
#
class Output
  def initialize(config, to, embed)
    @to = to
    @embed = embed
  end

  def run
    verbose "-> Run #{self.class.name} -> #{@to}"

    Dir.mkdir(@to) unless Dir.exist?(@to)
    generate
  end

  private
  def mkdir_for(filename)
    dirname = File.dirname filename
    Dir.mkdir dirname unless Dir.exist? dirname
  end
end
