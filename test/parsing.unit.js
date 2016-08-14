var chai = require('chai');
var expect = chai.expect;

var parsing = require('../parsing.js');

var normal = "70.01 Geometría Proyectiva <a href=\"http://www.fi.uba.ar/sites/default/files/7001.pdf\">(+)</a>";
var symbols = "70.01_Geometría Proyectiva- <a href=\"http://www.fi.uba.ar/sites/default/files/7001.pdf\">(+)</a>";
var invalidSentence = "This is some random no valid sentence."
var invalidSentenceNoCode = "Geometría Proyectiva - <a href=\"http://www.fi.uba.ar/sites/default/files/7001.pdf\">(+)</a>"

describe('parsing', function() {
  it('Happy case: should return an object with four members', function() {
    var result = parsing.parseAssignature(normal);
    expect(result.code).to.equal('70');
    expect(result.number).to.equal('01');
    expect(result.name).to.equal('Geometría Proyectiva');
    expect(result.link).to.equal('http://www.fi.uba.ar/sites/default/files/7001.pdf');
  });

  it('With symbols in name: should return an object with four members', function() {
    var result = parsing.parseAssignature(symbols);
    expect(result.code).to.equal('70');
    expect(result.number).to.equal('01');
    expect(result.name).to.equal('Geometría Proyectiva');
    expect(result.link).to.equal('http://www.fi.uba.ar/sites/default/files/7001.pdf');
  });

  it('Invalid sentence: should return empty object', function() {
    var result = parsing.parseAssignature(invalidSentence);
    expect(JSON.stringify(result)).to.equal(JSON.stringify({}));
  });
});
