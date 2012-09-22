def generate_bookmarklet(config)
  verbose "-> GENERATE FILL BOOKMARKLET"

  dirname = File.dirname config[:path][:db_bookmarklet_fill]
  Dir.mkdir dirname unless Dir.exist? dirname

  t = Template.new(config, File.join('build', 'bookmarklet', 'fill.js')).generate

  File.open(config[:path][:db_bookmarklet_fill], 'w') do|f|
    f.write t
    f.write 'function getCryptoboxConfig() { return ' + File.read(config[:path][:db_json]) + '; }'
  end

  verbose "-> GENERATE FORM BOOKMARKLET"

  dirname = File.dirname config[:path][:db_bookmarklet_form]
  Dir.mkdir dirname unless Dir.exist? dirname

  t = Template.new(config, File.join('build', 'bookmarklet', 'form.js')).generate

  File.open(config[:path][:db_bookmarklet_form], 'w') {|f| f.write t }
end
