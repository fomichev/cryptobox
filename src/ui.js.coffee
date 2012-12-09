# Declare and export module namespace.
ui = {}
window.Cryptobox.ui = ui

# Convert `\n` to `<br />` in `text` and return it.
ui.addBr = (text) ->
  return text.replace(/\n/g, '<br />') if text
  ''

# Render and return `template` in given `context`.
ui.render = (template, context) ->
  Cryptobox.measure 'render ' + template, ->
    Handlebars.templates[template] context

# Preprocess `cryptobox.json` for easy handling with handlebars.
ui.init = (data) ->
  result = []
  Cryptobox.measure "ui.init", ->
    map = {}
    pages = {}

    for el, index in data
      continue  if el.visible is false
      pages[el.type] = {}  unless el.type of pages
      pages[el.type][el.tag] = []  unless el.tag of pages[el.type]
      el.id = index
      pages[el.type][el.tag].push el

    for page_key of pages
      p =
        id: page_key
        name: cryptobox.config.i18n.page[page_key]
        tag: []

      for tag_key of pages[page_key]
        p.tag.push
          name: tag_key
          item: pages[page_key][tag_key]

      p.tag.sort (a, b) ->
        a.name > b.name

      result.push p

    result.sort (a, b) ->
      a.name > b.name

  result
