var exports = module.exports = {};

exports.parseAssignature = function(asignatura) {
    var replacement = asignatura.trim().replace(
        /([\d]{2})\.([\d]{2})([^\<]*)\<a\s*href=\"([^\"]*)\".*\<\/a\>.*/,
        "$1;$2;$3;$4"
    );
    if (replacement === asignatura) {
        return {};
    }
    var replacementSplit = replacement.split(';')
    var name = replacementSplit[2];
    if (name) {
        name = name.replace(/^[\s-_]+/g, "").replace(/[\s-_]+$/g, "");
    }
    return {
        "code": replacementSplit[0],
        "number": replacementSplit[1],
        "name": name,
        "link": replacementSplit[3],
    };
}

exports.removeEmptyLines = function(string) {
    return string.replace(/^\s*[\r\n]/gm, '');
}

exports.removeHtmlChars = function(string) {
    return string
        .replace(/<\/?br>/g, "")
        .replace(/<\/?p>/g, "")
        .replace(/<\/?strong>/g, "");
}
