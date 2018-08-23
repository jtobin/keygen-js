var gulp = require('gulp'),
    gutil = require('gulp-util'),
    babel = require('gulp-babel'),
    rollup = require('rollup-stream'),
    babel = require('rollup-plugin-babel'),
    builtins = require('rollup-plugin-node-builtins'),
    resolve = require('rollup-plugin-node-resolve'),
    source = require('vinyl-source-stream'),
    commonjs = require('rollup-plugin-commonjs'),
    rootImport = require('rollup-plugin-root-import');

var cache

gulp.task('default', function(cb) {
  return rollup({
    input: './src/index.js',
    name: "keygen",
    cache: cache,
    format: "umd",
    plugins: [
      babel({
        ignore: ['node_modules/**']
      }),
      commonjs(),
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
