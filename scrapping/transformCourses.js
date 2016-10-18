var jsonfile = require('jsonfile');
var input = 'scrapping/courses.json';
var courseColFile = 'collections/coursesCol.json';
var deptsColFile = 'collections/departmentsCol.json';

var deptos = jsonfile.readFileSync(input);
var newCoursesCollection = [];
var newDeptsCollection = [];

for (var i = 0; i < deptos.length; i++) {
    var curDept = deptos[i];
    // Create new asignature collection with all courses
    for (var j = 0; j < curDept.asignaturas.length; j++) {
        // Avoid empty courses
        if (curDept.asignaturas[j].name) {
            var asig = curDept.asignaturas[j];
            asig.depto = curDept.name;
            newCoursesCollection.push(asig);
        }
    }
    // Create new deptos collection with all deptos
    var newDept  = curDept.info;
    newDept.name = curDept.name;
    newDeptsCollection.push(newDept);
}

jsonfile.writeFile(courseColFile, newCoursesCollection, {spaces: 2},
function(err) {
    if (err) throw err;
});

jsonfile.writeFile(deptsColFile, newDeptsCollection, {spaces: 2},
function(err) {
    if (err) throw err;
});
