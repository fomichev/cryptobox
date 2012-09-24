class Output
  def run
    puts "-> Run #{self.class.name}"

    generate
  end

  private
  def mkdir_for(filename)
    dirname = File.dirname filename
    Dir.mkdir dirname unless Dir.exist? dirname
  end
end
