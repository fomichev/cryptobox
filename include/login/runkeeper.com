{
	"type":"login",
	"name": "RunKeeper",
	"address": "http://runkeeper.com/login",
	"form":
	{
		"action": "http://runkeeper.com/login",
		"method": "post",
		"fields":
		{
			"_eventName": "login",
			"redirectUrl": "",
			"submit": "",
			"email": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"_sourcePage": "DX14I7Mj-C1PS4-gnBkDvGIAWFUlYF9h",
			"__fp": "-TIeVk-xuOU="
		}
	}
}
