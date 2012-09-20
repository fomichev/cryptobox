require 'execjs'

def generate_handlebars(config)
  compiler_path = File.join config[:path][:templates], 'extern', 'handlebars', 'handlebars.min.js'
  context = ExecJS.compile(File.read(compiler_path))

  files = [ 'locked.handlebars', 'unlocked.handlebars' ]

  [ 'chrome', 'desktop', 'mobile' ].each do |app|
    root = File.join config[:path][:templates], app
    to = File.join root, 'templates.js'

    result = "(function() {\n  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};"

    files.each do |f|
      filename = File.join root, f
      next unless File.exist? filename

      template_name = File.basename(filename).sub(/\.handlebars$/, '')
      compiled = context.call('Handlebars.precompile', File.read(filename))

      result += "\ntemplates['#{template_name}'] = template(#{compiled});"
    end

    result += "\n})();"

    File.open(to, 'wb') {|f| f.write result }
  end
end
