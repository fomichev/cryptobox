Feature: User creates new database
	As a first step, we have to be able to create an empty database.

	Scenario: Create new database with matching passwords
		No database created so far, so we just want to create a new one.
		If we provide valid password two times, there should be new
		empty database.

		Given no database
		When I run cryptobox "create"
		And I enter correct password
		And I enter correct password
		Then a file named "cryptobox/cryptobox.yaml" should exist
		And the exit status should be 0
		And the database can be unlocked with "hi"
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
		When I run cryptobox "create"
		And I enter correct password
		And I enter incorrect password
		Then a file named "cryptobox/cryptobox.yaml" should not exist
		And the exit status should be 1
		And the stdout should contain exactly:
			"""
			Password:
			Confirm password:

			"""
		And the stderr should contain exactly:
			"""
			error: Passwords don't match!

			"""

	Scenario: Override existing database
		We have existing database and we try to create a new one.
		Application have to ask us whether we want to override the
		existing database. We answer 'y' and we should see new
		database and the old one backed up.

		Given empty database
		And the database can be unlocked with "hi"
		When I run cryptobox "create"
		And I type "y"
		And I type "password"
		And I type "password"
		Then the exit status should be 0
		And the number of backups should be 1
		And the database can be unlocked with "password"
		And the database can not be unlocked with "hi"
		And the stdout should contain exactly:
			"""
			Database already exists, do you want to overwrite it? [y/n]: 
			Password:
			Confirm password:

			"""

	Scenario: Try to override existing database
		We have an existing database, but we accidentally try to create
		a new one. We say 'n' to the question asking us whether we
		want to override our database. As an outcome, we should
		not see database update and new backup.

		Given empty database
		When I run cryptobox "create"
		And I type "n"
		And the number of backups should be 0
		Then the exit status should be 0
		And the database can be unlocked with "hi"
		And the stdout should contain exactly:
			"""
			Database already exists, do you want to overwrite it? [y/n]: 

			"""

	Scenario: Create new database and check its default content
		Default database content should be "# Lines started with # are
		comments", check it.

		Given empty database
		When I run cryptobox "edit --stdout"
		And I enter correct password
		Then the exit status should be 0
		And the stdout should contain:
			"""
			# Lines started with # are comments
			"""
