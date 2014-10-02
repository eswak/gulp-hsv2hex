gulp-hsv2hex
============

This gulp task is used to postprocess css files in order to add a new hsv() function (Hue, Saturation, Value) in order to describe colors.

### Example ###
```css
/* app.css (input) */
body {
  background-color: hsv(112, 32, 25);
  background-color: hsv(112, 32%, 25%);
  background-color: hsv(112, .32, .25);
}
/* app.css (output) */
body {
  background-color: #344032;
  background-color: #344032;
  background-color: #344032;
}
```
### How to use ###
gulpfile.js: 
```js
var hsv2hex = require('./tasks/gulp-hsv2hex');

// Compile myth css files
gulp.task('hsv2hex', function() {
  return gulp.src('./dist/app.css')
    .pipe(hsv2hex())
    .pipe(gulp.dest('./dist'));
});
```
