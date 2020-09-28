/* jshint esversion: 6 */

const { greenBright, red, redBright, yellow } = require("chalk");

const { escapeSpecialCharacters, stringOrNumberToString, makeCsvList } = require("./index");

let testNb = 0;
let testShot = 0;
let testFailures = 0;

function tr(str) {
  return str.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
}

function testEscapeSpecialCharacters(inStr, outStr, shouldEnclose, separator) {
  testNb++;
  console.log(`test step ${testNb} with: ${tr(inStr)}/${tr(outStr)}/${shouldEnclose}/${separator}`);
  const result = escapeSpecialCharacters(inStr, separator);
  if (result.result !== outStr || result.shouldEnclose !== shouldEnclose) {
    console.log(red(` failure: got unexpected {result: ${tr(result.result)}, shouldEnclose: ${result.shouldEnclose}}`));
    testFailures++;
  }
}

console.log(yellow(`*** SHOT #${++testShot}: test "escapeSpecialCharacters"`));
testEscapeSpecialCharacters("hello", "hello", false);
testEscapeSpecialCharacters('"hello"', '""hello""', true);
testEscapeSpecialCharacters("hello, world", "hello, world", true);
testEscapeSpecialCharacters("hello, world", "hello, world", false, ";");
testEscapeSpecialCharacters("hello; world", "hello; world", true, ";");
testEscapeSpecialCharacters("hello; world", "hello; world", true, ";+");
testEscapeSpecialCharacters("hello; world", "hello; world", false, "+;");
testEscapeSpecialCharacters("hello; world", "hello; world", false, "+;");
testEscapeSpecialCharacters("hello world\r", "hello world\r", true);
testEscapeSpecialCharacters("hello world\r\n", "hello world\r\n", true);

function testStringOrNumberToString(input, expectedOutput, radix) {
  testNb++;
  console.log(`test step ${testNb} with "${input}", radix "${radix}"`);
  const result = stringOrNumberToString(input, radix);
  if (result !== expectedOutput) {
    console.log(red(` failure: expected "${expectedOutput}", got "${result}"`));
    testFailures++;
  }
}

console.log(yellow(`*** SHOT #${++testShot}: test "stringOrNumberToString"`));
testStringOrNumberToString("hello", "hello");
testStringOrNumberToString(2, "2");
testStringOrNumberToString(NaN, "NaN");
testStringOrNumberToString(22, "16", 16);
testStringOrNumberToString({}, null);
testStringOrNumberToString(null, null);
testStringOrNumberToString(undefined, null);

function compareArrayLists(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  let outcome = true;
  arr1.forEach((line, index) => {
    if (arr2[index] !== line) {
      outcome = false;
    }
  });
  return outcome;
}

let headers = ["a", "b", "c"];
let objects = [
  { a: "A1", b: "B1", c: "C1" },
  { a: "A2", b: "B2", c: "C2" },
  { a: "A3, Alice", b: "B3, Bob", c: "C3, Cathy" },
];

console.log(yellow(`*** SHOT #${++testShot}: test "makeCsvList"`));
testNb++;
let expectedListOfStrings = ["a,b,c", "A1,B1,C1", "A2,B2,C2", '"A3, Alice","B3, Bob","C3, Cathy"'];
console.log(`test step ${testNb} call with no options`);
if (!compareArrayLists(makeCsvList(headers, objects), expectedListOfStrings)) {
  console.log(red(" failure expecting:"), expectedListOfStrings);
}
testNb++;
expectedListOfStrings = ['"a","b","c"', '"A1","B1","C1"', '"A2","B2","C2"', '"A3, Alice","B3, Bob","C3, Cathy"'];
console.log(`test step ${testNb} call with fullDQuote`);
if (!compareArrayLists(makeCsvList(headers, objects, { fullDQuote: true }), expectedListOfStrings)) {
  console.log(red(" failure expecting:"), expectedListOfStrings);
}
testNb++;
expectedListOfStrings = ["a;b;c", "A1;B1;C1", "A2;B2;C2", "A3, Alice;B3, Bob;C3, Cathy"];
console.log(`test step ${testNb} call with different separator`);
if (!compareArrayLists(makeCsvList(headers, objects, { separator: ";+" }), expectedListOfStrings)) {
  console.log(red(" failure expecting:"), expectedListOfStrings);
  console.log(makeCsvList(headers, objects, { separator: ";+" }));
}

console.log(
  "End of tests. Status:",
  testFailures > 0 ? redBright(`FAIL with ${testFailures} error${testFailures > 2 ? "s" : ""}`) : greenBright(`PASS`)
);
