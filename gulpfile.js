'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const cache = require('gulp-cache');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const pngout = require('imagemin-pngout');
const browserSync = require('browser-sync');
const rsync = require('gulp-rsync');

gulp.task('b-sync', function () {
  browserSync({
    server: {
      baseDir: 'src',
    },
    notify: false,
  });
});

gulp.task('html-minify', function () {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('../dist'));
});


gulp.task('images:min', function () {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngout()],
    })))
    .pipe(gulp.dest('../dist/img'));
});

gulp.task('images:copy', function () {
  return gulp.src('src/img/**/*')
      .pipe(gulp.dest('../dist/img'));
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*').pipe(gulp.dest('../dist/fonts'));
});

gulp.task('watch', ['images:copy', 'fonts', 'b-sync'], function () {
  gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('build', ['clearcache', 'html-minify', 'images:min']);

gulp.task('clearcache', function () {
  return cache.clearAll();
});

gulp.task('default', ['watch']);
