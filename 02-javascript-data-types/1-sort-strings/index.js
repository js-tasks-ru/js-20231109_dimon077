/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let newArr = [...arr];
  let collatorAsc = new Intl.Collator(['ru', 'en'], { caseFirst: 'upper' });
  let collatorDesc = new Intl.Collator(['ru', 'en']);

  if (param == 'asc') {
    newArr.sort((a, b) => collatorAsc.compare(a, b));
  } else if (param == 'desc') {
    newArr.sort((a, b) => collatorDesc.compare(a, b)).reverse();
  }

  return newArr;
}
