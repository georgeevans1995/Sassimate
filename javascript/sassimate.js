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
//add element for animation to the page
//variable for our keyframes
var finalKeyframe = '';
var keyframesString = '';
//on click of the button
$('.submit').click(function() {
    //get the values of the form and put them into variables
    var iterations = $('#iterations').val();
    var animationSelected = $('#animation').val();
    var duration = $('#duration').val();
    var strength = $('.range').val();
    var animationName = animationSelected + '100';

    //forces animation to re-run
    $('.display-wrapper').html('<p class="display animation-display">Sassimate</p>');

    //add classes to the display to determine the animation
    $('.display').addClass(iterations).addClass(animationSelected).attr('id', animationSelected);

    //create the sass mixin with variables and append to the page
    $('.mixin-wrapper').text(" @include animate(" + animationSelected + ", " + duration + "s, $strength: "+ strength +", $iteration: " + iterations + ")");

  //change css properties to change our animation duration iterations and name
  $('.display').css({
                      "animation-iteration-count" :iterations,
                      "animation-name"  : animationName,
                      "animation-duration": duration + "s"

  });

  //functions to get the value of our array from sass
  function getValues(animationNameForProperty) {
      var elem       = document.getElementById(animationSelected),
          result   = getComputedStyle(elem , '::before').content;
          result = result.replace(/'/g, '"');

      if(result != '') {
           return JSON.parse(result);
      }
  }
  //store it in a variable
  var valuesArray = getValues(animationName);

  //if it is defined (this stops it erroring on those without strength e.g flash)
  if (valuesArray != undefined) {

      //remove the quote marks
      valuesArray = valuesArray.replace(/\"/g, "");
      //create an array of the values
      valuesArray = valuesArray.split(',');

      //if we are in firefox
      //create an array to store the keyframes in
      var keyFramesArray = [];
      if( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ){
            //get the stylsheet rules
            var cssRulesList = document.styleSheets[1].cssRules;

            //loop through the stylesheet and test if type is 7
            for (i = 0; i < cssRulesList.length; i++) {
                if(cssRulesList[i].type == 7) {
                    //if it is 7 then get the name and add it to an array of obects
                    var cssAnimationName = cssRulesList[i].name;
                    keyFramesArray.push({'keyframe': cssRulesList[i], 'Value': cssAnimationName});
                }
            }
        }
        //webkit browsers
        else
        {
            //get the stylsheet rules
            var cssRulesList = document.styleSheets[1].cssRules;
            //loop through the stylesheet and test if type is WEBKIT_KEYFRAMES_RULE
            for (i = 0; i < cssRulesList.length; i++) {
                if(cssRulesList[i].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE) {
                    //if it is then get the name and add it to an array of obects
                    var cssAnimationName = cssRulesList[i].name;
                    keyFramesArray.push({'keyframe': cssRulesList[i], 'Value': cssAnimationName});
                }
            }
        }

        //begin the loop to go through the keyframes array
        for (i = 0; i < keyFramesArray.length; i++) {
            // if we have a match between the animation name and the animation we are looping through
            if(keyFramesArray[i].Value == animationName) {

                //create our keyframe string made up of the current keyframe
                var keyframesString = ''+ keyFramesArray[i].keyframe.cssText + '';

                //convert it to a string
                keyframesString.toString();

                //replace brackets so that they have a space either side
                keyframesString = keyframesString.replace(/\(/g,"( ").replace(/\)/g," )");

                //start this loop to go through the values array
                for (j = 0; j < valuesArray.length; j++) {

                    //if the array contains px run this
                    if(index(valuesArray[j], 'px')) {
                        //split on the px and remove it
                        var numberValue = valuesArray[j].split('px');
                        // do the maths
                        var newValue = (parseFloat(numberValue[0]) / 100) * strength;
                        //replace the old keyframes values with the new ones
                        keyframesString = replaceAll(keyframesString, valuesArray[j], newValue.toString() + 'px');
                    }

                    //if the array contains % run this
                    else if(index(valuesArray[j], '%')) {
                        var numberValue = valuesArray[j].split('%');
                        var newValue = (parseFloat(numberValue) / 100) * strength;
                        keyframesString = replaceAll(keyframesString, valuesArray[j]+',', newValue.toString() + '%,');
                    }

                    //if the array contains deg run this
                    else if(index(valuesArray[j], 'deg')) {
                        var numberValue = valuesArray[j].split('deg');
                        var newValue = (parseFloat(numberValue) / 100) * strength;
                        keyframesString = replaceAll(keyframesString, valuesArray[j], newValue + 'deg');
                    }

                    //if statements for the more complex animations
                    //if pulse, rubber band, bounceIn or Out
                    else if(animationName == 'pulse100' || animationName ==  'rubberBand100'|| animationName ==  'bounceIn100' || animationName ==  'bounceOut100') {
                        var numberValue = valuesArray[j];
                        var newValue = ( (parseFloat(numberValue) - 1)  / 100) * strength + 1;
                        keyframesString =replaceAll(keyframesString, valuesArray[j]+',', newValue+',');
                    }

                    //if rollIn or Out
                    else if(animationName == 'rollIn100' || animationName ==  'rollOut100'){
                        var numberValue = valuesArray[j];
                        var newValue = ( (parseFloat(numberValue) - 100)  / 100) * strength + 100;
                        keyframesString =replaceAll(keyframesString, valuesArray[j], newValue);
                    }

                    //if rotateIn or Out
                    else if(animationName == 'rotateIn100' || animationName ==  'rotateOut100'){
                        var numberValue = valuesArray[j];
                        var newValue = ( (parseFloat(numberValue) - 150)  / 100) * strength + 150;
                        keyframesString =replaceAll(keyframesString, valuesArray[j], newValue);
                    }

                    //if zoomIn or Out
                    else if(animationName == 'zoomIn100' || animationName == 'zoomOut100'){
                        var numberValue = valuesArray[j];
                        var newValue = 1 - ((1/100) * strength);
                        keyframesString =replaceAll(keyframesString, valuesArray[j]+',', newValue+',');
                    }
                }

                //create the final keyframe
                finalKeyframe += keyframesString;
            }

        //add the new keyframe to the DOM in style tages
        $('.style').html('<style>' + finalKeyframe +'<style>');
    }
  }
});
//celebrate

}); // end doc ready

//# sourceMappingURL=sassimate.js.map