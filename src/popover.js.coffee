# Class that implements simple popover.
class Popover
  # Create new popover with specified `width` and `height`.
  constructor: (width, height) ->
    @popover = document.createElement("div")
    @popover.style.position = "absolute"
    @popover.style.zIndex = 99999
    @popover.style.top = 0
    @popover.style.left = 0
    @popover.style.width = width
    @popover.style.height = height

    paddingDiv = document.createElement("div")
    @popover.appendChild paddingDiv
    paddingDiv.style.paddingTop = "20px"
    paddingDiv.style.paddingLeft = "20px"
    paddingDiv.style.paddingRight = "40px"
    paddingDiv.style.paddingBottom = "20px"

    bg = document.createElement("div")
    paddingDiv.appendChild(bg)
    bg.style.color = "#fff"
    bg.style.background = "#000"
    bg.style.opacity = 0.8
    bg.style.width = "100%"
    bg.style.height = "100%"
    bg.style.padding = "10px"
    bg.style.border = "0 none"
    bg.style.borderRadius = "6px"
    bg.style.boxShadow = "0 0 8px rgba(0,0,0,.8)"

  # Add given DOM element to popover.
  add: (node) ->
    bg.appendChild(node)

    @popover.onclick = (e) ->
      e.stopPropagation()

    document.body.onclick = ->
      @popover.parentNode.removeChild(@popover)

  # Attach popover element to `body`.
  show: ->
    document.body.appendChild(@popover)

# Export class.
this.Cryptobox.Popover = Popover
