include CryptoboxWorld

def screenshot
  sleep 1 # wait for all fadeIn/Out effects, etc
  page.driver.render "screenshot2.png"
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

def wait_for_load
  sleep 1
end

Then /^I should see main page$/ do
  wait_for_load
  page.has_css?('#div-alert', :visible => true).should == false
end

Then /^I should see alert$/ do
  wait_for_load
  page.has_css?('#div-alert').should == true
  page.should have_selector('#div-alert', visible: true)
end
