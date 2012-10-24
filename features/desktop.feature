Feature: desktop HTML

	Scenario: Log in with correct password
		Given empty database
		When I open login page
		And I login with correct password
		Then I should see main page

	Scenario: Log in with incorrect password
		Given empty database
		When I open login page
		And I login with incorrect password
		Then I should see alert
