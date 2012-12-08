# Register `stringify` handlebars helper which converts given `object` to JSON.
window.Handlebars.registerHelper 'stringify', (object) ->
  return JSON.stringify(object)

# Register `each_key_value` handlebars helper which iterates over all `object`
# keys.
window.Handlebars.registerHelper "each_key_value", (object, options) ->
  buffer = "";

  for key, value of object
    if object.hasOwnProperty(key)
      buffer += options.fn({key: key, value: value})

  return buffer

# Register `if_eq` handlebars helper which executes block only if two
# tested variables are equal.
window.Handlebars.registerHelper 'if_eq', (context, options) ->
  return options.fn(this) if context == options.hash.to
  return options.inverse(this)
