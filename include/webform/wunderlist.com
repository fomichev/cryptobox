{
	"name": "Wunderlist | Task Management At Its Best",
	"address": "http://www.wunderlist.com/",
	"form":
	{
		"action": "http://www.wunderlist.com/???",
		"method": "post",
		"fields":
		{
			"email": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>"
		}
	}
}
