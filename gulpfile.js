import gulp from 'gulp';
import plumber from 'gulp-plumber';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import { deleteSync } from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML
export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
};

//Scripts
const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());;
}

//Images
export const images = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

//webP
export const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(squoosh({
      webp: {},
    }))
    .pipe(gulp.dest("build/img"))
}

//SVG
const svg = () => {
  return gulp.src('source/img/**/*.svg')
    .pipe(svgo({
      plugins: [
        {
          removeViewBox: false
        }
      ]
    }))
    .pipe(gulp.dest('build/img'));
}

export const sprite = () => {
  return gulp.src("source/img/**/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

//Copy
const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/*.ico',
    'source/*.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

//Clean
const clean = (done) => {
  deleteSync('build');
  done();
}

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher
const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html"));
}

//Build
export const build = gulp.series(
  clean,
  copy,
  images,
  gulp.parallel(
    html,
    styles,
    scripts,
    svg,
    sprite,
    createWebp
  )
);

// Default
export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
