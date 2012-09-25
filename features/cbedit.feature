#Feature: user edits database
#
#	Scenario: edit via stdio
#		Given database exists
#		When I run "echo '' | cbedit --stdio"
#		And backup does not exist
#		Then backup exits
#		And bookmarklet exists
#		And html exists
#		And chrome exists
#		And json exists
