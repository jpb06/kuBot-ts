/// <binding BeforeBuild='clean' AfterBuild='copypackage, concat, cleandeploy' Clean='clean' />
var gulp = require('gulp');
var exec = require('child_process').exec;
var rimraf = require('gulp-rimraf');
var concat = require('gulp-concat');

gulp.task('clean', function () {
    return gulp
        .src('./deploy')
        .pipe(rimraf());
});

gulp.task('concat', function () {
    return gulp
        .src('./deploy/js/**/*.js')
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./deploy'));
});

gulp.task('copypackage', function () {
    return gulp
        .src('./package.json')
        .pipe(gulp.dest('./deploy/'));
});

gulp.task('cleandeploy', function () {
    return gulp
        .src('./deploy/js')
        .pipe(rimraf());
});