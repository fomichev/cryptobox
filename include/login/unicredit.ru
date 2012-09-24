{
	"type":"login",
	"name": "Enter.UniCredit",
	"address": "https://enter2.unicredit.ru/v2/cgi/bsi.dll?T=RT_2Auth.BF",
	"form":
	{
		"action": "",
		"method": "get",
		"fields":
		{
			"T": "RT_2Auth.CL",
			"bShow": "",
			"IdCaptcha": "",
			"MapID": "{4EE3760C-2454-446F-991D-C2F6F8C70FD1}",
			"A": "<%= @vars[:name] %>",
			"B": "<%= @vars[:pass] %>",
			"L": "RUSSIAN",
			"C": ""
		}
	}
}
