{
	"type":"login",
	"name": "Shipito",
	"address": "https://www.inccontact.com/client/shipito/login.php?error=2&id_language=",
	"form":
	{
		"action": "https://www.inccontact.com/client/shipito/login.php",
		"method": "post",
		"fields":
		{
			"id_language": "eng",
			"referer": "",
			"id_shipito_present": "",
			"email": "@name@",
			"password": "@password@"
		}
	}
}
