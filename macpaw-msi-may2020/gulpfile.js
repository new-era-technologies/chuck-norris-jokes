const { src, dest, lastRun, watch, series, parallel } = require('gulp'),
  browserSync = require('browser-sync').create(),
  del = require('gulp-clean'),
  concat = require('gulp-concat'),
  minifyCss = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify-es').default,
  babel = require('gulp-babel');

function clean() {
  return src('build/**/*', { read: false })
  // .pipe(del());
}

function html() {
  return src('src/*.html')
    .pipe(dest('build'))
    .pipe(browserSync.stream());
}

function css() {
  return src('src/css/*.css')
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(minifyCss())
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
}

function javascript() {
  return src('src/js/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest('build/js'))
    .pipe(browserSync.stream());
}

function assets() {
  return src('src/assets/**/*.*', { since: lastRun(assets) })
    .pipe(dest('build'))
    .pipe(browserSync.stream());
}


exports.default = function () {
  browserSync.init({
    server: { baseDir: "./build" }
  });
  watch(['src/**/*.html', 'src/scss/*.scss', 'src/js/*.js', 'src/assets/**/*'], series(clean, assets, parallel(html, css, javascript))).on('change', browserSync.reload);
};