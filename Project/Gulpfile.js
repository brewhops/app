'use strict';

//Requrements

var gulp   = require('gulp');
// automatically load gulp plugins into the object plugin
var plugin = require("gulp-load-plugins")({
   pattern: ['gulp-*', 'gulp.*'],
   replaceString: /\bgulp[\-.]/
});

// auto inject dependencies
var wiredep     = require("wiredep").stream;
// module to import folders
var requireDir = require('require-dir');
// bring in the gulp tasks from the gulp-tasks folder
requireDir('./gulp-tasks');


//config paths
var config      = require('config.json')('./config.json');
var root        = config.root + "/";
var destination = config.end + "/";
var anyFile     = "**/*";
var not         = "!";
var paths = {
    start: {
        all: {
            html:   root + config.folders.html   + "/**/*.html",
            css:    root + config.folders.css    + "/**/*.styl",
            js:     root + config.folders.js     + "/**/*.js",
            images: root + config.folders.images + "/**/*"
        },
        top: {
            html:   root + config.folders.html + "/*.html",
            css:    root + config.folders.css  + "/*.styl",
            js:     root + config.folders.js   + "/*.js"
        }
   }
}

//////////
// HTML //
//////////
//move all the html files to the destination folder
gulp.task('html', function() {
   return gulp.src(paths.start.all.html) //select all html documents
      .pipe(plugin.flatten())            //put them in a single folder directory
      .pipe(gulp.dest(destination));     //send them over to the destination folder
});


/////////
// CSS //
/////////
// compile our stylus files and send them straight to dist
gulp.task('css', function() {
   return gulp.src(paths.start.top.css) //get our stylus files
      .pipe(plugin.stylus())            //compile them
      .pipe(gulp.dest(destination));    //put them in our destination folder
});


////////
// JS //
////////
//get all js files and put them in the destination folder
gulp.task('js', function() {
   return gulp.src(paths.start.all.js)  //get our js files
      .pipe(plugin.flatten())           //put them all in a single folder directory
      .pipe(gulp.dest(destination));    //move them to our destination folder
});


////////////////
// Misc Files //
////////////////
gulp.task('images', function() {
   //get our images folder
   return gulp.src(paths.start.all.images)
      .pipe(gulp.dest(destination + 'images'));
});

//////////////
// Cleaning //
//////////////
gulp.task('clean', function() {
   return gulp.src(destination, {read: false}).pipe(plugin.clean());
});


///////////////
// Reloading //
///////////////
gulp.task('reload', function() {
    return gulp.src(destination + "*.*")
        .pipe(plugin.connect.reload());
});


///////////
// Watch //
///////////
gulp.task('watch', function() {
   gulp.watch(paths.start.all.css,  gulp.series('css', 'reload'));
   gulp.watch(paths.start.all.html, gulp.series('html', 'wire-port-local', 'reload'));
   gulp.watch(paths.start.all.js,   gulp.series('js', 'wire-port-local', 'reload'));
});


////////////////
// Main Calls //
////////////////

//simply builds the dist folder. Good for testing the build
//process without serving the site
gulp.task('build', gulp.series(
    gulp.parallel('html', 'css', 'js', 'images'),
    'wire-port-local'
));

//build, format the socket.io url to localhost and serve the site
gulp.task('local', gulp.series(
   'build',
   gulp.parallel('watch', 'serve')
));
//clean, build, and then format the socket.io url to the deployed instance
gulp.task('prod', gulp.series(
   'clean',
   'build',
   'wire-port-prod'
));
//build for local by default
gulp.task('default', gulp.parallel('local'));
