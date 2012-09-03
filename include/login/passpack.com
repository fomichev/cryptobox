{
	"type":"login",
	"name": "Passpack",
	"address": "https://www.passpack.com/online/#0",
	"form":
	{
		"action": "",
		"method": "post",
		"fields":
		{
			"suno093354860576801": "<%= @vars[:name] %>",
			"sdue093354860576801": "<%= @vars[:pass] %>",
			"stacCheck": "on"
		}
	}
}
