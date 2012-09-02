{
	"type":"login",
	"name": "Clipperz",
	"address": "https://www.clipperz.com/beta/",
	"form":
	{
		"broken": true,
		"action": "",
		"method": "get",
		"fields":
		{
			"username": "@name@",
			"passphrase": "@password@"
		}
	}
}
