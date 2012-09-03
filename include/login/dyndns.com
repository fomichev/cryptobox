{
	"type":"login",
	"name": "DynDNS",
	"address": "https://account.dyn.com/entrance/",
	"form":
	{
		"action": "https://account.dyn.com/entrance/",
		"method": "post",
		"fields":
		{
			"username": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"submit": "Log in",
			"multiform": "__token__"
		}
	}
}
