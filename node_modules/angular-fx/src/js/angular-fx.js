/*global angular*/
(function withAngularFx(angular) {
  'use strict';

  angular.module('720kb.fx', [])
  .directive('ngfxSlideOutRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-slideoutright-start animated slideOutRight'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxSlideOutRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxSlideOutRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxSlideOutLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-slideoutleft-start animated slideOutLeft'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxSlideOutLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxSlideOutLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxSlideOutDown', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-slideoutdown-start animated slideOutDown'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxSlideOutDown)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxSlideOutDown, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxSlideOutUp', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-slideoutup-start animated slideOutUp'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxSlideOutUp)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxSlideOutUp, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxSlideInUp', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-slideinup-start animated slideInUp'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxSlideInUp)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxSlideInUp, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxSlideInDown', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-slideindown-start animated slideInDown'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxSlideInDown)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxSlideInDown, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxSlideInLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-slideinleft-start animated slideInLeft'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxSlideInLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxSlideInLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxSlideInRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-slideinright-start animated slideInRight'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxSlideInRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxSlideInRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxJello', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-jello-start animated jello'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxJello)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxJello, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounce', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounce-start animated bounce'
          , fx = function fxFunction() {

            if (scope.$eval(attributes.ngfxBounce)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounce, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFlash', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-flash-start animated flash'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFlash)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFlash, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxPulse', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-pulse-start animated pulse'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxPulse)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxPulse, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRubberband', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rubberband-start animated rubberBand'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRubberband)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRubberband, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxShake', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-shake-start animated shake'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxShake)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxShake, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxSwing', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-swing-start animated swing'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxSwing)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxSwing, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxTada', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-tada-start animated tada'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxTada)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxTada, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxWobble', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-wobble-start animated wobble'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxWobble)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxWobble, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceIn', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bouncein-start animated bounceIn'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceIn)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceIn, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceInDown', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounceindown-start animated bounceInDown'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceInDown)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceInDown, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceInLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounceinleft-start animated bounceInLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceInLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceInLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceInRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounceinright-start animated bounceInRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceInRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceInRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceInUp', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounceinup-start animated bounceInUp'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceInUp)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceInUp, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceOut', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounceout-start animated bounceOut'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceOut)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceOut, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceOutDown', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounceoutdown-start animated bounceOutDown'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceOutDown)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceOutDown, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceOutLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounceoutleft-start animated bounceOutLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceOutLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceOutLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceOutRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounceoutright-start animated bounceOutRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceOutRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceOutRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxBounceOutUp', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-bounceoutup-start animated bounceOutUp'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxBounceOutUp)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxBounceOutUp, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeIn', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadein-start animated fadeIn'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeIn)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeIn, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeInDown', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeindown-start animated fadeInDown'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeInDown)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeInDown, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeInDownBig', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeindownbig-start animated fadeInDownBig'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeInDownBig)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeInDownBig, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeInLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeinleft-start animated fadeInLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeInLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeInLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeInLeftBig', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeinleftbig-start animated fadeInLeftBig'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeInLeftBig)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeInLeftBig, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeInRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeinright-start animated fadeInRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeInRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeInRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeInRightBig', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeinrightbig-start animated fadeInRightBig'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeInRightBig)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeInRightBig, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeInUp', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeinup-start animated fadeInUp'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeInUp)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeInUp, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeInUpBig', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeinupbig-start animated fadeInUpBig'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeInUpBig)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeInUpBig, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeOut', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeout-start animated fadeOut'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeOut)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeOut, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeOutDown', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeoutdown-start animated fadeOutDown'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeOutDown)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeOutDown, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeOutDownBig', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeoutdownbig-start animated fadeOutDownBig'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeOutDownBig)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeOutDownBig, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeOutLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeoutleft-start animated fadeOutLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeOutLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeOutLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeOutLeftBig', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeoutleftbig-start animated fadeOutLeftBig'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeOutLeftBig)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeOutLeftBig, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeOutRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeoutright-start animated fadeOutRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeOutRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeOutRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeOutRightBig', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeoutrightbig-start animated fadeOutRightBig'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeOutRightBig)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeOutRightBig, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeOutUp', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeoutbig-start animated fadeOutUp'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeOutUp)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeOutUp, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFadeOutUpBig', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-fadeoutupbig-start animated fadeOutUpBig'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFadeOutUpBig)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFadeOutUpBig, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFlip', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-flip-start animated flip'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFlip)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFlip, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFlipInX', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-flipinx-start animated flipInX'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFlipInX)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFlipInX, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFlipInY', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-flipiny-start animated flipInY'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFlipInY)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFlipInY, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFlipOutX', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-flipouty-start animated flipOutY'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFlipOutX)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFlipOutX, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxFlipOutY', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-flipouty-start animated flipOutY'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxFlipOutY)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxFlipOutY, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxLightSpeedIn', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-lightspeedin-start animated lightSpeedIn'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxLightSpeedIn)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxLightSpeedIn, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxLightSpeedOut', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-lightspeedout-start animated lightSpeedOut'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxLightSpeedOut)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxLightSpeedOut, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateIn', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotatein-start animated rotateIn'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateIn)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateIn, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateInUpLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotateinupleft-start animated rotateInUpLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateInUpLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateInUpLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateInUpRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotateinupright-start animated rotateInUpRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateInUpRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateInUpRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateInDownLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotateindownleft-start animated rotateInDownLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateInDownLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateInDownLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateInDownRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotateindownright-start animated rotateInDownRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateInDownRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateInDownRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateOut', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotateout-start animated rotateOut'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateOut)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateOut, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateOutUpLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotateoutupleft-start animated rotateOutUpLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateOutUpLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateOutUpLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateOutUpRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotateoutupright-start animated rotateOutUpRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateOutUpRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateOutUpRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateOutDownLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotateoutdownleft-start animated rotateOutDownLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateOutDownLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateOutDownLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRotateOutDownRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rotateoutdownright-start animated rotateOutDownRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRotateOutDownRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRotateOutDownRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxHinge', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-hinge-start animated hinge'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxHinge)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxHinge, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRollIn', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rollin-start animated rollIn'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRollIn)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRollIn, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxRollOut', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-rollout-start animated rollOut'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxRollOut)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxRollOut, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomIn', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoomin-start animated zoomIn'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomIn)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomIn, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomInDown', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoomindown-start animated zoomInDown'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomInDown)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomInDown, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomInLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoominleft-start animated zoomInLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomInLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomInLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomInRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoominright-start animated zoomInRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomInRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomInRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomInUp', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoominup-start animated zoomInUp'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomInUp)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomInUp, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomOut', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoomout-start animated zoomOut'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomOut)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomOut, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomOutDown', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoomoutdown-start animated zoomOutDown'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomOutDown)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomOutDown, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomOutLeft', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoomoutleft-start animated zoomOutLeft'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomOutLeft)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomOutLeft, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomOutRight', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoomoutright-start animated zoomOutRight'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomOutRight)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomOutRight, function watchFunction() {
          fx();
        });
      }
    };
  }])
  .directive('ngfxZoomOutUp', [function ngfxFunction() {
    return {
      'restrict': 'A',
      'link': function linkingFunction(scope, element, attributes) {

        var c = 'ngfx-zoomoutup-start animated zoomOutUp'
          , fx = function fxFunction() {
            if (scope.$eval(attributes.ngfxZoomOutUp)) {

              element.removeClass('animated').addClass(c);
            } else {
              element.removeClass(c);
            }
          };

        scope.$watch(attributes.ngfxZoomOutUp, function watchFunction() {
          fx();
        });
      }
    };
  }]);
}(angular));
