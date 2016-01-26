'use strict';

/* Dependencies */
var gulp = require('gulp');
var jade = require('gulp-jade');
var htmlmin = require('gulp-htmlmin');
var fs = require('fs');
var md = require('markdown').markdown;

/* Import data from files */
var pkgInfo = JSON.parse(fs.readFileSync('./package.json'));
var contents = md.toHTML(fs.readFileSync('./README.md', 'utf-8'));

/* Configuration */
var paths = {
  src: 'src/',
  dist: 'dist/'
};

var opts = {
  jade: {
    locals: {
      pkg: pkgInfo,
      contents: contents
    }
  },
  htmlmin: {
    removeComments: false,
    collapseWhitespace: true
  }
};

/* Dist Tasks */
gulp.task('html', function() {
  return gulp
    .src(paths.src + '*.jade')
    .pipe(jade(opts.jade))
    .pipe(htmlmin(opts.htmlmin))
    .pipe(gulp.dest(paths.dist));
});

/* Global tasks */
gulp.task('default', ['html']);
