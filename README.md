# Sassimate
Sass mixin for dynamic animations<br>

#Installation

1. Download sassimate.zip and add the enclosed files to your project in your sass folder<br>
2. Go to animation.scss and change the file paths to wherever you have put the files.<br>
3. Run gulp on your project<br>

#Usage
The mixin is called with 4 arguments<br>

1. $animation-name<br>
2. $duration<br>
3. $strength (optional, defaults to 100)<br>
4. $iterations (optional, defaults to 1)<br>

Calling an animation works like this<br>
```sass
p{
    @include sassimate($animation-name: bounce, $duration: 1s, $strength: 50, $iterations: 2);
}
```
Or in shorthand<br>
```sass
p {
    @include sassimate(bounce, 1s, 50, 2);
}
```
#Adding your own animations
1. Add the file to the animations folder with your keyframe in there.<br>
2. make sure the name of the file and the name of the keyframe match.<br>
3. go to the animations.scss file and add @import 'fill-path/animation/newfilename';<br>
4. also add to the @if/else statement :<br>
```sass
@elseif $name == newAnimationName {
  @include newAnimationName($strength);
}
```
5. Do any maths to the mixin to allow the strength to work. If yo aren't bothered by strength then add do this:<br>
```sass
    @mixin newAnimationName($strength:100){
        @-webkit-keyframes newAnimationName#{$strength} {
              //keyframe stuff
        }
    }
```
and always call the animation using strength 100 to avoid creating multiple keyframes<br>


#Demo<br>
NOTE: Demo will only work on chrome, firefox and is a bit dubious on safari. This is due to the generator code and not the animations. All animations in the normal project files should work on all browsers that support keyframes and transforms.<br>

https://georgeevans1995.github.io/Sassimate<br>

#Credits
All animations have originated from the animate.css Library! To check this project out go to:
https://daneden.github.io/animate.css/
