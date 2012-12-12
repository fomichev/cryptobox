require 'rbconfig'
require 'securerandom'

# Class that abstracts external editor.
class Editor
  # Initialize Editor instance. *home* specifies home directory which is
  # used to store temporary file or pipe; *editor* specifies command which is
  # used to start editor; text that editor will contain is passed via
  # *initial_text*; *use_pipe* argument specifies whether to use pipe or
  # regular file for communication with editor.
  def initialize(home, editor, initial_text, use_pipe)
    #@home = home
    @home = Dir.pwd
    @editor = editor
    @initial_text = initial_text
    @use_pipe = use_pipe

    @initial_text = "\n" if @initial_text.size == 0

    @on_windows = (RbConfig::CONFIG['host_os'] =~ /mswin|mingw|cygwin/)
    @text = ''
  end

  # Start editor. This command block until editor is finished and returns
  # new text (it may be equal to *initial_text* when user did not changes).
  def run
    fifoname = (0...8).map{65.+(SecureRandom.random_number(25)).chr}.join + '.yml'
    text = nil

    Dir.chdir(@home) do
      if @on_windows or @use_pipe == false
        @is_pipe = false
        text = edit_file(fifoname, @editor, @initial_text)
      else
        @is_pipe = true
        text = edit_fifo(fifoname, @editor, @initial_text)
      end
    end

    unless text.empty?
      result = done @initial_text, text
    end

    return @initial_text if result == nil
    return text
  end

  private

  # Signal handler which cleans up file with given *name* and kills two
  # threads (*t1* and optionally *t2*).
  def on_signal(name, t1, t2)
    t1.kill
    t2.kill if t2
    cleanup name
    exit 1
  end

  # Simple wrapper around UNIX mkfifo tool.
  def mkfifo(name)
    File.unlink name rescue nil
    system "mkfifo -m 600 #{name}"
  end

  # Start *editor* and edit *filename*.
  def open_editor(writer, editor, filename)
    return Thread.new do
      if writer
        dbg 'Wait for writer thread to sleep (open fifo for writing)...'
        sleep 0.1 while writer.status != 'sleep'
      end

      dbg 'Starting editor...'
      ret = system "#{editor} #{filename}"
      dbg "Editor exited with #{ret}"

      raise "Couldn't run editor!" unless ret
    end
  end

  # Read back and return changed (or not) text from the fifo with *fifoname*
  # name.
  def read_back(fifoname)
    return Thread.new do
      dbg 'Start read back thread...'
      loop do
        dbg 'Read back thread: wait for new data to arrive...'
        @text = File.open(fifoname, 'rb') { |f| f.read }
        dbg 'Read back thread: got it'
        # on windows this ^^^ loops
        sleep 0.1 if @on_windows
        sleep 1 #?
      end
      dbg 'Stop read back thread...'
    end
  end

  # This routine return *nil* if file was not saved or *initial_text* equals
  # to *text*.
  def done(initial_text, text)
    if text == '__no_save__'
      dbg '__no_save__'
      return nil
    end

    dbg 'Save text'
    if initial_text == text
      dbg 'Got the same text'
      return nil
    end

    return text
  end

  # Cleanup file with given *name* (override it with patter).
  def cleanup(name)
    override_data(name, File.size(name)) unless @is_pipe
    File.unlink name
  end

  # Run *editor* to edit *filename* (file) with *initial_text*.
  def edit_file(filename, editor, initial_text)
    File.open(filename, 'wb') { |f| f.write initial_text }

    editor_thread = open_editor nil, editor, filename

    trap("INT") { on_signal filename, editor_thread, nil }
    trap("ABRT") { on_signal filename, editor_thread, nil }
    trap("QUIT") { on_signal filename, editor_thread, nil } unless @on_windows

    editor_thread.join

    text = File.open(filename, 'rb') { |f| f.read }
    cleanup filename

    text
  end

  # Run *editor* to edit *fifoname* (fifo) with *initial_text*.
  def edit_fifo(fifoname, editor, initial_text)
    mkfifo fifoname

    editor_thread = open_editor Thread.current, editor, fifoname

    dbg "Open pipe for writing"
    w = File.open(fifoname, 'wb')
    dbg "Ok, got reader, write data"

    sleep 1 # Removing this sleep makes vim hang; it's not clear why.
    w.write(initial_text)
    w.close

    readback_thread = read_back fifoname

    trap("INT") { on_signal fifoname, editor_thread, readback_thread }
    trap("ABRT") { on_signal fifoname, editor_thread, readback_thread }
    trap("QUIT") { on_signal fifoname, editor_thread, readback_thread } unless @on_windows

    # wait for editor
    editor_thread.join
    readback_thread.join 1 # 1 second should be enough to read from fifo
    readback_thread.kill

    cleanup fifoname

    @text
  end

  # Override file contents with predefined pattern to make it hard to restore
  # plaintext data from the disk.
  #
  # Implementation is solely based on:
  # http://www.cs.auckland.ac.nz/~pgut001/pubs/secure_del.html
  def override_data(filename, size)
    def override_with_pattern(filename, size, pattern)
      i = pattern.cycle unless pattern.instance_of? Proc

      File.open(filename, "wb") do |f|
        size.times do
          if pattern.instance_of? Proc
            c = pattern.call
          else
            c = i.next
          end

          f.write [ c ].pack("C")
        end
      end
    end

    4.times { override_with_pattern(filename, size, Proc.new { SecureRandom.random_number(256) } ) }

    override_with_pattern(filename, size, [ 0x55 ] )
    override_with_pattern(filename, size, [ 0xAA ] )
    override_with_pattern(filename, size, [ 0x92, 0x49, 0x24 ] )
    override_with_pattern(filename, size, [ 0x49, 0x24, 0x92 ] )
    override_with_pattern(filename, size, [ 0x24, 0x92, 0x49 ] )
    override_with_pattern(filename, size, [ 0x00 ] )
    override_with_pattern(filename, size, [ 0x11 ] )
    override_with_pattern(filename, size, [ 0x22 ] )
    override_with_pattern(filename, size, [ 0x33 ] )
    override_with_pattern(filename, size, [ 0x44 ] )
    override_with_pattern(filename, size, [ 0x55 ] )
    override_with_pattern(filename, size, [ 0x66 ] )
    override_with_pattern(filename, size, [ 0x77 ] )
    override_with_pattern(filename, size, [ 0x88 ] )
    override_with_pattern(filename, size, [ 0x99 ] )
    override_with_pattern(filename, size, [ 0xAA ] )
    override_with_pattern(filename, size, [ 0xBB ] )
    override_with_pattern(filename, size, [ 0xCC ] )
    override_with_pattern(filename, size, [ 0xDD ] )
    override_with_pattern(filename, size, [ 0xEE ] )
    override_with_pattern(filename, size, [ 0xFF ] )
    override_with_pattern(filename, size, [ 0x92, 0x49, 0x24 ] )
    override_with_pattern(filename, size, [ 0x49, 0x24, 0x92 ] )
    override_with_pattern(filename, size, [ 0x24, 0x92, 0x49 ] )
    override_with_pattern(filename, size, [ 0x6D, 0xB6, 0xDB ] )
    override_with_pattern(filename, size, [ 0xB6, 0xDB, 0x6D ] )
    override_with_pattern(filename, size, [ 0xDB, 0x6D, 0xB6 ] )

    4.times { override_with_pattern(filename, size, Proc.new { SecureRandom.random_number(256) } ) }
  end

  def dbg(m)
    #$stderr.puts m
  end
end
