{
	"type":"login",
	"name": "Booking.com",
	"address": "http://www.booking.com/",
	"form":
	{
		"action": "https://secure.booking.com/login.html?tmpl=profile/slogin&protocol=http",
		"method": "post",
		"fields":
		{
			"op": "login",
			"tmpl": "profile/home",
			"username": "@name@",
			"password": "@password@"
		}
	}
}
