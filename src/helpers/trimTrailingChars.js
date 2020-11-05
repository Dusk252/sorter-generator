const trimTrailingChars = (s, charToTrim) => {
    var regExp = new RegExp(charToTrim + '+$');
    var result = s.replace(regExp, '');

    return result;
};

export default trimTrailingChars;
