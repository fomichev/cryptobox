require 'rbconfig'
$is_windows = (RbConfig::CONFIG['host_os'] =~ /mswin|mingw|cygwin/)


$fifo_name='myfifo3'
$initial_text=<<END
blah blah blah
hello
END
$text=''

def mkfifo(name)
	puts "create fifo #{name}"
	File.unlink name rescue nil
	system "mkfifo --mode=0600 #{name}"
end

def open_editor(fifo_name)
	puts "open editor"
	editor='gvim -n -f'
#	editor='vim -n'

	return Thread.new do
		puts '>>>'
		ret = system "#{editor} #{fifo_name}"
		puts "<<< #{ret}"
	end
end

def write_initial(fifo_name, text)
	File.open(fifo_name, 'w') do |f|
		f.write(text)
	end
end

def read_back(fifo_name, initial_text)
	return Thread.new do
		puts __LINE__
		loop do
			puts __LINE__
			$text = IO.read(fifo_name)
#			puts __LINE__
			# on windows this ^^^ loops
			sleep 0.1 if $is_windows
		end
		puts __LINE__
	end
end

def done(initial_text, text)
	if text == '__no_save__'
		puts 'no save'
		return
	end

	puts 'save:'
	if initial_text == text
		puts 'got the same text'
		return
	end

	print text
end

def cleanup(name)
	File.unlink name
end

puts __LINE__
mkfifo $fifo_name
puts __LINE__
editor_thread = open_editor $fifo_name
puts __LINE__
write_thread = write_initial $fifo_name, $initial_text
puts __LINE__
readback_thread = read_back $fifo_name, $initial_text
puts __LINE__

# wait for editor
puts __LINE__
editor_thread.join
readback_thread.join 1 # 1 second should be enough to read from fifo
readback_thread.kill

puts __LINE__
# remove fifo
cleanup $fifo_name
puts __LINE__

unless $text.empty?
	done $initial_text, $text
end
