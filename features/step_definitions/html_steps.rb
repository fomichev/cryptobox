include CryptoboxWorld

def wait_for_load
  wait_until do
    page.evaluate_script('$(":animated").length') == 0
  end
end

def screenshot
  wait_for_load
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
  wait_for_load
  page.has_css?('#div-alert', :visible => true).should == false
end

Then /^there is no generated elements$/ do
  page.all('.generated').should == []
end

Then /^I should see alert$/ do
  wait_for_load
  page.has_css?('#div-alert').should == true
  page.should have_selector('#div-alert', visible: true)
end

When /^I log in$/ do
  steps %Q{
    When I open login page
    And I login with correct password
    Then I should see main page
  }
end

When /^I click on "(.*?)"$/ do |name|
  wait_for_load
  case name
  when 'lock button'
    click_link 'button-lock' if @desktop
    page.find('.button-lock').click if @mobile
  else
    raise 'Unknown thing to click on!'
  end
end
