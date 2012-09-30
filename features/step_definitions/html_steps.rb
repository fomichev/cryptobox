When /^I open login page$/ do
  visit('cryptobox.html')
end

When /^I login with correct password$/ do
  fill_in 'input-password', :with => @correct_pass
  click_button 'button-unlock'

#  page.save_screenshot 'screenshot.png'
#print page.html
  puts page.driver.alert_messages.inspect
#  page.driver.error_messages

  print page.driver.methods.sort.inspect
  page.driver.render "screenshot.png"
end

When /^I login with incorrect password$/ do
  fill_in 'input-password', :with => @incorrect_pass
  click_button 'button-unlock'
end

Then /^I should see main page$/ do
    #pending # express the regexp above with the code you wish you had
end

Then /^I should see alert$/ do
  alert = page.driver.browser.switch_to.alert
  alert.text.should == "Incorrect password! Error: Malformed UTF-8 data"
  alert.accept
end
