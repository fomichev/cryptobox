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
			"email": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"remember": "1"
		}
	}
}
