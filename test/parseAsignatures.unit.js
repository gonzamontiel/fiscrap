var chai = require('chai');
var expect = chai.expect;

var parsing = require('../scrapping/parsing.js');

var normal = "70.01 Geometría Proyectiva <a href=\"http://www.fi.uba.ar/sites/default/files/7001.pdf\">(+)</a>";
var symbols = "70.01_Geometría Proyectiva- <a href=\"http://www.fi.uba.ar/sites/default/files/7001.pdf\">(+)</a>";
var invalidSentence = "This is some random no valid sentence.";
var noCode = "Geometría Proyectiva - <a href=\"http://www.fi.uba.ar/sites/default/files/7001.pdf\">(+)</a>";
var htmlString = "<p>Esta es una <strong>frase</strong> <a href='#'> este es un link</a> </p><p>";
var multilineString = "   \nlinea con algo\n linea con algo \r\n    \n\r";

describe('parsing', function() {
    it('Happy case: should return an object with four members', function() {
        var result = parsing.parseCourse(normal);
        expect(result.code).to.equal('70');
        expect(result.number).to.equal('01');
        expect(result.name).to.equal('Geometría Proyectiva');
        expect(result.link).to.equal('http://www.fi.uba.ar/sites/default/files/7001.pdf');
    });

    it('With symbols in name: should return an object with four members', function() {
        var result = parsing.parseCourse(symbols);
        expect(result.code).to.equal('70');
        expect(result.number).to.equal('01');
        expect(result.name).to.equal('Geometría Proyectiva');
        expect(result.link).to.equal('http://www.fi.uba.ar/sites/default/files/7001.pdf');
    });

    it('Invalid sentence: should return empty object', function() {
        var result = parsing.parseCourse(invalidSentence);
        expect(JSON.stringify(result)).to.equal(JSON.stringify({}));
    });

    it('No Code: should return just name and link', function() {
        var result = parsing.parseCourse(noCode);
        expect(result.code).to.equal('');
        expect(result.number).to.equal('');
        expect(result.name).to.equal('Geometría Proyectiva');
        expect(result.link).to.equal('http://www.fi.uba.ar/sites/default/files/7001.pdf');
    });

    it('Should remove some html chars from string but keep <a>', function() {
        var result = parsing.removeHtmlChars(htmlString);
        expect(result).to.equal("Esta es una frase <a href='#'> este es un link</a> ");
    });

    it('Should remove empty lines from multiline string', function() {
        var result = parsing.removeEmptyLines(multilineString);
        console.log(result);
        expect(result).to.equal("linea con algo\n linea con algo \r");
    });
});
