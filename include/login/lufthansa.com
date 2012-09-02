{
	"type":"login",
	"name": "Lufthansa",
	"address": "http://www.lufthansa.com/online/portal/lh/ru/homepage",
	"form":
	{
		"action": "https://www.lufthansa.com/online/portal/lh/cxml/04_SD9ePMtCP1I800I_KydQvyHFUBADPmuQy?l=en&cid=1000348&p=LH&s=RU",
		"method": "post",
		"fields":
		{
			"userid": "@name@",
			"password": "@password@",
			"loginType": "loginLayer",
			"portalId": "LH",
			"siteId": "RU",
			"current_nodeid": "1672762",
			"current_taxonomy": "Homepage",
			"countryId": "1000348",
			"targetTaxonomy": "My_Account"
		}
	}
}
