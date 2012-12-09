require "bundler/setup"

require 'rdoc/task'

require 'cucumber'
require 'cucumber/rake/task'

#require 'rake/package_task'
#
#spec = eval(File.read('cryptobox.gemspec'))
#
#Rake::GemPackageTask.new(spec) do |pkg
#end

Rake::RDocTask.new do |rd|
  rd.main = "README.rdoc"
  rd.rdoc_files.include("README.rdoc", "lib/**/*.rb", "bin/**/*")
  rd.title = 'cryptobox'
end

#Cucumber::Rake::Task.new(:features) do |t|
#  t.cucumber_opts = "features --format progress"
##  t.cucumber_opts = "features/desktop.feature --format pretty"
##  t.cucumber_opts = "features/cryptobox-cat.feature --format pretty"
#  t.fork = false
#end

task :handlebars do
  require 'execjs'

  compiler_path = File.join 'templates', 'extern', 'handlebars', 'handlebars.js'
  context = ExecJS.compile(File.read(compiler_path))

  files = [ 'locked.handlebars', 'unlocked.handlebars' ]

  [ 'chrome', 'desktop', 'mobile' ].each do |app|
    root = File.join 'templates', app
    to = File.join 'build', app, 'templates.js'

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

task :sprockets do
  require 'sprockets'
  require "yui/compressor"

  compress = false
#  compress = true

  def embed_images(text, dirs)
    text.gsub(/url\((?:"|')?([^#?"')]*)([^"')]*)(?:"|')?\)*/) do
      result = nil
      dirs.each do |dir|
        image = File.join(dir, $1)
        next unless File.exist? image

        puts "Embed image #{$1}"
        data = File.open(image, 'rb').read

        result = "url(data:image/png;base64,#{Base64.encode64(data).gsub(/\n/, '')}#{$2})"

        break
      end

      raise "Image #{$1} not found!" unless result
      result
    end
  end

  js = YUI::JavaScriptCompressor.new(:munge => true)
  css = YUI::CssCompressor.new

  build_dir = 'build'
  images_dirs = %w{ templates/extern/bootstrap/img templates/extern/jquery.mobile }

  env = Sprockets::Environment.new
  env.append_path 'templates'
  env.append_path 'build'

  assets = %w{ desktop/index.js.coffee desktop/index.css mobile/index.js.coffee mobile/index.css bookmarklet/fill.js bookmarklet/form.js chrome/background.js.coffee chrome/content.js.coffee chrome/popup.js.coffee chrome/popup.css }

  Dir.mkdir build_dir unless Dir.exist? build_dir

  assets.each do |a|
    filename = File.join(build_dir, a).sub(/\.coffee$/, '')
    dirname = File.dirname(filename)

    Dir.mkdir dirname unless Dir.exist? dirname

    File.open(filename, 'w') do |f|
      content = env[a].to_s

      puts "Process #{filename}..."
      if compress
        content = js.compress(content) if filename =~ /\.js$/
        content = css.compress(content) if filename =~ /\.css$/
      end
      content = embed_images(content, images_dirs) if filename =~ /\.css$/

      # replace </script> with <\/script>
      content.gsub!(/\<\/script\>/, '<\/script>')

      f.write(content)
    end
  end
end

task :documentation do
  `rocco lib/*.rb lib/cryptobox/*.rb templates/*.coffee -o doc`
end
