export const textParser = {
  removeUnicode(input: string) {
    input = input.toLowerCase();
    input = input.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    input = input.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    input = input.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    input = input.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    input = input.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    input = input.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    input = input.replace(/đ/g, "d");
    return input;
  },

  charToNumber(input: string) {
    const charObj: Record<string, number> = {
      mot: 1,
      hai: 2,
      ba: 3,
      bon: 4,
      nam: 5,
      sau: 6,
      bay: 7,
      tam: 8,
      chin: 9,
      muoi: 10,
    };

    for (const p of Object.keys(charObj)) {
      input = input.replace(new RegExp(p + " ", "g"), `${charObj[p]} `);
    }
    return input;
  },
};
