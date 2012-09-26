module CryptoboxWorld
  CORRECT_PASS = 'hi'
  INCORRECT_PASS = 'ih'
  DATABASE_DIR = File.join('private')
  DATABASE_FILE = File.join('private', 'cryptobox')

  def execute(name, input)
    i, o, e, thr = Open3.popen3('ruby ../../bin/#{name}')
    input.each {|line| i.puts line}
    i.close
    o.read
    o.close
    e.close
    return thr.value.exitstatus
  end
end

World(CryptoboxWorld)
