module CryptoboxWorld
  CORRECT_PASS = 'hi'
  INCORRECT_PASS = 'ih'
  TMP_DIR = File.join(Dir.getwd, 'tmp')
  DB_DIR = File.join(TMP_DIR, 'cryptobox')
  DB_FILE = File.join(TMP_DIR, 'cryptobox', 'cryptobox.yaml')

  def execute(name, input)
    i, o, e, thr = Open3.popen3(name)
    input.each {|line| i.write line}
    i.close

    File.open(File.join(TMP_DIR, 'exec.log'), 'w') do |f|
      f.puts "COMMAND=#{name}"
      f.puts "STDOUT=#{o.read}"
      f.puts "STDERR=#{e.read}"
    end
    o.close
    e.close

    return thr.value.exitstatus
  end
end

World(CryptoboxWorld)
