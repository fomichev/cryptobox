def generate_bookmarklet(config)
  verbose "-> GENERATE FILL BOOKMARKLET"

  dirname = File.dirname config[:path][:db_bookmarklet_fill]
  Dir.mkdir dirname unless Dir.exist? dirname

  t = Template.new(config, File.join(config[:path][:templates], 'bookmarklet/fill.js')).generate

  File.open(config[:path][:db_bookmarklet_fill], 'w') {|f| f.write t }

  verbose "-> GENERATE FORM BOOKMARKLET"

  dirname = File.dirname config[:path][:db_bookmarklet_form]
  Dir.mkdir dirname unless Dir.exist? dirname

  t = Template.new(config, File.join(config[:path][:templates], 'bookmarklet/form.js')).generate

  File.open(config[:path][:db_bookmarklet_form], 'w') {|f| f.write t }
end
