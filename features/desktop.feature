Feature: Desktop HTML

	Background:
		Given desktop HTML

	Scenario: Log in with correct password
		When I open login page
		And I login with correct password
		Then I should see main page

	Scenario: Log in with incorrect password
		When I open login page
		And I login with incorrect password
		Then I should see alert

	Scenario: Log out
		When I log in
		And I click on "lock" button
		Then I should see main page
		And there is no generated elements

	Scenario: Show generate password dialog
		When I log in
		And I click on "show generate password dialog" button
		Then I should see "generate password" dialog

	Scenario: Close generate password dialog
		When I log in
		And I click on "show generate password dialog" button
		And I should see "generate password" dialog
		And I click on "close generate password dialog" button
		Then I should not see "generate password" dialog

	Scenario: Generate password
		When I log in
		And I click on "show generate password dialog" button
		And I click on "generate password" button
		Then field "password" should not be ""

# TODO: filter, page selection, details modal, collapsible items in details
# modal (all this using predefined cryptobox database)
