var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    rollup = require('rollup-stream'),
    babel = require('rollup-plugin-babel'),
    builtins = require('rollup-plugin-node-builtins'),
    resolve = require('rollup-plugin-node-resolve'),
    source = require('vinyl-source-stream'),
    rootImport = require('rollup-plugin-root-import');


var cache

gulp.task('default', function(cb) {
  return rollup({
    input: './src/index.js',
    cache: cache,
    format: "umd",
    plugins: [
      babel({
        ignore: ['src/js/vendor/**', 'node_modules/**']
      }),
      rootImport({
        root: `${__dirname}/src/`,
        useEntry: 'prepend',
        extensions: '.js'
      }),
      builtins(),
      resolve()
    ]
  }).on('bundle', function(bundle){ cache = bundle; })
    .on('error', function(e){
      console.log(e);
      cb();
    })
    .pipe(source('index.js'))
    .pipe(gulp.dest('./dist/'))
    .on('end', cb);
});
