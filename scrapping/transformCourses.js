var jsonfile = require('jsonfile');
var fs = require('fs');
var input = 'scrapping/out/Course.json';
var courseColFile = 'scrapping/out/Course_courses.json';
var deptsColFile = 'scrapping/out/Course_departments.json';

var deptos = jsonfile.readFileSync(input);
var newCoursesCollection = [];
var newDeptsCollection = [];

for (var i = 0; i < deptos.length; i++) {
    var curDept = deptos[i];
    let depCode = null;
    // Create new course collection with all courses
    for (var j = 0; j < curDept.courses.length; j++) {
        // Avoid empty courses
        if (curDept.courses[j].name) {
            var course = curDept.courses[j];
            newCoursesCollection.push(course);
            if (!depCode) {
                depCode = course.depCode;
            }
        }
    }
    // Create new deptos collection with all deptos
    var newDept  = curDept.info;
    newDept.name = curDept.name;
    if (!newDept.code && depCode) {
        newDept.code = depCode;
    }
    newDeptsCollection.push(newDept);
}

jsonfile.writeFile(courseColFile, newCoursesCollection, {spaces: 2, flag: 'w+'},
function(err) {
    if (err) throw err;
});

jsonfile.writeFile(deptsColFile, newDeptsCollection, {spaces: 2, flag: 'w+'},
function(err) {
    if (err) throw err;
});

fs.unlinkSync(input);
