/*global require*/
'use strict';

var gulp = require("gulp");

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var del = require("del");
var bump = require("gulp-bump");
var git = require("gulp-git");

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
        .pipe(concat("angularplasmid.complete.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist"));
});

gulp.task("scriptsCore",  function () {
    return gulp.src(srcCore)
        .pipe(concat("angularplasmid.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist"));
});

gulp.task("bump", function(){
   return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./')); 
});

gulp.task("tag", function(){
    var pkg = require('./package.json');
    var v = pkg.version;
    var message = 'Release ' + v;
    
    return gulp.src('./')
        .pipe(git.commit(message))
        .pipe(git.tag(v, message))
        .pipe(git.push('origin', 'master', '--tags'))
        .pipe(gulp.dest('./'));
})

gulp.task('npm', ['bump','tag'], function (done) {
  require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task("default", ["clean", "scriptsCore", "scriptsComplete"]);
gulp.task("release",['default','npm']);
