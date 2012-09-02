{
	"type":"login",
	"name": "Mitto",
	"address": "https://app.mitto.com/",
	"form":
	{
		"action": "https://app.mitto.com/",
		"method": "post",
		"fields":
		{
			"frmIndex": "frmIndex6b22881762ec8568b70acd458ea32014",
			"eldanh": "@name@",
			"pwrd": "@password@",
			"public_pc__orig": "Y",
			"public_pc": "Y",
			"public_pc": "N",
			"js_enabled": "true",
			"timeoffset": "-240",
			"ajax_enabled": "true",
			"@auth:action": "login",
			"index": "default",
			"remember[]": "R"
		}
	}
}
