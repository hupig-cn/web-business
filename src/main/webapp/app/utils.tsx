// JS常用函数包
class UTILS {
  ver = '201907280117';
  beautifulPrice = false;
  pricePointLength = 3;
}
// 手机号码
// @ts-ignore
UTILS.prototype.mobileValidate = (s: string) => {
  // const S = (' ' + s).replace(/\ /g, '');
  const S = (' ' + s).trim();
  if (/^1[3-9](\d+){9}$/g.test(S) && S.length === 11) {
    return S;
  }
  return false;
};
// @ts-ignore
UTILS.prototype.numberValidate = (s: string) => {
  // const S = (' ' + s).replace(/\ /g, '');
  const S = (' ' + s).trim();
  if (/^(\d+){1,}$/g.test(S)) {
    return S;
  }
  return false;
};
// @ts-ignore
UTILS.prototype.priceValidate = (s: string) => {
  const S = parseInt((' ' + s).trim(), 10);
  if (S >= 0) {
    return S;
  }
  return false;
};
// @ts-ignore
UTILS.prototype.beautifulPriceText = (s: string) => {
  // tslint:disable-next-line: no-invalid-this
  if (this.beautifulPrice) {
    return parseInt(s.replace(/\,/g, ''), 10);
  }
  const S = parseInt((' ' + s).trim(), 10);
  if (S >= 0) {
    return S;
  }
  return false;
};
export default new UTILS();
