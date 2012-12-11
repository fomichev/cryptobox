Feature: User edits database
	Scenario: Can't edit database with wrong password
		Given empty database
		When I run cryptobox "edit --stdout"
		And I enter incorrect password
		Then the exit status should be 2
		And the stderr should contain exactly:
			"""
			error: Invalid password!

			"""

	Scenario: Edit via stdio
		Given empty database
		And the number of backups should be 0
		When I set database contents to:
			"""
			webform/dropbox.com:
			  - user:
			      pass: pass
			"""
		And I run cryptobox "edit --stdout"
		And I enter correct password
		Then the exit status should be 0
		And the number of backups should be 1
		And the stdout should contain exactly:
			"""
			Password:
			webform/dropbox.com:
			  - user:
			      pass: pass

			"""

	Scenario: Edit creates mobile and desktop HTML files
		Given default database
		When I run cryptobox "edit --no-edit"
		And I enter correct password
		Then the exit status should be 0
		And file "private/html/cryptobox.html" should be generated
		And file "private/html/m.cryptobox.html" should be generated
		And file "private/cryptobox.json" should be generated
		And file "private/bookmarklet/form.js" should be generated

#	Scenario: Edit invalid format version
#		Given database with wrong format
#		When I run cryptobox "edit --no-edit"
#		And I enter correct password
#		Then the exit status should be 3
#		And the stderr should contain exactly:
#			"""
#			error: Invalid database format!
#
#			"""
