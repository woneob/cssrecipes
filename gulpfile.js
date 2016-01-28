/* Dependencies */
var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var htmlmin = require('gulp-htmlmin');
var gulpif = require('gulp-if');
var seq = require('gulp-sequence');
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
  htmlmin: {
    removeComments: false,
    collapseWhitespace: true
  }
};

/* Dist Tasks */
gulp.task('template', function() {
  return gulp
    .src([
      '**/*',
      '!styles/**/*',
      '!script/**/*',
      '!images/**/*'
    ], {
      cwd: paths.src
    })
    .pipe(nunjucks.compile({
      site: pkgInfo,
      contents: contents
    }))
    .pipe(gulpif('*.html', htmlmin(opts.htmlmin)))
    .pipe(gulp.dest(paths.dist));
});

/* Global tasks */
gulp.task('default', ['template']);
