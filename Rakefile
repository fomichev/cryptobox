require "bundler/setup"

require 'cucumber'
require 'cucumber/rake/task'

#require 'rake/package_task'
#
#spec = eval(File.read('cryptobox.gemspec'))
#
#Rake::GemPackageTask.new(spec) do |pkg
#end

task :default => [:test]

Cucumber::Rake::Task.new(:test) do |t|
  t.cucumber_opts = "features --format progress"
  t.fork = false
end

Cucumber::Rake::Task.new(:test_html) do |t|
  t.cucumber_opts = "features/desktop.feature features/mobile.feature --format pretty"
  t.fork = false
end

desc "Preprocess Handlebars templates and generate JavaScript"
task :handlebars do
  require 'execjs'

  compiler_path = File.join 'src', 'extern', 'handlebars', 'handlebars.js'
  context = ExecJS.compile(File.read(compiler_path))

  files = [ 'locked.handlebars', 'unlocked.handlebars' ]

  [ 'chrome', 'desktop', 'mobile' ].each do |app|
    root = File.join 'src', app
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

desc "Populate build directory with compressed and embedded JavaScript and CSS"
task :sprockets, :compress do |t, args|
  require 'sprockets'
  require "yui/compressor"

  compress = (args[:compress] || 1).to_i

  puts "Enabled CSS and JavaScript compression" if compress == 1

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
  images_dirs = %w{ src/extern/bootstrap/img src/extern/jquery.mobile }

  env = Sprockets::Environment.new
  env.append_path 'src'
  env.append_path 'build'

  assets = %w{
    desktop/index.js.coffee
    desktop/index.css
    mobile/index.js.coffee
    mobile/index.css
    bookmarklet/form.js.coffee
    chrome/background.js.coffee
    chrome/content.js.coffee
    chrome/popup.js.coffee
    chrome/popup.css }

  Dir.mkdir build_dir unless Dir.exist? build_dir

  assets.each do |a|
    filename = File.join(build_dir, a).sub(/\.coffee$/, '')
    dirname = File.dirname(filename)

    Dir.mkdir dirname unless Dir.exist? dirname

    File.open(filename, 'w') do |f|
      content = env[a].to_s

      puts "Process #{filename}..."
      if compress == 1
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

task :doc do
  tool = 'rocco' # may use docco when node.js is available

  `#{tool}
     lib/*.rb
     lib/cryptobox/*.rb
     lib/cryptobox/command/*.rb
     lib/cryptobox/output/*.rb
     src/*.coffee
     src/bookmarklet/*.coffee
     src/chrome/*.coffee
     src/desktop/*.coffee
     src/mobile/*.coffee
     -o doc`
end
