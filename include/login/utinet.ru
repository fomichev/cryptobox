{
	"type":"login",
	"name": "UniNote",
	"address": "http://note.utinet.ru/",
	"form":
	{
		"action": "http://note.utinet.ru/",
		"method": "post",
		"fields":
		{
			"backUrl": "",
			"loginKey": "4ff093f41ef56",
			"phones[0][Type]": "ph_m",
			"phones[0][CountryCode]": "7",
			"phones[0][AreaCode]": "$area",
			"phones[0][Number]": "<%= @vars[:name] %>",
			"phones[0][Comment]": "",
			"captcha": "",
			"password": "<%= @vars[:pass] %>",
			"passwordShow": "<%= @vars[:pass] %>",
			"email": "",
			"captcha": "",
			"human[FirstName]": "",
			"human[LastName]": "",
			"human[Email]": "",
			"bindcode": "",
			"captcha": ""
		}
	}
}
