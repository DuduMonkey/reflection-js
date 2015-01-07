var gulp = require("gulp");
var mocha = require("gulp-mocha");
var jsdoc = require("gulp-jsdoc");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var del = require("del");

var mochaOptions = {};

gulp.task("test", function () {
    return gulp.src("./test/*.js", {
            read: false
        })
        .pipe(mocha(mochaOptions));
});

var jsdocOptions = {};

gulp.task("jsdoc", function () {

    del(["./docs/*.*"], function (err, deletedFiles) {
        console.log("Files deleted:", deletedFiles.join(", "));
    });

    return gulp.src("./lib/*.js")
        .pipe(jsdoc.parser(jsdocOptions, "jsdoc.json"))
        .pipe(jsdoc.generator("./docs"));
});

var renameOptions = {
    suffix: ".min"
};

gulp.task("compress", function () {
    gulp.src("./lib/*.js")
        .pipe(uglify())
        .pipe(rename(renameOptions))
        .pipe(gulp.dest("dist"))
});

gulp.task("default", ["test", "jsdoc", "compress"]);