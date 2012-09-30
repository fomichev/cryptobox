require 'cucumber'
require 'cucumber/rake/task'
require 'rdoc/task'
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

Cucumber::Rake::Task.new(:features) do |t|
#  t.cucumber_opts = "features --format progress"
  t.cucumber_opts = "features/cbcreate.feature --format progress"
#  t.cucumber_opts = "features/desktop.feature --format progress"
#  t.cucumber_opts = "features --format pretty"
  t.fork = false
end

task :handlebars do
  require 'execjs'

  compiler_path = File.join 'templates', 'extern', 'handlebars', 'handlebars.js'
  context = ExecJS.compile(File.read(compiler_path))

  files = [ 'locked.handlebars', 'unlocked.handlebars' ]

  [ 'chrome', 'desktop', 'mobile' ].each do |app|
    root = File.join 'templates', app
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

task :sprockets do
  require 'sprockets'
  require "yui/compressor"

  def embed_images(text, dirs)
    text.gsub(/url\("?([^")]*)"?\)*/) do
      result = nil
      dirs.each do |dir|
        image = File.join(dir, $1)
        next unless File.exist? image

        puts "Embed image #{$1}"
        data = File.read(image)

        result = 'url(data:image/png;base64,' + Base64.encode64(data).gsub(/\n/, '') + ')'
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

  assets = %w{ desktop/index.js desktop/index.css mobile/index.js mobile/index.css bookmarklet/fill.js bookmarklet/form.js chrome/background.js chrome/content.js chrome/popup.js chrome/popup.css }

  Dir.mkdir build_dir unless Dir.exist? build_dir

  assets.each do |a|
    filename = File.join(build_dir, a)
    dirname = File.dirname(filename)

    Dir.mkdir dirname unless Dir.exist? dirname

    File.open(filename, 'w') do |f|
      content = env[a].to_s

      puts "Process #{filename}..."
      content = js.compress(content) if filename =~ /\.js$/
      content = css.compress(content) if filename =~ /\.css$/
      content = embed_images(content, images_dirs) if filename =~ /\.css$/

      f.write(content)
    end
  end
end
