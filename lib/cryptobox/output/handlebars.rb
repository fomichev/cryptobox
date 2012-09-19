#require 'execjs'

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

def __generate_handlebars(config)
  filename = File.join config[:path][:templates], 'chrome', 'locked.handlebars'

  compiler_path = File.join config[:path][:templates], 'extern', 'handlebars', 'handlebars.min.js'
  context = ExecJS.compile(File.read(compiler_path))

  result = "(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};\n"

  name = File.basename(data_filename).sub(/\.handlebars$/, '')
  compiled = context.call('Handlebars.precompile', File.read(filename))

  result += "templates['#{name}'] = template(#{compiled})"


  result += "\n})();"

  puts result
end
