require 'fileutils'
require 'open3'

Given /^no database$/ do
  FileUtils.rm_rf @cryptobox_database
  Dir.exist?(@cryptobox_database).should be_false
end

Given /^empty database$/ do
  Dir.mkdir(@dirs[0]) unless Dir.exist? @dirs[0]
  Dir.chdir(@dirs[0]) do
    FileUtils.rm_rf @cryptobox_database
    File.exist?(@cryptobox_file).should be_false

    i, o, e = Open3.popen3('ruby ../../bin/cbcreate')
    i.puts @correct_pass
    i.puts @correct_pass
    o.read
    i.close
    o.close
    e.close

    File.exist?(@cryptobox_file).should be_true
  end
end

When /^I enter correct password$/ do
  steps %{
  When I type "#{@correct_pass}"
  }
end

When /^I enter incorrect password$/ do
  steps %{
  When I type "#{@incorrect_pass}"
  }
end

When /^the number of backups is (\d+)$/ do |expected_number|
  backup_dir = File.join(@dirs, 'private', 'backup')

  expected_number = expected_number.to_i
  Dir.exist?(backup_dir).should be_true if expected_number > 0

  if Dir.exist?(backup_dir)
    number = Dir.entries(backup_dir).size - 2
    number.should == expected_number
  end
end

Then /^the database can be unlocked with "(.*?)"$/ do |pwd|
  Dir.chdir(@dirs[0]) do
    i, o, e, thr = Open3.popen3('ruby ../../bin/cbedit --no-edit --no-update')
    i.puts pwd
    o.read
    i.close
    o.close
    e.close
    thr.value.exitstatus.should == 0
  end
end

Then /^the database can not be unlocked with "(.*?)"$/ do |pwd|
  Dir.chdir(@dirs[0]) do
    i, o, e, thr = Open3.popen3('ruby ../../bin/cbedit --no-edit --no-update')
    i.puts pwd
    o.read
    i.close
    o.close
    e.close
    thr.value.exitstatus.should == 1
  end
end
