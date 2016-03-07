Angular Fx
==================

[![Join the chat at https://gitter.im/720kb/angular-fx](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/720kb/angular-fx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


###Angular.js + animate.css

Conditional animations and effects for your elements: `ngfx-shake`, `ngfx-pulse`, `ngfx-tada`, and [more](https://github.com/720kb/angular-fx#complete-list) ...

Just use them like you do for `ng-if` or `ng-hide` or `ng-show`.

It uses the awesome [animate.css](http://daneden.github.io/animate.css).

The Angular Fx is developed by [720kb](http://720kb.net).

##Requirements


[AngularJS](http://angularjs.org) v1.2+

[animate.css](http://daneden.github.io/animate.css)


###Browser support


![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
 ✔ | ✔ | IE9 + | ✔ | ✔ |


## Load

To use the directive, include the Angular Fx javascript and css files in your web page and the animate.css file:

```html
<!DOCTYPE HTML>
<html>
<head>
  <link href="bower_components/animate.css/animate.min.css" rel="stylesheet" type="text/css" />
  <!-- angular-fx.css goes after animate.css-->
  <link href="path/to/css/angular-fx.css" rel="stylesheet" type="text/css" />
</head>
<body ng-app="app">
  //.....
  <script src="path/to/js/angular-fx.js"></script>
</body>
</html>
```

##Install

###Bower installation

```
$ bower install angular-fx --save
```

_then load the js files in your html_

###Npm installation

```
$ npm install angular-fx --save
```

_then load the js files in your html_

###Add module dependency

Add the 720kb.fx module dependency

```js
angular.module('app', [
  '720kb.fx'
 ]);
```

Use them like you do for `ng-if` or `ng-show` or `ng-hide`

```html

<a href="#" ngfx-pulse="3 > 2">Pulse</a>

```
## Example

```js
angular.module('app', [
  '720kb.fx'
 ])
 .controller('myCtrl',['$scope', '$timeout', function ($scope, $timeout) {
    $timeout(function () {

     $scope.x = 3;
    }, 2000);

    $timeout(function () {

     $scope.x = 1;
    }, 6000);
 }]);
```

Use them like you do for `ng-if` or `ng-show` or `ng-hide`

```html
<div ng-controller="myCtrl">
<a href="#" ngfx-pulse="x > 2">Pulse</a>
<a href="#" ngfx-fade-out="{{myCondition}}">Fadeout</a>
</div>
```

###[live example](https://720kb.github.io/angular-fx)

##Complete list
_you can refer to the animate.css animations list [here](http://daneden.github.io/animate.css/)_

ngfx-flash

ngfx-pulse

ngfx-rubber-band

ngfx-shake

ngfx-swing

ngfx-tada

ngfx-wobble

ngfx-jello

ngfx-slide-in-up

ngfx-slide-in-left

ngfx-slide-in-right

ngfx-slide-in-down

ngfx-slide-out-up

ngfx-slide-out-left

ngfx-slide-out-right

ngfx-slide-out-down

ngfx-bounce-in

ngfx-bounce-in-down

ngfx-bounce-in-left

ngfx-bounce-in-right

ngfx-bounce-in-up

ngfx-bounce-out

ngfx-bounce-out-down

ngfx-bounce-out-left

ngfx-bounce-out-right

ngfx-bounce-out-up

ngfx-fade-in

ngfx-fade-in-down

ngfx-fade-in-down-big

ngfx-fade-in-left

ngfx-fade-in-left-big

ngfx-fade-in-right

ngfx-fade-in-right-big

ngfx-fade-in-up

ngfx-fade-in-up-big

ngfx-fade-out

ngfx-fade-out-down

ngfx-fade-out-down-big

ngfx-fade-out-left

ngfx-fade-out-left-big

ngfx-fade-out-right

ngfx-fade-out-right-big

ngfx-fade-out-up

ngfx-fade-out-up-big

ngfx-flip

ngfx-flip-in-x

ngfx-flip-in-y

ngfx-flip-out-x

ngfx-flip-out-y

ngfx-light-speed-in

ngfx-light-speed-out

ngfx-rotate-in

ngfx-rotate-in-up-left

ngfx-rotate-in-up-right

ngfx-rotate-in-down-left

ngfx-rotate-in-down-right

ngfx-rotate-out

ngfx-rotate-out-up-left

ngfx-rotate-out-up-right

ngfx-rotate-out-down-left

ngfx-rotate-out-down-right

ngfx-hinge

ngfx-roll-in

ngfx-roll-out

ngfx-zoom-in

ngfx-zoom-in-down

ngfx-zoom-in-left

ngfx-zoom-in-right

ngfx-zoom-in-up

ngfx-zoom-out

ngfx-zoom-out-down

ngfx-zoom-out-left

ngfx-zoom-out-right

ngfx-zoom-out-up

##Options

####Animation speed
To set a different animation speed use the `ngfx-speed="medium | fast | slow"` attribute (default value, if not specified, is `medium`):

```html
<a href="#" ngfx-pulse="3 > 2" ngfx-speed="slow">Slow Pulse</a>
<a href="#" ngfx-pulse="3 > 2" ngfx-speed="medium">Medium Pulse</a>
<a href="#" ngfx-pulse="3 > 2" ngfx-speed="fast">Fast Pulse</a>
```

####Element visibility
If you would your element to be shown or hidden by default, you can use the `ngfx-default="hide | show"` attribute:

```html
<a href="#" ngfx-pulse="3 > 2" ngfx-default="show">Shown by default</a>
<a href="#" ngfx-pulse="3 > 2" ngfx-default="hide">Hidden by default</a>
```

####Infinite animations
If you want an element to repeat the animation or the effect while your condition/expression is true (sometimes needed), just add the `ngfx-infinite` attribute to the element, or, if your browser doesn't support css attributes, use the `.infinite` class:

```html
<a href="#" ngfx-pulse="3 > 2">Pulse one time</a>
<a href="#" ngfx-pulse="3 > 2" ngfx-infinite>Pulse continuously</a>
<a href="#" ngfx-pulse="3 > 2" class="infinite">Pulse continuously</a>
```

##Contributing

We will be much grate if you help us making this project to grow up.
Feel free to contribute by forking, opening issues, pull requests etc.

## License

The MIT License (MIT)

Copyright (c) 2014 Filippo Oretti, Dario Andrei

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
