require 'json'

# Class that generates cryptobox.json.
class JsonOutput < Output
  def initialize(config, to, embed, db)
    super config, to, embed

    @config, @db = config, db
    @include_paths = [ File.join(@to, 'include'), config[:path][:include] ]
  end

  protected
  def generate
    target = File.join @to, 'cryptobox.json'
    target_config = File.join @to, 'cryptobox-config.json'
    result = []

    @db.each do |vars, includes|
      j = read_include(includes, vars, vars[:type_path])
      if j == nil
        # we allow nil path only for webform entries
        puts "WARNING! didn't find include for #{vars[:type_path]}"

        j = {
          'type' => 'webform',
          'name' => vars[:type_path].sub(/webform\//, ''),
          'address' => 'http://' + vars[:type_path].sub(/webform\//, ''),
          'form' => {}
        }
      end

      j['type'] = vars[:type]
      j['tag'] = ''
      j['tag'] = vars[:tag] if vars.has_key? :tag
      j['visible'] = true
      j['visible'] = vars[:visible] if vars.has_key? :visible

      case vars[:type]
      when 'webform'
        j['form']['vars'] = { 'user' => vars[:name], 'pass' => vars[:pass] }
        j['form']['vars']['secret'] = vars[:secret] if vars.has_key? :secret
        j['form']['vars']['note'] = vars[:note] if vars.has_key? :note
      end

      result << j
    end

    json = { "pbkdf2" =>
      {
        "salt" => Base64.encode64(@db.pbkdf2_salt).gsub(/\n/, ''),
        "iterations" => @db.pbkdf2_iter
      },
        "aes" =>
      {
        "keylen" => @db.aes_keylen,
        "iv" => Base64.encode64(@db.aes_iv).gsub(/\n/, ''),
      },
      "ciphertext" => @db.encrypt(JSON.pretty_generate result)
    }

    File.open(target, 'w') {|f| f.write JSON.pretty_generate json }
  end

  private
  def read_include(includes, vars, type_path)
    if includes.has_key? type_path
      data = Template.new(@config, includes[type_path], @embed, vars).generate
      return JSON.parse(data)
    end

    type = type_path.split('/')[0]

    paths = @include_paths.map {|p| File.join(p, type_path) }
    path = nil
    paths.each do |p|
      if File.exist? p
        path = p
        break
      end
    end

    raise "Unknown entry #{type_path}" if path == nil and type != 'webform'

    if path
      return JSON.parse(Template.new(@config, path, @embed, vars).generate)
    else
      return nil
    end
  end
end
