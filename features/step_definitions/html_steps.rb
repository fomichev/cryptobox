include CryptoboxWorld

def screenshot
  sleep 1 # wait for all fadeIn/Out effects, etc
  page.driver.render "screenshot2.png"
end

When /^I open login page$/ do
  visit('cryptobox.html')
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
  sleep 1
  page.has_css?('#div-alert').should == false
end

Then /^I should see alert$/ do
  sleep 1
  page.has_css?('#div-alert').should == true
  page.should have_selector('#div-alert', visible: true)
end
