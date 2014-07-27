/*global require*/
'use strict';

var gulp = require("gulp");

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var del = require("del");

var srcComplete = [
    "bower_components/angular/angular.js",
    "src/js/declare.js",
    "src/js/services.js",
    "src/js/directives.js",
    "src/js/init.js"
];

var srcCore = [
    "src/js/services.js",
    "src/js/directives.js"
];


gulp.task("clean", function (cb) {
    del('[dist]', cb);
});

gulp.task("scriptsComplete", function () {
    return gulp.src(srcComplete)
        .pipe(uglify())
        .pipe(concat("angularplasmid.complete.min.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("scriptsCore",  function () {
    return gulp.src(srcCore)
        .pipe(uglify())
        .pipe(concat("angularplasmid.min.js"))
        .pipe(gulp.dest("./dist"));
});


gulp.task("default", ["clean", "scriptsCore", "scriptsComplete"]);
