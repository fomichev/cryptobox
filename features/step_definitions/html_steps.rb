include CryptoboxWorld

def wait_for_load
  wait_until do
    page.evaluate_script('$(":animated").length') == 0
    page.evaluate_script('$(".active").length') == 0
  end
end

def screenshot
  page.driver.render "screenshot.png"
end

Given /^desktop HTML$/ do
  @desktop = true
  @mobile = false

  steps %Q{
    And empty database
    When I run cryptobox "edit --no-edit"
    And I enter correct password
    Then the exit status should be 0
  }
end

Given /^mobile HTML$/ do
  @desktop = false
  @mobile = true

  steps %Q{
    And empty database
    When I run cryptobox "edit --no-edit"
    And I enter correct password
    Then the exit status should be 0
  }
end

When /^I open login page$/ do
  visit('cryptobox.html') if @desktop
  visit('m.cryptobox.html') if @mobile

  # wait for all animations to complete
  wait_for_load
  # and disable them altogether
  page.execute_script('$.support.transition = undefined;')
  page.execute_script('$.fx.off = true;')
end

When /^I login with correct password$/ do
  fill_in 'input-password', :with => CORRECT_PASS
  click_button 'button-unlock'
end

When /^I login with incorrect password$/ do
  fill_in 'input-password', :with => @incorrect_pass
  click_button 'button-unlock'
end

Then /^I should see main page$/ do
  page.has_css?('#div-alert', :visible => true).should == false
end

Then /^there is no generated elements$/ do
  page.all('.generated').should == []
end

Then /^I should see alert$/ do
  page.has_css?('#div-alert', :visible => true).should == true
end

When /^I log in$/ do
  steps %Q{
    When I open login page
    And I login with correct password
    Then I should see main page
  }
end

When /^I click on "(.*?)" button$/ do |name|
  case name
  when 'lock'
    click_link 'button-lock' if @desktop
    page.find('.button-lock').click if @mobile
  when 'generate password'
    click_link 'button-generate'
  when 'show generate password dialog'
    click_link 'button-generate-show'
  when 'close generate password dialog'
    click_link 'button-generate-close'
  else
    raise 'Unknown thing to click on!'
  end
end

def should_see_dialog(name, visible)
  case name
  when 'generate password'
    page.has_css?('#div-generate', :visible => true).should == visible
  else
    raise 'Unknown dialog!'
  end
end

Then /^I should see "(.*?)" dialog$/ do |name|
  should_see_dialog(name, true)
end

Then /^I should not see "(.*?)" dialog$/ do |name|
  should_see_dialog(name, false)
end

Then /^field "(.*?)" should not be "(.*?)"$/ do |name, value|
  case name
  when 'password'
    find_field('input-generated-password').value.should_not == value
  else
    raise 'Unknown form field!'
  end
end
