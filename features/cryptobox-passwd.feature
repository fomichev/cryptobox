Feature: User changes database password

	Scenario: Change password
		We have a existing database and want to change password.
		After user types password correctly two times, we can access
		new database using only new password.

		Given empty database
		And the database can be unlocked with "hi"
		When I run cryptobox "passwd"
		And I enter correct password
		And I type "password"
		And I type "password"
		Then the exit status should be 0
		And the number of backups should be 1
		And the database can be unlocked with "password"
		And the database can not be unlocked with "hi"
		And the stdout should contain exactly:
			"""
			Password:
			New password:
			Confirm password:

			"""

	Scenario: Use different password when changing password
		We have a existing database and want to change password.
		After user types two different password, we should get error
		message and database should be accessible using old password.

		Given empty database
		And the database can be unlocked with "hi"
		When I run cryptobox "passwd"
		And I enter correct password
		And I type "password"
		And I type "other_password"
		Then the exit status should be 1
		And the number of backups should be 0
		And the database can be unlocked with "hi"
		And the stderr should contain exactly:
			"""
			error: Passwords don't match!

			"""
