/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  if (!arr) return [];

  if (!arr.length) return [];

  const set = new Set();
  const newArr = [];

  arr.forEach(value => set.add(value));
  set.forEach(value => newArr.push(value));

  return newArr;
}
