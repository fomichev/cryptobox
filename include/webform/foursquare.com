{
	"name": "Foursquare",
	"address": "https://foursquare.com/login",
	"form":
	{
		"action": "https://foursquare.com/login",
		"method": "post",
		"fields":
		{
			"F341666038000QLA4KO": "true",
			"F341666037999KUTNPK": "<%= @vars[:name] %>",
			"F341666037997VIBMCP": "<%= @vars[:pass] %>",
			"F341666137998KMBSHV": "Log in"
		}
	}
}
