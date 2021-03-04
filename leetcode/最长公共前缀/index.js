/**
 * 最长公共前缀
 * 
 * 编写一个函数来查找字符串数组中的最长公共前缀。
 * 如果不存在公共前缀，返回空字符串 ""。
 */

/**
 * @param {string[]} strs
 * @return {string}
 */
const longestCommonPrefix = function(strs) {
  if (strs.length === 0) {
    return "";
  }
  let minItem = strs[0];
  for (let str of strs) {
    if (str.length < minItem.length) {
      minItem = str;
    }
  }
  let right = minItem.length;
  while (right > 0) {
    const prefix = minItem.slice(0, right);
    if (strs.every((str) => str.indexOf(prefix) === 0)) {
      return prefix;
    }
    right--;
  }
  return "";
};