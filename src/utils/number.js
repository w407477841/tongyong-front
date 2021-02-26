/* 保留两位小数 */
export function toDecimal(val) {
  let num = parseFloat(val);
  if (isNaN(num)) {
    return;
  }
  num = Math.round(val * 100) / 100;
  return num;
}
