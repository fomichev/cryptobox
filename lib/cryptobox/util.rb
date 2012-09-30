module Cryptobox
  def self.symbolize(obj)
    return obj.inject({}){|memo,(k,v)| memo[k.to_sym] =  symbolize(v); memo} if obj.is_a? Hash
    return obj.inject([]){|memo,v    | memo           << symbolize(v); memo} if obj.is_a? Array
    obj
  end

  def self.stringify(obj)
    return obj.inject({}){|memo,(k,v)| memo[k.to_s] =  stringify(v); memo} if obj.is_a? Hash
    return obj.inject([]){|memo,v    | memo         << stringify(v); memo} if obj.is_a? Array
    obj
  end

  def self.yn(prompt)
    loop do
      print "#{prompt} [y/n]: "
      $stdout.flush
      case gets.strip.downcase
      when 'y', 'yes'
        puts
        return true
      when 'n', 'no'
        puts
        return false
      end
    end
  end

  # Ask user password and return it
  def self.ask_password(prompt, interactive)
    i, o = $stdin, $stdout
    i = o = open('/dev/tty', 'w+') if interactive

    o.print prompt
    o.flush

    if i.tty?
      password = i.noecho(&:gets)
    else
      password = i.gets
    end
    o.puts
    o.flush

    i.close if interactive

    return password.sub(/\n$/, '')
  end
end

class Hash
  def symbolize_keys
    Cryptobox::symbolize self
  end

  def stringify_keys
    Cryptobox::stringify self
  end
end

class Array
  def symbolize_keys
    Cryptobox::symbolize self
  end

  def stringify_keys
    Cryptobox::stringify self
  end
end
