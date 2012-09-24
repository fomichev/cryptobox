require 'json'

class JsonOutput < Output
  def initialize(config, db)
    @config, @db = config, db
    @include_paths = [ File.join(config[:path][:db], 'include'), config[:path][:include] ]
  end

  protected
  def generate
    target = File.join @config[:path][:db], 'cryptobox.json'
    result = [ { "type" => "magic", "value" => "270389" } ]

    y = YAML::load(@db.plaintext)

    y.each do |_type, _vars|
      next if _type == 'include'

      raise "Wrong entry '#{_type}' format!" unless _type =~ /^([^\s]+)\s(.+)/
        type_path = $1
      _vars['name'] = $2

      # FIXME: use path separator from File?
      type = type_path.split('/')[0]

      vars = Hash.new {|hash, key| raise "Key #{key} is not found!" }
      vars.merge! _vars.symbolize_keys
      vars.each {|key, value| vars[key] = value.gsub(/\n/, '\n').gsub(/"/, '\"') if vars[key].instance_of? String } # FIXME: do this in runtime !!!

      j = read_include(y, vars, type_path)
      if j == nil
        # we allow nil path only for login entries
        puts "WARNING! didn't find include for #{type_path}"

        j = {
          'type' => 'login',
          'name' => type_path.sub(/login\//, ''),
          'address' => 'http://' + type_path.sub(/login\//, ''),
          'form' => {}
        }
      end

      j['type'] = type
      j['tag'] = ''
      j['tag'] = vars[:tag] if vars.has_key? :tag
      j['visible'] = true
      j['visible'] = vars[:visible] if vars.has_key? :visible

      case type
      when 'login'
        j['form']['vars'] = { 'user' => vars[:name], 'pass' => vars[:pass] }
        j['form']['vars']['secret'] = vars[:secret] if vars.has_key? :secret
        j['form']['vars']['note'] = vars[:note] if vars.has_key? :note
      end

      result << j
    end if y

    cfg = { "pbkdf2" =>
      {
        "salt" => Base64.encode64(@db.pbkdf2_salt).gsub(/\n/, ''),
        "iterations" => @db.pbkdf2_iter
      },
        "aes" =>
      {
        "keylen" => @db.aes_keylen,
        "iv" => Base64.encode64(@db.aes_iv).gsub(/\n/, ''),
      },
      "ciphertext" => @db.encrypt(JSON.pretty_generate result),
      "lock_timeout_minutes" => @config[:ui][:lock_timeout_minutes]
    }


    cfg["page"] = {}
    Cryptobox::I18N_PAGE[@config[:ui][:lang]].each {|k, v| cfg["page"][k.to_s] = v }

    File.open(target, 'w') {|f| f.write JSON.pretty_generate cfg }
  end

  private
  def read_include(y, vars, type_path)
    if y.has_key? 'include' and y['include'].has_key? type_path
      return JSON.parse(Template.new(@config, y['include'][type_path], vars).generate)
    end

    type = type_path.split('/')[0]

    paths = @include_paths.map {|p| File.join(p, type_path) }
    path = paths.each {|p| break p if File.exist? p }

    raise "Unknown entry #{type_path}" if path == nil and type != 'login'

    return JSON.parse(Template.new(@config, path, vars).generate) if path
    return nil
  end
end
