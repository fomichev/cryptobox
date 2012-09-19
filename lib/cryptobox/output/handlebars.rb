def generate_handlebars(config)
  files = [ 'locked.handlebars', 'unlocked.handlebars' ]

  [ 'chrome', 'desktop', 'mobile' ].each do |name|
    root = File.join config[:path][:templates], name
    to = 'templates.js'

    exist = []
    files.each {|f| exist << f if File.exist? File.join root, f }

    # TODO: apply optimizations
    # handlebars <input> -f <output> -k each -k if -k unless
    Dir.chdir(root) { `handlebars #{exist.join ' '} -f #{to}` } if exist.size != 0
  end
end

