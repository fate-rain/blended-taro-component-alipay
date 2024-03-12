/**
 * @param {string} v1
 * @param {string} v2
 * @returns {-1 | 0 | 1}
 */
function compareVersion(v1, v2) {
  var s1 = v1.split(".");
  var s2 = v2.split(".");
  var len = Math.max(s1.length, s2.length);

  for (let i = 0; i < len; i++) {
    var num1 = parseInt(s1[i] || "0");
    var num2 = parseInt(s2[i] || "0");

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

module.exports = compareVersion;
