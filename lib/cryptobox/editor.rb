require 'rbconfig'

$is_windows = (RbConfig::CONFIG['host_os'] =~ /mswin|mingw|cygwin/)
$text = ''

def mkfifo(name)
  puts "create fifo #{name}"
  File.unlink name rescue nil
  system "mkfifo -m 600 #{name}"
end

def open_editor(editor, fifo_name)
  puts "open editor"

  return Thread.new do
    puts '>>>'
    ret = system "#{editor} #{fifo_name}"
    puts "<<< ret=#{ret}"

    unless ret
      raise "Couldn't run editor!"
    end
  end
end

def write_initial(fifo_name, text)
  puts "write data"
  File.write(fifo_name, text)
end

def read_back(fifo_name, initial_text)
  return Thread.new do
    puts __LINE__
    loop do
      puts __LINE__
      $text = File.read(fifo_name)
      puts __LINE__
      # on windows this ^^^ loops
      sleep 0.1 if $is_windows
      sleep 1
    end
    puts __LINE__
  end
end

def done(initial_text, text)
  if text == '__no_save__'
    puts 'no save'
    return nil
  end

  puts 'save:'
  if initial_text == text
    puts 'got the same text'
    return nil
  end

  return text
end

def cleanup(name)
  File.unlink name
end

def on_signal(name, t1, t2)
  t1.kill
  t2.kill if t2
  cleanup name
  exit 1
end

def edit_fifo(fifo_name, editor, initial_text)
  mkfifo fifo_name
  editor_thread = open_editor editor, fifo_name
  write_initial fifo_name, initial_text
  readback_thread = read_back fifo_name, initial_text

  trap("INT") { on_signal fifo_name, editor_thread, readback_thread }
  trap("ABRT") { on_signal fifo_name, editor_thread, readback_thread }
  trap("QUIT") { on_signal fifo_name, editor_thread, readback_thread } unless $is_windows

  # wait for editor
  editor_thread.join
  readback_thread.join 1 # 1 second should be enough to read from fifo
  readback_thread.kill

  cleanup fifo_name

  $text
end

def edit_file(fifo_name, editor, initial_text)
  File.open(fifo_name, 'w') { |f| f.write initial_text }

  editor_thread = open_editor editor, fifo_name

  trap("INT") { on_signal fifo_name, editor_thread, nil }
  trap("ABRT") { on_signal fifo_name, editor_thread, nil }
  trap("QUIT") { on_signal fifo_name, editor_thread, nil } unless $is_windows

  editor_thread.join

  text = File.read(fifo_name)
  # TODO: rewrite file data with random pattern
  cleanup fifo_name

  text
end

def edit(home, editor, initial_text)
  fifo_name = (0...8).map{65.+(rand(25)).chr}.join + '.yml'
  text = nil

  Dir.chdir(home) do
    if $is_windows
      text = edit_file(fifo_name, editor, initial_text)
    else
      text = edit_fifo(fifo_name, editor, initial_text)
    end
  end

  unless text.empty?
    result = done initial_text, text
  end

  return initial_text if result == nil
  return text
end
