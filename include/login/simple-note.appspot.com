{
	"type":"login",
	"name": "Simplenote",
	"address": "https://simple-note.appspot.com/signin",
	"form":
	{
		"action": "https://simple-note.appspot.com/user",
		"method": "post",
		"fields":
		{
			"email": "@name@",
			"password": "@password@",
			"remember": "1"
		}
	}
}
