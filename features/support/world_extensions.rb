module CryptoboxWorld
  CORRECT_PASS = 'hi'
  INCORRECT_PASS = 'ih'
  TMP_DIR = File.join(Dir.getwd, 'tmp', 'aruba')
  DB_DIR = File.join(TMP_DIR, 'private')
  DB_FILE = File.join(TMP_DIR, 'private', 'cryptobox')

  def execute(name, input)
    i, o, e, thr = Open3.popen3(name)
    input.each {|line| i.write line}
    i.close
    o.read
    o.close
    e.close

    return thr.value.exitstatus
  end
end

World(CryptoboxWorld)
