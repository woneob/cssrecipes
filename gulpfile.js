'use strict';

/* Dependencies */
var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var seq = require('gulp-sequence');
var del = require('del');
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

/* Dist Tasks */
gulp.task('clean', function() {
  return del(paths.dist);
});

gulp.task('template', function() {
  var opts = {
    globs: '**/*.html',
    src: {
      cwd: paths.src,
      base: paths.src
    },
    nunjucks: {
      site: pkgInfo,
      contents: contents,
      datetime: new Date().toISOString()
    },
    htmlmin: {
      removeComments: false,
      collapseWhitespace: true
    }
  };

  return gulp
    .src(opts.globs, opts.src)
    .pipe(nunjucks.compile(opts.nunjucks))
    .pipe(htmlmin(opts.htmlmin))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', function() {
  var opts = {
    globs: '**/[^_]*.scss',
    src: {
      cwd: paths.src + '/styles',
      base: paths.src
    },
    sass: {
      includePaths: [
        paths.src + '/styles/include/'
      ],
      outputStyle: 'compressed',
      errLogToConsole: true
    },
    autoprefixer: {
      remove: false
    }
  };

  return gulp
    .src(opts.globs, opts.src)
    .pipe(sass(opts.sass).on('error', sass.logError))
    .pipe(autoprefixer(opts.autoprefixer))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('scripts', function() {
  var opts = {
    globs: [
      '**/*.js',
      '!**/*.min.js'
    ],
    src: {
      cwd: paths.src + '/scripts',
      base: paths.src
    },
    rename: {
      suffix: '.min'
    }
  };

  return gulp
    .src(opts.globs, opts.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(rename(opts.rename))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy', function() {
  var opts = {
    globs: [
      '**/*.min.js'
    ],
    src: {
      cwd: paths.src,
      base: paths.src
    }
  };

  return gulp
    .src(opts.globs, opts.src)
    .pipe(gulp.dest(paths.dist));
});

/* Global tasks */
gulp.task('default', seq('clean', [
  'template',
  'styles',
  'scripts',
  'copy'
]));
