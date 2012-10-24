{
	"name": "Busuu",
	"address": "http://www.busuu.com/",
	"form":
	{
		"action": "http://www.busuu.com/enc",
		"method": "post",
		"fields":
		{
			"name": "<%= @vars[:name] %>",
			"pass": "<%= @vars[:pass] %>",
			"form_id": "user_login"
		}
	}
}
