/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!string.length || size == 0) return '';

  if (!size) return string;

  const stringArr = string.slice('');
  let currentLetter = '';
  let currentCount = 1;
  let str = '';

  for (const letter of stringArr) {
    if (currentLetter != letter) {
      currentCount = 1;
      currentLetter = letter;
      str += currentLetter;
      continue;
    }

    if (currentCount >= size) {
      continue;
    }

    str += currentLetter;
    currentCount++;
  }

  return str;
}
