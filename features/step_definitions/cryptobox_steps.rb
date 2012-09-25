Given /^no database$/ do
  steps %{
    Given a file named "private/cryptobox" should not exist
  }
end

Given /^empty database$/ do
  steps %{
    When I run `ruby ../../bin/cbcreate` interactively
    And I type "hi"
    And I type "hi"
    Then the exit status should be 0
    And a file named "private/cryptobox" should exist
  }
end
