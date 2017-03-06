'use strict';

const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const gulpLoadPlugins = require('gulp-load-plugins');

// load the plugins into an array of plugins
const $ = gulpLoadPlugins();

// configs
const sassOptions = { outputStyle: 'nested' };
const nanoOptions = {
    convertValues: { length: false, boolean: false },
    mergeRules: false
};

// tasks
gulp.task('styles', () =>
    gulp
        .src('app/sass/*.scss')
        .pipe(
            $.sass(sassOptions)
                .on('error', $.sass.logError)
        )
        .pipe($.cssnano(nanoOptions))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream({ match: '**/*.css' }))
);

gulp.task('views', () =>
    gulp
        .src([
          'app/**/*.html',
          '!node_modules/**/*.html'
        ])
        .pipe(gulp.dest('dist'))
);

gulp.task('clean', () => del(['dist'], { dot: true }) );

gulp.task('default', ['build'], () => {
    browserSync({
        notify: false,
        server: 'dist',
        online: true
    });

    gulp.watch('app/sass/**/*.scss', ['styles']);
    gulp.watch('app/**/*.html', ['views']);
    gulp.watch([
        'dist/**/*.html',
        'dist/css/*.css'
    ]).on('change', browserSync.reload);
});

gulp.task('build', callback => {
  runSequence('clean', 'views', 'styles', callback);
});

gulp.task('deploy', ['build'], () =>
    gulp
        .src('./dist/**/*')
        .pipe($.ghPages())
);
