# Declare and export module namespace.
password = {}
window.Cryptobox.password = password

# Return `true` if given character is vowel. Return `false` otherwise.
password.isVowel = (c) ->
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
# (`withPunc`), uppercase letters (`withUc`) or make password `pronounceable`.
password.generate = (length, withNumbers, withPunc, withUc, pronounceable) ->
  Math.seedrandom()

  pass = ""
  i = 0

  # Don't include numbers or punctuation when user requests pronounceable
  # password.
  if pronounceable
    withNumbers = false
    withPunc = false

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

    ch = String.fromCharCode(num)
    if pronounceable is true
      if pass.length >= 1
        prevCh = pass.charAt(i - 1)
        aV = isVowel(ch)
        bV = isVowel(prevCh)
        if isVowel(ch) and not isVowel(prevCh)

        else continue unless not isVowel(ch) and isVowel(prevCh)
    pass += ch
    i++

  pass
