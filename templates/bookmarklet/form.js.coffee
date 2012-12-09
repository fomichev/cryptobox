#= require cryptobox.js.coffee
#= require form.js.coffee
#= require popover.js.coffee

ta = document.createElement("textarea")
ta.style.width = "100%"
ta.style.height = "100%"
ta.style.border = "0 none"
ta.style.background = "#000"
ta.style.color = "#fff"
ta.style.resize = "none"
ta.appendChild document.createTextNode(Cryptobox.form.toJson())

popover = new Cryptobox.Popover("50%", "50%")
popover.add(ta)
popover.show()

ta.select()
