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
