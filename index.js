/* jshint esversion: 6 */

exports.escapeSpecialCharacters = function (inputString, separator = ",") {
  if (typeof separator !== "string" || separator.length < 1) {
    separator = ",";
  }
  const result = inputString.replace(/"/g, '""');
  const re = new RegExp(`["\r\n${separator.substr(0, 1)}]`);
  const shouldEnclose = re.test(result);
  return { result, shouldEnclose };
};

exports.stringOrNumberToString = function (input, radix = 10) {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input === "number") {
    return input.toString(radix);
  }
  return null;
};

// Some MIME types for CSV's (according to RFC 4180)
//  text/csv
//  text/csv; header

exports.makeCsvList = function (headers, objectList, options = { separator: ",", fullDQuote: false }) {
  const { separator, fullDQuote } = options;
  const result = [];
  const lineList = [];
  let sep = ",";
  if (typeof separator === "string" && separator.length > 0) {
    sep = separator.substr(0, 1);
  }
  headers.forEach((header) => {
    if (typeof header !== "string") {
      throw Error("headers in makeCsvList are not solely composed of strings");
    }
    const { result, shouldEnclose } = exports.escapeSpecialCharacters(header, separator);
    lineList.push(shouldEnclose || fullDQuote ? `"${result}"` : result);
  });
  result.push(lineList.join(sep));
  objectList.forEach((object) => {
    lineList.length = 0;
    headers.forEach((header) => {
      const str = exports.stringOrNumberToString(object[header]);
      const { result, shouldEnclose } = exports.escapeSpecialCharacters(str === null ? "" : str, sep);
      lineList.push(shouldEnclose || fullDQuote ? `"${result}"` : result);
    });
    result.push(lineList.join(sep));
  });
  return result;
};
