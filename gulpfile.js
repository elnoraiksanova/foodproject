"use strict";

const gulp = require('gulp');
//watch = require('gulp-watch'),
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const del = require("del");
// const plumber = require("gulp-plumber");
//pngquant = require('imagemin-pngquant'),
const browsersync = require("browser-sync").create();

function styles() {
  return gulp
    .src("src/styles/**/*")
    .pipe(sass())
    .pipe(gulp.dest("build/styles/"))
    .pipe(browsersync.stream());
}

function images() {
  return gulp
    .src("src/images/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("build/images"));
}


// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src(["./src/js/**/*"])
      //.pipe(plumber())
      //.pipe(webpackstream(webpackconfig, webpack))
      // folder only, filename is specified in webpack config
      .pipe(gulp.dest("./build/js/"))
      .pipe(browsersync.stream())
  );
}

function watchFiles() {
  gulp.watch("./src/styles/**/*", styles);
  gulp.watch("./src/images/**/*", images);
}

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./build"
    },
    port: 3000
  });
  done();
}

function templates() {
  return gulp
    .src("src/**/*.html")
    .pipe(gulp.dest("build"))
    .pipe(browsersync.stream());
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function watchFiles() {
  gulp.watch("./src/styles/**/*", styles);
  gulp.watch("./src/images/**/*", images);
  gulp.watch("./src/**/*.html", templates);
  gulp.watch("./src/js/*.js", scripts);
}

function clean() {
  return del(["./build/"]);
}

const build = gulp.series(clean, gulp.parallel(templates, styles, images, scripts));
const watch = gulp.parallel(watchFiles, browserSync);
const defaultTask = gulp.series(build, watch);


exports.images = images;
exports.styles = styles;
exports.templates = templates;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.scripts = scripts;
exports.default = defaultTask;