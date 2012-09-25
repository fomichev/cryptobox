Feature: User creates new database
	As a first step, we have to be able to create an empty database.

	Scenario: Create new database with matching passwords
		No database created so far, so we just want to create a new one.
		If we provide valid password two times, there should be new
		empty database.

		Given no database
		When I run `ruby ../../bin/cbcreate` interactively
		And I type "hi"
		And I type "hi"
		Then the exit status should be 0
		And a file named "private/cryptobox" should exist
		And the stdout should contain exactly:
			"""
			Password: 
			Confirm password: 

			"""

	Scenario: Create new database with non-matching password
		No database created so far, but we try to create one with
		mismatching passwords. Surely enough, there is no database
		created.

		Given no database
		When I run `ruby ../../bin/cbcreate` interactively
		And I type "one"
		And I type "two"
		Then the exit status should be 1
		And a file named "private/cryptobox" should not exist
		And the stdout should contain:
			"""
			Password: 
			Confirm password: 
			Passwords don't match!

			"""

	Scenario: Override existing database
		We have existing database and we try to create a new one.
		Application have to ask us whether we want to override the
		existing database. We answer 'y' and we should see new
		database and the old one backed up.

		Given empty database
		When I run `ruby ../../bin/cbcreate` interactively
		And the stdout should contain:
			"""
			Password: 
			Confirm password: 
			Passwords don't match!

			"""



#	Scenario: Try to override existing database
#		We have an existing database, but we accidentally try to create
#		a new one. We say 'n' to the question asking us whether we
#		want to override our database. As an outcome, we should
#		not see database update and new backup.
#
#	Scenario: create new database and check its default content
#		Default database content should be "# Lines started with # are
#		comments", check it.
#	
