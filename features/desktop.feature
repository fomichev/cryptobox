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
		And I click on "lock button"
		Then I should see main page
		And there is no generated elements
