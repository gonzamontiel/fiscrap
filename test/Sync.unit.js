const chai = require('chai');
const jsonfile = require('jsonfile');
const Sync = require('../Sync.js');
const expect = chai.expect;

var INITIAL_CONTENT = ["Initial content."];
var CHANGED_CONTENT = ["New content."];

function createTestFile() {
    var testFile = "testfile.json";
    jsonfile.writeFileSync(
        testFile,
        INITIAL_CONTENT,
        {spaces: 2, flag: 'w+'}
    );
    return testFile;
}

describe('synctest', function() {
    it('Content unchanged. Should maintain original file', function() {
        var testFile = createTestFile();
        var sync = new Sync(testFile, INITIAL_CONTENT);
        sync.run();
        var content = jsonfile.readFileSync(testFile);
        expect(content).to.deep.equal(INITIAL_CONTENT);
    });

    it('Content changed. Should return new content.', function() {
        var testFile = createTestFile();
        var sync = new Sync(testFile, CHANGED_CONTENT);
        sync.run();
        var content = jsonfile.readFileSync(testFile);
        expect(content).to.deep.equal(CHANGED_CONTENT);
    });
});
