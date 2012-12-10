# Declare and export module namespace.
password = {}
this.Cryptobox.password = password

# Return `true` if given character is vowel. Return `false` otherwise.
isVowel = (c) ->
  c = c.toLowerCase()
  if c is "a"
    true
  else if c is "e"
    true
  else if c is "i"
    true
  else if c is "o"
    true
  else if c is "u"
    true
  else
    false

# Generate new password with given `length`. Other parameters specify password
# properties, as to whether include numbers (`withNumbers`), punctuation
# (`withPunc`) or uppercase letters (`withUc`).
password.generate = (length, withNumbers, withPunc, withUc) ->
  Math.seedrandom()

  pass = ""
  i = 0

  while i < length
    num = Math.random() * 1000
    num = Math.floor(num)

    # Need ASCII character in range 33 .. 126.
    num = (num % 93) + 33

    if withNumbers is false
      continue if num >= 48 and num <= 57

    if withPunc is false
      continue if num >= 33 and num <= 47
      continue if num >= 58 and num <= 64
      continue if num >= 91 and num <= 96
      continue if num >= 123 and num <= 126

    if withUc is false
      continue if num >= 65 and num <= 90

    pass += String.fromCharCode(num)
    i++

  pass
