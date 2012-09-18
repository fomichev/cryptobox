require 'json'

def generate_json(config, db)
  verbose "-> GENERATE JSON"

  result = [ { "type" => "magic", "value" => "270389" } ]

  y = YAML::load(db.plaintext)

  y.each do |_type, _vars|
    # FIXME: use path separator from File?

    raise "Wrong entry '#{_type}' format!" unless _type =~ /^([^\s]+)\s(.+)/
    type_path = $1
    _vars['name'] = $2

    type = type_path.split('/')[0]
    path = if File.exist? File.join(config[:path][:db_include], type_path)
             File.join(config[:path][:db_include], type_path)
           elsif File.exist? File.join(config[:path][:include], type_path)
             File.join(config[:path][:include], type_path)
           end

    raise "Unknown entry #{type_path}" if path == nil and type != 'login'

    vars = Hash.new {|hash, key| raise "Key #{key} is not found!" }
    vars.merge! _vars.symbolize_keys
    vars.each {|key, value| vars[key] = value.gsub(/\n/, '\n').gsub(/"/, '\"') if vars[key].instance_of? String } # FIXME: do this in runtime !!!

    j = if path
          JSON.parse(Template.new(config, path, vars).generate)
        else
          # we allow nil path only for login entries
          puts "WARNING! didn't find include for #{type_path}"

          {
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
  end

  cfg = { "pbkdf2" =>
    {"salt_len" => Cryptobox::Db::PBKDF2_SALT_LEN,
      "salt" => Base64.encode64(db.pbkdf2_salt).gsub(/\n/, ''),
      "iterations" => db.pbkdf2_iter
    },
    "aes" =>
    {"iv_len" => Cryptobox::Db::AES_IV_LEN,
      "iv" => Base64.encode64(db.aes_iv).gsub(/\n/, ''),
    },
    "ciphertext" => db.encrypt(JSON.pretty_generate result)
  }


  cfg["page"] = {}
  Cryptobox::I18N_PAGE[config[:ui][:lang]].each {|k, v| cfg["page"][k.to_s] = v }

  File.open(config[:path][:db_json], 'w') {|f| f.write JSON.pretty_generate cfg }
end
