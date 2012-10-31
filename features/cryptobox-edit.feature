Feature: User edits database

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

#	Scenario: Edit via stdio and the generate all files
#		Given empty database
#		When I set database contents to:
#			"""
#			webform/dropbox.com user:
#			  pass: pass
#			"""
#		And I run cryptobox "edit --noedit"
#		And I enter correct password
#		Then the exit status should be 0

#TODO cbedit --no-update on empty database
