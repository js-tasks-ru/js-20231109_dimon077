/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArr = [...arr];
  const collatorAsc = new Intl.Collator(['ru', 'en'], { caseFirst: 'upper' });
  const collatorDesc = new Intl.Collator(['ru', 'en']);

  if (param == 'asc') {
    newArr.sort((a, b) => collatorAsc.compare(a, b));
  } else if (param == 'desc') {
    newArr.sort((a, b) => -1 * collatorDesc.compare(a, b));
  }

  return newArr;
}
