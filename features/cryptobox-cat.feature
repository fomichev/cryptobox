Feature: User can print selected entries from the database
	Background:
		Given empty database
		And the number of backups should be 0
		When I set database contents to:
			"""
			webform/dropbox.com:
			  - user:
			      pass: pass
			webform/gmail.com:
			  - gmail_user:
			      pass: gmail_pass
			"""


	Scenario: Print full database
		And I run cryptobox "cat"
		And I enter correct password
		Then the exit status should be 0
		And the stdout should contain exactly:
			"""
			Password:
			[
			  {
			    "name": "user",
			    "type_path": "webform/dropbox.com",
			    "type": "webform",
			    "pass": "pass"
			  },
			  {
			    "name": "gmail_user",
			    "type_path": "webform/gmail.com",
			    "type": "webform",
			    "pass": "gmail_pass"
			  }
			]

			"""

	Scenario: Print filtered keys
		And I run cryptobox "cat name=user"
		And I enter correct password
		Then the exit status should be 0
		And the stdout should contain exactly:
			"""
			Password:
			[
			  {
			    "name": "user",
			    "type_path": "webform/dropbox.com",
			    "type": "webform",
			    "pass": "pass"
			  }
			]

			"""

	Scenario: Don't print key when number of entries > 1
		And I run cryptobox "cat -k name"
		And I enter correct password
		Then the exit status should be 1
		And the stderr should contain exactly:
			"""
			error: Too many entries

			"""

	Scenario: Print given key
		And I run cryptobox "cat -k name type_path=webform/dropbox.com"
		And I enter correct password
		Then the exit status should be 0
		And the stdout should contain exactly:
			"""
			Password:
			user
			"""

	Scenario: Print error when key is not found
		And I run cryptobox "cat -k doesnt_exist type_path=webform/dropbox.com"
		And I enter correct password
		Then the exit status should be 2
		And the stderr should contain exactly:
			"""
			error: Key is not found

			"""
