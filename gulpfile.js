/// <binding ProjectOpened='build' />
'use strict';

const gulp = require('gulp');

// HTML-related
const htmlmin = require('gulp-htmlmin');
const twig = require('gulp-twig');

// CSS-related
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCss = require('gulp-clean-css');
const del = require('del');

// JS-related
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const include = require('gulp-include');

// Utility-related
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const open = require('gulp-open');
const inject = require('gulp-inject-string');
const fs = require('fs');
const gulpReplace = require('gulp-replace');

const localhost = 'http://127.0.0.1:8080/';

const roots = {
    src: './src',
    dist: './dist',
};

const replace = function (search, str) {
  return stream(function(fileContents) {
    return fileContents.replace(new RegExp(search, 'g'), str);
  });
}

// Clean task
gulp.task('clean-dist', async function (done) {
    return del([
        `${roots.dist}/temp`
    ]);
});

// Move html to dist
gulp.task('html', function (done) {
    return gulp.src([`${roots.src}/index.html`])
        .pipe(gulp.dest(`${roots.dist}`))
        .pipe(connect.reload());
});

// Twig to HTML
gulp.task('twig', function (done) {
    return gulp.src('src/_view-metadata-markup.twig')
        .pipe(twig())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`${roots.dist}/temp`))
});

// Creates JS sourcemaps, concatenates JS files into one file based on array above, and minifies JS
gulp.task('js', function (done) {
    
    // Save css string
    let cssFileContent = fs.readFileSync('dist/temp/view-metadata.css', 'utf8');
    
    // Save html string
    let modalFileContent = fs.readFileSync('dist/temp/_view-metadata-markup.html', 'utf8');
        
    return gulp.src([`${roots.src}/js/view-metadata.js`], { sourcemaps: true })
        .pipe(include())
        .pipe(concat('view-metadata.js'))
        
        // Inject css string into js
        .pipe(inject.replace('//=inject view-metadata.css', cssFileContent.trim() ))
        
        // Inject html string into js
        .pipe(inject.replace('//=inject _view-metadata-markup.html', modalFileContent.trim() ))
        
        // Remove scss sourcemaps linkage from string
        .pipe(gulpReplace('/*# sourceMappingURL=view-metadata.css.map */', ''))
        
        .pipe(minify({
            ext: {
                min: ".min.js",
            },
                preserveComments: 'some'
            
        }))
        .pipe(gulp.dest(`${roots.dist}/js`, { sourcemaps: '.' }))
        .pipe(connect.reload());
});

// Creates Main CSS sourcemaps, converts SCSS to CSS, adds prefixes, and lints CSS
gulp.task('sass', function (done) {
    const plugins = [
        autoprefixer({ grid: true })
    ];

    return gulp.src([`${roots.src}/scss/view-metadata.scss`])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${roots.dist}/temp`))
        .pipe(connect.reload());
});

// Runs a server to static HTML files and sets up watch tasks
gulp.task('server', function (done) {
    gulp.watch((`${roots.src}/**/*.html`), gulp.series('html'));
    gulp.watch((`${roots.src}/scss/**/*.scss`), gulp.series('twig', 'sass', 'js', 'clean-dist'));
    gulp.watch((`${roots.src}/**/*.twig`), gulp.series('twig', 'sass', 'js', 'clean-dist'));
    gulp.watch((`${roots.src}/js/**/*`), gulp.series('twig', 'sass', 'js', 'clean-dist'));

    connect.server({
        root: roots.dist,
        livereload: true
    });

    setTimeout(function () {
        return gulp.src(__filename)
            .pipe(open({ uri: localhost }));
    }, 2000);

    done();
});

gulp.task('build', gulp.series('twig', 'sass', 'html', 'js', 'clean-dist'));

gulp.task('default', gulp.series('build', 'server', 'clean-dist'));
