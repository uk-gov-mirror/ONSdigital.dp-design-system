const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const postcss = require("gulp-postcss")
const cssnano = require("cssnano")
const bemlinter = require("postcss-bem-linter")
const reporter = require("postcss-reporter");
const sasslint = require("sass-lint")
const stylelint = require("gulp-stylelint")

sass.compiler = require('dart-sass');

const input = './src/scss/**/*.scss';
const output = './dist/css';
const sassOptionsDev = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};
const sassOptionsProd = {
    errLogToConsole: true,
    outputStyle: 'compressed'
};
const plugins = [autoprefixer({grid: "autoplace"}), cssnano(), bemlinter({preset: 'bem'}), reporter()]
const reporters = [{formatter: "verbose", console: true}]

// Will generate source maps, transpile SCSS into CSS, prefix styles with vendor prefixes then optimise the final css size
gulp.task('css', function (done) {
    return gulp
        .src(input)
        .pipe(sourcemaps.init())
        .pipe(stylelint({reporters}))
        .pipe(sass(sassOptionsDev).on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(output))
        .on('end', done);
});

// Will watch the scss files then run css if any changes are found
gulp.task('watch', function () {
    return gulp
        .watch(input, gulp.series('css'))
        .on('change', function (file) {
            console.log('File ' + file + ' was changed, running tasks...');
        });
});

// Put all required dev tasks in here and then watch
gulp.task('default', gulp.series('css', 'watch'));

// Put all prod build tasks in here
gulp.task('build', gulp.series('css', function () {
    return gulp
        .src(input)
        .pipe(sass(sassOptionsProd).on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulp.dest(output));
}));
