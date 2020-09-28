# Transforms a List of Objects into a CSV List of Strings

Purpose of this simple library is to take a header and a list of objects and transform them into a **CSV** (**C**omma **S**eparated **V**alues) list of strings compatible with [RFC 4180](https://tools.ietf.org/html/rfc4180)

CSV format is popular as an interchange format for spreadsheets

This library has been written with (old) browsers in mind and does not offer as many options  and variations as many other related libraries offer (but for some which failed to *transpile* correctly for some reason... and drove us to write our own)

It implements RFC 4180 format as closely as possible

It also offers some helper functions which would help write a fairly easy different implementation of the builder as proposed in the next section

# CSV Builder

## `makeCsvList(headers, objectList, options)`

Takes two arrays: `headers`, a list of CSV header strings which are both header fields and property keys to objects. And `objectList` is the list of objects whose values corresponding to properties are values

This means only properties found in `headers` will bring values to the CSV result, other properties will be ignored. Also undefined properties will be assigned a empty value in the CSV result

This function returns a list of strings, each string representing a line of the CSV file, first line being composed of headers and subsequent lines contain values. Those lines are not finished with any specific end of line (normally CR/LF), this allowing user to define which one they prefer (LF, CR/LF...)

Parameters `options` is an optional object with the following optional properties:

- `separator` is meant to be a string defining  the value separator for a CSV record, if `separator` is defined only the first character is taken into account. Default value is comma (`,`)
- `fullDQuote` directs use of enclosing quotes (`"`): if `true`, it encloses *every* value, otherwise it only encloses values which need enclosing (values with double quote, CR, LF, separators inside). Default is `false`

------

*Note*: list of headers has been deemed safer instead of drawing this list from objects properties directly because there is not always a defined and constant order of properties in objects (it is implementation dependent as ECMAScript works in old browsers and a matter of certain controversy)

## Example

```javascript
const { makeCsvList } = require("@labzdjee/obj-list-to-csv");
const headers = ["a", "b", "c"];
const objects = [
 { a: "A1", b: "B1", c: "C1" },
 { a: "A2", b: "B2", c: "C2" },
 { a: "A3, Alice", b: "B3, Bob", c: "C3, Cathy" },
];
const csv = makeCsvList(headers, objects);
```

Returned `csv` string array will contain this:

```javascript
["a,b,c",
  "A1,B1,C1",
  "A2,B2,C2",
  "\"A3, Alice\",\"B3, Bob\",\"C3, Cathy\""]
```

# Low Level Functions

Those helper functions can be used as primitives for building other CSV builders for different usages

## `escapeSpecialCharacters(inputString, separator = ",")`

Takes a string (`inputString`) and returns a string with double-quote (`"`) escaped

Return value is an object with following properties:

- `return`: value of string without surrounding double-quotes even if needed
- `shouldEnclose`: `true` if `separator`, carriage return or line feed included in `inputString`, `false` otherwise. 

Naturally, `separator` is meant to be the value separator for a CSV record, if `separator` is defined only the first character is taken into account. If no such first character can be found, default value (a comma) is used

## `stringOrNumberToString(input, radix = 10)`

Takes an `input` and returns it as a string only if input is already a *string* or a *number*, returns `null` otherwise

If `input` is a number, transforms it to a string with the provided `radix` (a number between 2 and 36, inclusively, representing the base for representing a numeric value)

------

