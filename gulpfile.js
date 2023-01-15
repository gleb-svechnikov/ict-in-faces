const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

const paths = {
    root: './dist',
    templates: {
        pages: './src/*.pug',
        src: './src/*.pug',
        dest: './dist/',
    },
    styles: {
        main: './src/*.scss',
        src: './src/*.scss',
        dest: './dist/'
    },
    sripts: {
        src: './srs/*js',
        dest: './dist/'
    },

    images: {
        src: './src/img/content-image/*',
        src: './src/img/icons/*',
        dest: './dist/images/content-image',
        dest: './dist/images/icons'

    }

}

function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates)
}

function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

function templates() {
    return gulp.src(paths.templates.pages)
       .pipe(pug({ pretty: true }))
       .pipe(gulp.dest(paths.root))
}



function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
   return gulp.src(paths.sripts.src)
     .pipe(gulpWebpack(webpackConfig, webpack))
     .pipe(gulp.dest(paths.sripts.dest))
}

function images() {
    return gulp.src(paths.images.src)
         .pipe(imagemin())
         .pipe(gulp.dest(paths.images.dest))
}


exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;

gulp.task('default', () => 
    gulp.src('img/*')
       .pipe(imagemin())
       .pipe(gulp.dest('dist/assets'))
)

gulp.task('default', 
    gulp.series(
    gulp.parallel(styles, templates, images),
    gulp.parallel(watch, server)
));

