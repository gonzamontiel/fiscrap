var exports = module.exports = {};

exports.parseCourse = function(asignatura) {
    var replacement = asignatura.trim().replace(/([\d]{2})?\.?([\d]{2})?([^\<]*)\<a\s*href=\"([^\"]*)\".*\<\/a\>.*/, "$1;$2;$3;$4");
    if (replacement === asignatura) {
        return {};
    }
    var split = replacement.split(';');
    var code = split[0] ? split[0] : '';
    var number = split[1] ? split[1] : '';
    var link = split[3] ? split[3] : '';
    var name = split[2] ?
        split[2].replace(/^[\s-_]+/g, "").replace(/[\s-_]+$/g, "")
        : '';
    return {
        "code": code + '.' + number,
        "name": name,
        "link": link,
    };
};

exports.removeEmptyLines = function(string) {
    return string.replace(/^\s*[\r\n]/gm, '');
};

exports.removeHtmlChars = function(string) {
    return string
        .replace(/<\/?br>/g, "")
        .replace(/<\/?p>/g, "")
        .replace(/<\/?strong>/g, "");
};


exports.replaceHtmlTags = function(string) {
    return string
        .replace(/<\/?br>/g, "\r\n")
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "\r\n")
        .replace(/<\/?strong>/g, "");
};
