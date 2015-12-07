$(function() {

// Config

// Selectors
// store selectors for reference so we only call them once
var $window				= $(window),
	$page				= $('html,body'),
	$html				= $('html'),
	$body				= $('body'),
	$hero 				= $('#hero'),
	$heroInner			= $('#hero-inner'),
	$main 				= $('#main');

/**
 * @description Test if a string contains a specific string	
 * @param  		{string} target string
 * @param 		{string} test string
 * @return 		{bool}
 * 
 */
function index(target, test) {

	return target.indexOf(test) != -1;

}


/**
 * @description Test if the url contains a specific string	
 * @param  		{string} url
 * @return 		{bool}
 * 
 */
function contains(url) {

	return index(window.location.pathname, url);

}


/**
 * @description Test if the body id is something
 * @param  		{string}
 * @return 		{bool}
 * 
 */
function page(name) {

	return $body.attr('id') == name;

}


/**
 * @description Check if element exists the page
 * @param  		{string} Element selector
 * @return 		{bool}
 * 
 */
function exists(el) {

	return $(el).length > 0;

}


/**
 * @description Scroll page to specified element
 * @param  		{string} Element selector
 * @return 		{target} Target element
 * 
 */
function scrollTo(el,speed) {

	$page.animate({
		scrollTop: $(el).offset().top
	}, speed);

}


/**
 * @description Return random string from array
 * @param  		{string} Array
 * @return 		{string} Random string
 * 
 */
function random(options) {
		
	return options[Math.floor(Math.random() * options.length)];

}


/**
 * @description Return query string param value
 * @param  		{string} Key
 * @return 		{string} Value
 * 
 */
function query(param) {

	var query = window.location.search;

	if(query)
	{
		query = query.split(param)[1].split('=')[1];
	}

	if(index(query,'&'))
	{
		query = query.split('&')[0];
	}

	return query;

}


/*
 * @description Return markup string for an svg icon
 * @param  		{string} Icon name
 * @return 		{string} Markup
 * 
 */

function createIcon(icon) {

	return '<svg class="icon icon-' + icon + '"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/images/icons/icon-library.svg#icon-' + icon + '"></use></svg>';

}

//function to replace values in keyframe with the new values
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

var finalKeyframe = '';
$('.submit').click(function() {

  var iterations = $('#iterations').val();
  var animationSelected = $('#animation').val();
  var duration = $('#duration').val();
  var strength = $('.range').val();
  var animationName = animationSelected + '100';
  var ss = document.styleSheets;
    //add element for animation to the page
    $('.display-wrapper').html('<p class="display animation-display">Sassimate</p>');
    //create the sass mixin and append to the page
    $('.display').addClass(iterations).addClass(animationSelected).addClass(strength+animationName).attr('id', animationSelected).show();
      $('.mixin-wrapper').text(" @include animate(" + animationSelected + ", " + duration + "s, $strength: "+ strength +", $iteration: " + iterations + ")");
      //change css properties to change our animation
      $('.display').css({
                          "animation-iteration-count" :iterations,
                          "animation-name"  : animationName,
                          "animation-duration": duration + "s"

      });

      //functions to get the value of our json from sass
      function getValues(animationNameForProperty) {
          var elem       = document.getElementById(animationSelected),
              result   = getComputedStyle(elem , '::before').content;
              result = result.replace(/'/g, '"');
              if(result != '') {
                   return JSON.parse(result);
              }
              else {

              }

      }

      //find the before and get the value we need to add our maths to
      var valuesArray = getValues(animationName);
      if (valuesArray != undefined) {


      valuesArray = valuesArray.replace(/\"/g, "");
      valuesArray = valuesArray.split(',');

console.log(valuesArray);


if( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ){
    var cssRulesList = document.styleSheets[1].cssRules;
    console.log(cssRulesList);
    var keyFramesArray = [];

    for (i = 0; i < cssRulesList.length; i++) {
        if(cssRulesList[i].type == 7) {
            console.log(cssRulesList[i].type);
            var cssAnimationName = cssRulesList[i].name;
            keyFramesArray.push({'keyframe': cssRulesList[i], 'Value': cssAnimationName});
        }

    }
} else {
    var cssRulesList = document.styleSheets[1].cssRules;
    var keyFramesArray = [];

    for (i = 0; i < cssRulesList.length; i++) {
        if(cssRulesList[i].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE) {
            var cssAnimationName = cssRulesList[i].name;
            keyFramesArray.push({'keyframe': cssRulesList[i], 'Value': cssAnimationName});
        }
    }

}






    for (i = 0; i < keyFramesArray.length; i++) {
        if(keyFramesArray[i].Value == animationName) {
            var strength = strength;
            var keyframesString = ''+ keyFramesArray[i].keyframe.cssText + '';
            keyframesString.toString();
            keyframesString = keyframesString.replace(/\(/g,"( ").replace(/\)/g," )");
            // keyframesString = replaceAll(keyframesString, "(", "( " );
            for (j = 0; j < valuesArray.length; j++) {
                if(index(valuesArray[j], 'px')) {
                    var numberValue = valuesArray[j].split('px');
                    var newValue = (parseFloat(numberValue[0]) / 100) * strength;
                    keyframesString = replaceAll(keyframesString, valuesArray[j], newValue.toString() + 'px');
                }
                else if(index(valuesArray[j], '%')) {
                    console.log(valuesArray[j]);
                    var numberValue = valuesArray[j].split('%');
                    var newValue = (parseFloat(numberValue) / 100) * strength;
                    keyframesString = replaceAll(keyframesString, valuesArray[j]+',', newValue.toString() + '%,');
                }
                else if(index(valuesArray[j], 'deg')) {
                    var numberValue = valuesArray[j].split('deg');
                    var newValue = (parseFloat(numberValue) / 100) * strength;
                    keyframesString = replaceAll(keyframesString, valuesArray[j], newValue + 'deg');
                }
                else if(animationName == 'pulse100' || animationName ==  'rubberBand100'|| animationName ==  'bounceIn100' || animationName ==  'bounceOut100'){
                    var numberValue = valuesArray[j];

                    var newValue = ( (parseFloat(numberValue) - 1)  / 100) * strength + 1;
                    console.log(newValue);
                    keyframesString =replaceAll(keyframesString, valuesArray[j]+',', newValue+',');
                }
                else if(animationName == 'rollIn100' || animationName ==  'rollOut100'){
                    var numberValue = valuesArray[j];
                    var newValue = ( (parseFloat(numberValue) - 100)  / 100) * strength + 100;
                    keyframesString =replaceAll(keyframesString, valuesArray[j], newValue);
                }
                else if(animationName == 'rotateIn100' || animationName ==  'rotateOut100'){
                    var numberValue = valuesArray[j];
                    var newValue = ( (parseFloat(numberValue) - 150)  / 100) * strength + 150;
                    keyframesString =replaceAll(keyframesString, valuesArray[j], newValue);
                }
                else if(animationName == 'zoomIn100' || animationName == 'zoomOut100'){
                  console.log('hi');
                    var numberValue = valuesArray[j];
                    var newValue = 1 - ((1/100) * strength);
                    console.log(newValue);
                    keyframesString =replaceAll(keyframesString, valuesArray[j]+',', newValue+',');
                }
                else if(animationName == 'bounceIn100' || animationName == 'bounceOut100'){
                    var numberValue = valuesArray[j];
                    var newValue = 0.9 - ((0.6/100) * strength);
                    console.log(newValue)
                    keyframesString =replaceAll(keyframesString, valuesArray[j], newValue);
                }

            }

            finalKeyframe += keyframesString;
        }

        $('.style').html('<style>' + finalKeyframe +'<style>');
    }
  }
});

}); // end doc ready

//# sourceMappingURL=sassimate.js.map