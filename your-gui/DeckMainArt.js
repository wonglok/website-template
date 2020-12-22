import { useEffect } from 'react'
export function DeckKeyVisual () {
  useEffect(() => {
    (function () {
        var CONFIG = {
          parallax: [
            {
              className: "deck86-hello-bottom-1",
              parallax: {
                x: 0.5, //greater = more movement
                y: 0
              },
              needRotate: false
            },
            {
              className: "deck86-hello-bottom-2",
              parallax: {
                x: 0.5, //greater = more movement
                y: 0
              },
              needRotate: false
            },
            {
              className: "deck86-hello-bottom-3",
              parallax: {
                x: 0.5, //greater = more movement
                y: 0
              },
              needRotate: false
            },
            {
              className: "deck86-hello-bottom-4",
              parallax: {
                x: 0.5, //greater = more movement
                y: 0
              },
              needRotate: false
            },

            //monk
            {
              className: "deck86-hello-center-1",
              parallax: {
                x: 1.6, //greater = more movement
                y: 0.0
              },
              needRotate: false
            },
            //lion
            {
              className: "deck86-hello-center-3",
              parallax: {
                x: 1.6, //greater = more movement
                y: 0.0
              },
              needRotate: false
            }
          ]
        };

        var state = {
          pX: 0,
          pY: 0,

          cX: 0,
          cY: 0,

          _o: {
            ix: 0,
            iy: 0,
            cx: 0,
            cy: 0,

            calibrateTrigger: 50,
            calibrationDelay: 500,

            frictionX: 0.07,
            frictionY: 0.07,

            canCalibrate: true,
            canCalibrateX: false,
            canCalibrateY: true,
            isPortrait: false,

            mx: 0,
            my: 0,

            dX: 0,
            dY: 0,

            aX: 0,
            aY: 0,

            calibrationTimer: 0
          }
        };

        function enableCalibrate() {
          state._o.canCalibrate = true;
        }

        function tryUpdateCalibration(time) {
          clearTimeout(state._o.calibrationTimer);
          state._o.calibrationTimer = setTimeout(
            enableCalibrate,
            time || 0
          );
        }

        function processOrientationValues() {
          var oState = state._o;
          //orientation change
          var dx = oState.ix - oState.cx;
          var dy = oState.iy - oState.cy;

          if (
            Math.abs(dx) > oState.calibrateTrigger ||
            Math.abs(dy) > oState.calibrateTrigger
          ) {
            tryUpdateCalibration(0);
          }

          if (oState.isPortrait) {
            oState.mx = oState.canCalibrateX ? dy : oState.iy;
            oState.my = oState.canCalibrateY ? dx : oState.ix;
          } else {
            oState.mx = oState.canCalibrateX ? dx : oState.ix;
            oState.my = oState.canCalibrateY ? dy : oState.iy;
          }

          oState.dX = oState.mx - oState.aX;
          oState.dY = oState.my - oState.aY;

          oState.aX += oState.dX * oState.frictionX;
          oState.aY += oState.dY * oState.frictionY;
        }

        function listen() {
          var helloDeck = document.querySelector(".deck86-hello");

          var toggleIndex = 0;
          //var toggleArr = ['eng', 'chi', 'jp'];
          var toggleArr = ["eng", "chi"];
          var toggleTimer = 0;
          //hydration
          if (helloDeck.classList.contains("eng")) {
            toggleIndex = 0;
          }
          if (helloDeck.classList.contains("chi")) {
            toggleIndex = 1;
          }
          if (helloDeck.classList.contains("jp")) {
            toggleIndex = 2;
          }

          function changeLanguage() {
            helloDeck.classList.remove("chi");
            helloDeck.classList.remove("eng");
            helloDeck.classList.remove("jp");
            helloDeck.classList.remove("deck86-goin");
            // helloDeck.classList.add('deck86-hidden');

            toggleIndex++;
            toggleIndex = toggleIndex % toggleArr.length;
            helloDeck.classList.add(toggleArr[toggleIndex]);

            clearTimeout(toggleTimer);
            setTimeout(function () {
              helloDeck.classList.add("deck86-goin");
              helloDeck.classList.add("deck86-goin-less-delay");
              // helloDeck.classList.remove('deck86-hidden');

              toggleTimer = setTimeout(changeLanguage, 5000);
            }, 100);
          }
          toggleTimer = setTimeout(changeLanguage, 5000);
          helloDeck.addEventListener("click", changeLanguage);

          helloDeck.addEventListener("mousemove", function (evt) {
            state.pX = evt.clientX;
            state.pY = evt.clientY;

            state.cX = (state.pX / helloDeck.clientWidth) * 2 - 1.0;
            state.cY = (state.pY / helloDeck.clientHeight) * 2 - 1.0;
          });

          helloDeck.addEventListener("touchmove", function (evt) {
            tryUpdateCalibration(10);

            state.pX = evt.touches[0].clientX;
            state.pY = evt.touches[0].clientY;

            state.cX = (state.pX / helloDeck.clientWidth) * 2 - 1.0;
            state.cY = (state.pY / helloDeck.clientHeight) * 2 - 1.0;
          });

          function easing(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          }
          // function easing(t) { return t*t*t; }

          var scrollDownBtn = document.querySelector(
            ".deck86-scroll-down"
          );
          scrollDownBtn.addEventListener(
            "click",
            function () {
              var scrollTop = window.document.body.scrollTop;
              var hasScrolled = scrollTop > 0;

              var progress = 0;

              function scroll() {
                if (progress < 1) {
                  progress += 0.01683828168;
                  window.requestAnimationFrame(scroll);
                } else {
                  return;
                }
                var amount = 0;
                var target = window.innerHeight;
                if (hasScrolled) {
                  amount =
                    scrollTop + easing(progress) * (target - scrollTop);
                } else {
                  amount = easing(progress) * target;
                }

                window.scrollTo(0, amount + 10);
              }
              scroll();
            },
            true
          );

          window.addEventListener(
            "deviceorientation",
            function (evt) {
              evt.preventDefault();
              if (evt.beta !== null && evt.gamma !== null) {
                var oState = state._o;

                var x = (evt.beta || 0) / 30;
                var y = (evt.gamma || 0) / 30;

                var isPortrait = window.innerHeight > window.innerWidth;
                if (oState.isPortrait !== isPortrait) {
                  oState.isPortrait = isPortrait;
                  oState.canCalibrate = true;
                }

                // Set Calibration
                if (oState.canCalibrate) {
                  oState.canCalibrate = false;
                  oState.cx = x;
                  oState.cy = y;
                }

                // if (!isPortrait){
                //     return;
                // }
                oState.ix = x;
                oState.iy = y;
              }
            },
            true
          );

          //
          tryUpdateCalibration(state._o.calibrationDelay);
        }

        function animateEntrance() {
          var helloDeck = document.querySelector(".deck86-hello");
          // helloDeck.addEventListener('animationend', function(){
          //     fn();
          // });
          helloDeck.classList.add("deck86-goin");
        }

        function init() {
          var newRenderables = CONFIG.parallax.map(function (item) {
            item.domRef = document.querySelector("." + item.className);
            return item;
          });
          return newRenderables;
        }

        function clamp(val, min, max) {
          if (val > max) {
            return max;
          }
          if (val < min) {
            return min;
          }
          return val;
        }

        function getTransString(item) {
          var p = item.parallax;
          var cx = state.cX;
          var cy = state.cY;
          var ox = state._o.aX;
          var oy = state._o.aY;
          var str =
            "" +
            " perspective(100vmax)" +
            " translate3d(" +
            (p.x * cx + clamp(p.x * ox * 3.5, -10, 10) * 0.0).toFixed(
              3
            ) +
            "vmin, " +
            (p.y * cy).toFixed(3) +
            "vmin, " +
            "0.1px" +
            ") ";
          if (item.needRotate) {
            str += " translateZ(15vmin) scale(0.95)";
            str += " rotateY(" + p.x * cx * 5 + "deg)";
            str += " rotateX(" + -p.y * cy * 5 + "deg)";
          }

          return str;
        }

        function main() {
          var renderables = init();
          listen();
          let timer = 0
          function rAF() {
            timer = window.requestAnimationFrame(rAF);

            processOrientationValues();

            renderables.forEach(function (item) {
              item.domRef.style.transform = getTransString(item);
            });
          }
          window.addEventListener('clean-main-kv-deck', () => {
            cancelAnimationFrame(timer)
          })

          animateEntrance();
          window.requestAnimationFrame(rAF);
        }
        // window.addEventListener('DOMContentLoaded', main);
        main();
      })();

    return () => {
      window.dispatchEvent(new CustomEvent('clean-main-kv-deck', { detail: {} }))
    }
  })

  return (
    <>
      <style jsx>{`
        .deck86-pointer {
  cursor: pointer;
}

.deck86-hello {
  width: 100vw;
  height: calc(100vh - 50px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: black;
  overflow: hidden;
}

.deck86-hello-parallax {
  width: 100vmin;
  height: calc(100vh - 50px);
  position: relative;
  background-color: black;
}

.deck86-hello-items {
  transition: top 1s, left 1s, bottom 1s, right 1s, transform 0.1s;
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
}

.deck86-scroll-down {
  cursor: pointer;
  z-index: 11;
  width: 180px;
  bottom: 7vmin;
  left: calc(50vmin - 90px);
  font-family: proxima-nova, sans-serif;
  color: white;
  text-shadow: 1px 1px 5px #a7a7a7;
  font-size: 14px;
  line-height: 1rem;
  letter-spacing: 0px;
  /* font-weight: bold; */
  /* margin-bottom: 0px; */
  text-align: center;
}

@media (max-width: 39em) {
  .deck86-scroll-down {
    bottom: 27vmin;
  }
}

.scroll-down-arrow {
  height: 30px;
  position: relative;
  display: none;
}
.scroll-down-arrow svg {
  transform: translate(-23px, 27px) scale(0.15);
  stroke-width: 7px;
}

.scroll-down-arrow {
  display: block;
  animation-name: deck-down-arrow-animation;
  animation-duration: 0.5s;
  animation-iteration-count: 3;
  animation-delay: 4s;
  animation-fill-mode: both;
}

.scroll-down-word {
  animation-name: deck-down-in-animation;
  animation-duration: 1s;
  animation-timing-function: cubic-bezier(0.01, 0.8, 0.25, 0.98);
  animation-delay: 3s;
  animation-direction: normal;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}

.deck86-hello-bottom-1 {
  z-index: 11;
  background-position: bottom center;
  background-image: url("/86deck-main/002.png");
}

.deck86-hello-bottom-2 {
  z-index: 10;
  background-position: bottom center;
  background-image: url("/86deck-main/004.png");
}

.deck86-hello-bottom-3 {
  z-index: 10;
  background-position: bottom center;
  background-image: url("/86deck-main/001.png");
}

.deck86-hello-bottom-4 {
  z-index: 9;
  background-position: bottom center;
  background-image: url("/86deck-main/003.png");
}

.deck86-hello-center-1 {
  transform: perspective(100vmax);
  z-index: 8;
  background-position: bottom center;
  background-image: url("/86deck-main/005.png");
}

.deck86-hello-center-3 {
  transform: perspective(100vmax);
  z-index: 6;
  background-position: bottom center;
  background-image: url("/86deck-main/007_lion.png");
}

.deck86-hello-letter-h {
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/letter_h.png");
}

.deck86-hello-letter-e {
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/letter_e.png");
}

.deck86-hello-letter-l-1 {
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/letter_l.png");
}

.deck86-hello-letter-l-2 {
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/letter_l.png");
}

.deck86-hello-letter-o {
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/letter_o.png");
}

.deck86-hello-letter-fullstop {
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/letter_fullstop.png");
}

.deck86-hello-chi-nei {
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/chi_nei.png");
}

.deck86-hello-chi-ho {
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/chi_ho.png");
}

.deck86-hello-chi-gui-ho {
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/chi_gui-ho.png");
}

.deck86-hello-jp-or {
  display: none;
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/jp_or.png");
}

.deck86-hello-jp-ha {
  display: none;
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/jp_ha.png");
}

.deck86-hello-jp-yo {
  display: none;
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/jp_yo.png");
}

.deck86-hello-jp-u {
  display: none;
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/jp_u.png");
}

.deck86-hello-jp-exclamation {
  display: none;
  z-index: 7;
  background-position: center center;
  background-image: url("/86deck-main/jp_exclamation.png");
}

.deck86-hello-bottom-1 {
  bottom: 0vmin;
  left: -10vmin;
  width: 30vmin;
  height: 30vmin;
}

.deck86-hello-bottom-2 {
  bottom: 0vh;
  left: 0vmin;
  width: 30vmin;
  height: 30vmin;
}

.deck86-hello-bottom-3 {
  bottom: 0vh;
  right: -3vmin;
  width: 81vmin;
  height: 30vmin;
}

.deck86-hello-bottom-4 {
  bottom: 0vh;
  right: 31vmin;
  width: 30vmin;
  height: 30vmin;
}

.deck86-hello-center-1 {
  bottom: calc(8vmin * 0.8);
  left: calc(8.5vmin * 0.8);
  width: calc(49vmin * 0.8);
  height: calc(66vmin * 0.8);
}

.deck86-hello-center-3 {
  bottom: calc(8vmin * 0.8);
  right: calc(8vmin + 5vmin * 0.8);
  width: calc(64vmin * 0.8);
  height: calc(70vmin * 0.8);
}

@media (max-width: 500px) {
  .deck86-hello-center-1 {
    bottom: calc(8vmin * 0.8);
    left: calc(5.33vmin + 8.5vmin * 0.8);
    width: calc(49vmin * 0.8);
    height: calc(66vmin * 0.8);
  }
  .deck86-hello-center-3 {
    bottom: calc(8vmin * 0.8);
    right: calc(5.33vmin + 8vmin + 5vmin * 0.8);
    width: calc(64vmin * 0.8);
    height: calc(70vmin * 0.8);
  }
}

.eng .deck86-hello-letter-h {
  top: calc(8vh + 5vmin * 0.9);
  left: calc(4vmin + 7vmin * 0.9);
  width: calc(22.1vmin * 0.9);
  height: calc(70vmin * 0.9);
}

.eng .deck86-hello-letter-e {
  top: calc(8vh + 33.6vmin * 0.9);
  left: calc(4vmin + 8vmin * 0.9);
  width: calc(67.7vmin * 0.9);
  height: calc(19vmin * 0.9);
}

.eng .deck86-hello-letter-l-1 {
  top: calc(8vh + 27.8vmin * 0.9);
  left: calc(4vmin + 12.6vmin * 0.9);
  width: calc(90vmin * 0.9);
  height: calc(24vmin * 0.9);
}

.eng .deck86-hello-letter-l-2 {
  top: calc(8vh + 27.8vmin * 0.9);
  left: calc(4vmin + 20.4vmin * 0.9);
  width: calc(90vmin * 0.9);
  height: calc(24vmin * 0.9);
}

.eng .deck86-hello-letter-o {
  top: calc(8vh + 7.9vmin * 0.9);
  left: calc(4vmin + 70.4vmin * 0.9);
  width: calc(18.2vmin * 0.9);
  height: calc(70vmin * 0.9);
}

.eng .deck86-hello-letter-fullstop {
  top: calc(8vh + 45.4vmin * 0.9);
  left: calc(4vmin + 91.2vmin * 0.9);
  width: calc(6.1vmin * 0.9);
  height: calc(7.3vmin * 0.9);
}

.chi .deck86-hello-chi-nei {
  top: calc(8vh + 20.3vmin);
  left: calc(-20vmin + 41.4vmin);
  width: calc(24.5vmin);
  height: calc(24.5vmin);
}

.chi .deck86-hello-chi-ho {
  top: calc(8vh + 20.3vmin);
  left: calc(-20vmin + 71.7vmin);
  width: calc(24.5vmin);
  height: calc(24.5vmin);
}

.chi .deck86-hello-chi-gui-ho {
  top: calc(8vh + 42.3vmin);
  left: calc(-20vmin + 97.7vmin);
  width: calc(5vmin);
  height: calc(5vmin);
}

.jp .deck86-hello-jp-or {
  top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
  left: calc(10vmin + (-44vmin + 41.4vmin) * 0.8);
  width: calc((24.5vmin) * 0.8);
  height: calc((24.5vmin) * 0.8);
}

.jp .deck86-hello-jp-ha {
  top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
  left: calc(10vmin + (-17vmin + 41.4vmin) * 0.8);
  width: calc((24.5vmin) * 0.8);
  height: calc((24.5vmin) * 0.8);
}

.jp .deck86-hello-jp-yo {
  top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
  left: calc(10vmin + (8vmin + 41.4vmin) * 0.8);
  width: calc((24.5vmin) * 0.8);
  height: calc((24.5vmin) * 0.8);
}

.jp .deck86-hello-jp-u {
  top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
  left: calc(10vmin + (30vmin + 41.4vmin) * 0.8);
  width: calc((24.5vmin) * 0.8);
  height: calc((24.5vmin) * 0.8);
}

.jp .deck86-hello-jp-exclamation {
  top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
  left: calc(10vmin + (45vmin + 41.4vmin) * 0.8);
  width: calc((24.5vmin) * 0.8);
  height: calc((24.5vmin) * 0.8);
}

.deck86-jp-words,
.deck86-chi-words,
.deck86-eng-words {
  display: none;
  opacity: 0;
  animation-duration: 1s;
  animation-timing-function: cubic-bezier(0.01, 0.8, 0.25, 0.98);
  animation-direction: normal;
  animation-iteration-count: 1;
  animation-fill-mode: both;
  animation-play-state: paused;
}

.deck86-goin .deck86-chi-words,
.deck86-goin .deck86-eng-words,
.deck86-goin .deck86-jp-words {
  display: block;
  animation-name: deck-goin-animation;
  animation-play-state: running;
}

.deck86-goin .deck86-hello-chi-nei {
  animation-delay: calc(0.3s + 0.7 * (1.5s + 0.5s * 0));
}

.deck86-goin .deck86-hello-chi-ho {
  animation-delay: calc(0.3s + 0.7 * (1.5s + 0.5s * 1));
}

.deck86-goin .deck86-hello-chi-gui-ho {
  animation-delay: calc(0.3s + 0.7 * (1.5s + 0.5s * 2));
}

.deck86-goin .deck86-hello-letter-h {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 0));
}

.deck86-goin .deck86-hello-letter-e {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 1));
}

.deck86-goin .deck86-hello-letter-l-1 {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 2));
}

.deck86-goin .deck86-hello-letter-l-2 {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 3));
}

.deck86-goin .deck86-hello-letter-o {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 4));
}

.deck86-goin .deck86-hello-letter-fullstop {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 5));
}

.deck86-goin .deck86-hello-jp-or {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 0));
}

.deck86-goin .deck86-hello-jp-ha {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 1));
}

.deck86-goin .deck86-hello-jp-yo {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 2));
}

.deck86-goin .deck86-hello-jp-u {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 3));
}

.deck86-goin .deck86-hello-jp-exclamation {
  animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 4));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-chi-nei {
  animation-delay: calc(0.25 * (0.5s * 0));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-chi-ho {
  animation-delay: calc(0.25 * (0.5s * 1));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-chi-gui-ho {
  animation-delay: calc(0.25 * (0.5s * 2));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-letter-h {
  animation-delay: calc(0.25 * (0.5s * 0));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-letter-e {
  animation-delay: calc(0.25 * (0.5s * 1));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-letter-l-1 {
  animation-delay: calc(0.25 * (0.5s * 2));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-letter-l-2 {
  animation-delay: calc(0.25 * (0.5s * 3));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-letter-o {
  animation-delay: calc(0.25 * (0.5s * 4));
}

.deck86-goin-less-delay.deck86-goin
  .deck86-hello-letter-fullstop {
  animation-delay: calc(0.25 * (0.5s * 5));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-jp-or {
  animation-delay: calc(0.25 * (0.5s * 0));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-jp-ha {
  animation-delay: calc(0.25 * (0.5s * 1));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-jp-yo {
  animation-delay: calc(0.25 * (0.5s * 2));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-jp-u {
  animation-delay: calc(0.25 * (0.5s * 3));
}

.deck86-goin-less-delay.deck86-goin .deck86-hello-jp-exclamation {
  animation-delay: calc(0.25 * (0.5s * 4));
}

@keyframes deck-goin-animation {
  0% {
    transform: translate(10vmin, 0%);
    opacity: 0;
  }
  100% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
}

@keyframes deck-down-in-animation {
  0% {
    transform: translate(0, -3vmin);
    opacity: 0;
  }
  100% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
}

@keyframes deck-down-arrow-animation {
  0% {
    transform: translate(0, -3vmin);
    opacity: 0;
  }
  100% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
}.deck86-pointer {
                cursor: pointer;
              }

              .deck86-hello {
                width: 100vw;
                height: calc(100vh - 50px);
                display: flex;
                justify-content: center;
                align-items: flex-start;
                background-color: black;
                overflow: hidden;
              }

              .deck86-hello-parallax {
                width: 100vmin;
                height: calc(100vh - 50px);
                position: relative;
                background-color: black;
              }

              .deck86-hello-items {
                transition: top 1s, left 1s, bottom 1s, right 1s, transform 0.1s;
                position: absolute;
                background-size: contain;
                background-repeat: no-repeat;
              }

              .deck86-scroll-down {
                cursor: pointer;
                z-index: 11;
                width: 180px;
                bottom: 7vmin;
                left: calc(50vmin - 90px);
                font-family: proxima-nova, sans-serif;
                color: white;
                text-shadow: 1px 1px 5px #a7a7a7;
                font-size: 14px;
                line-height: 1rem;
                letter-spacing: 0px;
                /* font-weight: bold; */
                /* margin-bottom: 0px; */
                text-align: center;
              }

              @media (max-width: 39em) {
                .deck86-scroll-down {
                  bottom: 27vmin;
                }
              }

              .scroll-down-arrow {
                height: 30px;
                position: relative;
                display: none;
              }
              .scroll-down-arrow svg {
                transform: translate(-23px, 27px) scale(0.15);
                stroke-width: 7px;
              }

              .scroll-down-arrow {
                display: block;
                animation-name: deck-down-arrow-animation;
                animation-duration: 0.5s;
                animation-iteration-count: 3;
                animation-delay: 4s;
                animation-fill-mode: both;
              }

              .scroll-down-word {
                animation-name: deck-down-in-animation;
                animation-duration: 1s;
                animation-timing-function: cubic-bezier(0.01, 0.8, 0.25, 0.98);
                animation-delay: 3s;
                animation-direction: normal;
                animation-iteration-count: 1;
                animation-fill-mode: both;
              }

              .deck86-hello-bottom-1 {
                z-index: 11;
                background-position: bottom center;
                background-image: url("/86deck-main/002.png");
              }

              .deck86-hello-bottom-2 {
                z-index: 10;
                background-position: bottom center;
                background-image: url("/86deck-main/004.png");
              }

              .deck86-hello-bottom-3 {
                z-index: 10;
                background-position: bottom center;
                background-image: url("/86deck-main/001.png");
              }

              .deck86-hello-bottom-4 {
                z-index: 9;
                background-position: bottom center;
                background-image: url("/86deck-main/003.png");
              }

              .deck86-hello-center-1 {
                transform: perspective(100vmax);
                z-index: 8;
                background-position: bottom center;
                background-image: url("/86deck-main/005.png");
              }

              .deck86-hello-center-3 {
                transform: perspective(100vmax);
                z-index: 6;
                background-position: bottom center;
                background-image: url("/86deck-main/007_lion.png");
              }

              .deck86-hello-letter-h {
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/letter_h.png");
              }

              .deck86-hello-letter-e {
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/letter_e.png");
              }

              .deck86-hello-letter-l-1 {
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/letter_l.png");
              }

              .deck86-hello-letter-l-2 {
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/letter_l.png");
              }

              .deck86-hello-letter-o {
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/letter_o.png");
              }

              .deck86-hello-letter-fullstop {
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/letter_fullstop.png");
              }

              .deck86-hello-chi-nei {
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/chi_nei.png");
              }

              .deck86-hello-chi-ho {
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/chi_ho.png");
              }

              .deck86-hello-chi-gui-ho {
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/chi_gui-ho.png");
              }

              .deck86-hello-jp-or {
                display: none;
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/jp_or.png");
              }

              .deck86-hello-jp-ha {
                display: none;
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/jp_ha.png");
              }

              .deck86-hello-jp-yo {
                display: none;
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/jp_yo.png");
              }

              .deck86-hello-jp-u {
                display: none;
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/jp_u.png");
              }

              .deck86-hello-jp-exclamation {
                display: none;
                z-index: 7;
                background-position: center center;
                background-image: url("/86deck-main/jp_exclamation.png");
              }

              .deck86-hello-bottom-1 {
                bottom: 0vmin;
                left: -10vmin;
                width: 30vmin;
                height: 30vmin;
              }

              .deck86-hello-bottom-2 {
                bottom: 0vh;
                left: 0vmin;
                width: 30vmin;
                height: 30vmin;
              }

              .deck86-hello-bottom-3 {
                bottom: 0vh;
                right: -3vmin;
                width: 81vmin;
                height: 30vmin;
              }

              .deck86-hello-bottom-4 {
                bottom: 0vh;
                right: 31vmin;
                width: 30vmin;
                height: 30vmin;
              }

              .deck86-hello-center-1 {
                bottom: calc(8vmin * 0.8);
                left: calc(8.5vmin * 0.8);
                width: calc(49vmin * 0.8);
                height: calc(66vmin * 0.8);
              }

              .deck86-hello-center-3 {
                bottom: calc(8vmin * 0.8);
                right: calc(8vmin + 5vmin * 0.8);
                width: calc(64vmin * 0.8);
                height: calc(70vmin * 0.8);
              }

              @media (max-width: 500px) {
                .deck86-hello-center-1 {
                  bottom: calc(8vmin * 0.8);
                  left: calc(5.33vmin + 8.5vmin * 0.8);
                  width: calc(49vmin * 0.8);
                  height: calc(66vmin * 0.8);
                }
                .deck86-hello-center-3 {
                  bottom: calc(8vmin * 0.8);
                  right: calc(5.33vmin + 8vmin + 5vmin * 0.8);
                  width: calc(64vmin * 0.8);
                  height: calc(70vmin * 0.8);
                }
              }

              .eng .deck86-hello-letter-h {
                top: calc(8vh + 5vmin * 0.9);
                left: calc(4vmin + 7vmin * 0.9);
                width: calc(22.1vmin * 0.9);
                height: calc(70vmin * 0.9);
              }

              .eng .deck86-hello-letter-e {
                top: calc(8vh + 33.6vmin * 0.9);
                left: calc(4vmin + 8vmin * 0.9);
                width: calc(67.7vmin * 0.9);
                height: calc(19vmin * 0.9);
              }

              .eng .deck86-hello-letter-l-1 {
                top: calc(8vh + 27.8vmin * 0.9);
                left: calc(4vmin + 12.6vmin * 0.9);
                width: calc(90vmin * 0.9);
                height: calc(24vmin * 0.9);
              }

              .eng .deck86-hello-letter-l-2 {
                top: calc(8vh + 27.8vmin * 0.9);
                left: calc(4vmin + 20.4vmin * 0.9);
                width: calc(90vmin * 0.9);
                height: calc(24vmin * 0.9);
              }

              .eng .deck86-hello-letter-o {
                top: calc(8vh + 7.9vmin * 0.9);
                left: calc(4vmin + 70.4vmin * 0.9);
                width: calc(18.2vmin * 0.9);
                height: calc(70vmin * 0.9);
              }

              .eng .deck86-hello-letter-fullstop {
                top: calc(8vh + 45.4vmin * 0.9);
                left: calc(4vmin + 91.2vmin * 0.9);
                width: calc(6.1vmin * 0.9);
                height: calc(7.3vmin * 0.9);
              }

              .chi .deck86-hello-chi-nei {
                top: calc(8vh + 20.3vmin);
                left: calc(-20vmin + 41.4vmin);
                width: calc(24.5vmin);
                height: calc(24.5vmin);
              }

              .chi .deck86-hello-chi-ho {
                top: calc(8vh + 20.3vmin);
                left: calc(-20vmin + 71.7vmin);
                width: calc(24.5vmin);
                height: calc(24.5vmin);
              }

              .chi .deck86-hello-chi-gui-ho {
                top: calc(8vh + 42.3vmin);
                left: calc(-20vmin + 97.7vmin);
                width: calc(5vmin);
                height: calc(5vmin);
              }

              .jp .deck86-hello-jp-or {
                top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
                left: calc(10vmin + (-44vmin + 41.4vmin) * 0.8);
                width: calc((24.5vmin) * 0.8);
                height: calc((24.5vmin) * 0.8);
              }

              .jp .deck86-hello-jp-ha {
                top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
                left: calc(10vmin + (-17vmin + 41.4vmin) * 0.8);
                width: calc((24.5vmin) * 0.8);
                height: calc((24.5vmin) * 0.8);
              }

              .jp .deck86-hello-jp-yo {
                top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
                left: calc(10vmin + (8vmin + 41.4vmin) * 0.8);
                width: calc((24.5vmin) * 0.8);
                height: calc((24.5vmin) * 0.8);
              }

              .jp .deck86-hello-jp-u {
                top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
                left: calc(10vmin + (30vmin + 41.4vmin) * 0.8);
                width: calc((24.5vmin) * 0.8);
                height: calc((24.5vmin) * 0.8);
              }

              .jp .deck86-hello-jp-exclamation {
                top: calc(10vmin + (8vh + 20.3vmin) * 0.8);
                left: calc(10vmin + (45vmin + 41.4vmin) * 0.8);
                width: calc((24.5vmin) * 0.8);
                height: calc((24.5vmin) * 0.8);
              }

              .deck86-jp-words,
              .deck86-chi-words,
              .deck86-eng-words {
                display: none;
                opacity: 0;
                animation-duration: 1s;
                animation-timing-function: cubic-bezier(0.01, 0.8, 0.25, 0.98);
                animation-direction: normal;
                animation-iteration-count: 1;
                animation-fill-mode: both;
                animation-play-state: paused;
              }

              .deck86-goin .deck86-chi-words,
              .deck86-goin .deck86-eng-words,
              .deck86-goin .deck86-jp-words {
                display: block;
                animation-name: deck-goin-animation;
                animation-play-state: running;
              }

              .deck86-goin .deck86-hello-chi-nei {
                animation-delay: calc(0.3s + 0.7 * (1.5s + 0.5s * 0));
              }

              .deck86-goin .deck86-hello-chi-ho {
                animation-delay: calc(0.3s + 0.7 * (1.5s + 0.5s * 1));
              }

              .deck86-goin .deck86-hello-chi-gui-ho {
                animation-delay: calc(0.3s + 0.7 * (1.5s + 0.5s * 2));
              }

              .deck86-goin .deck86-hello-letter-h {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 0));
              }

              .deck86-goin .deck86-hello-letter-e {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 1));
              }

              .deck86-goin .deck86-hello-letter-l-1 {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 2));
              }

              .deck86-goin .deck86-hello-letter-l-2 {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 3));
              }

              .deck86-goin .deck86-hello-letter-o {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 4));
              }

              .deck86-goin .deck86-hello-letter-fullstop {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 5));
              }

              .deck86-goin .deck86-hello-jp-or {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 0));
              }

              .deck86-goin .deck86-hello-jp-ha {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 1));
              }

              .deck86-goin .deck86-hello-jp-yo {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 2));
              }

              .deck86-goin .deck86-hello-jp-u {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 3));
              }

              .deck86-goin .deck86-hello-jp-exclamation {
                animation-delay: calc(0.3s + 0.25 * (1.5s + 0.5s * 4));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-chi-nei {
                animation-delay: calc(0.25 * (0.5s * 0));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-chi-ho {
                animation-delay: calc(0.25 * (0.5s * 1));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-chi-gui-ho {
                animation-delay: calc(0.25 * (0.5s * 2));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-letter-h {
                animation-delay: calc(0.25 * (0.5s * 0));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-letter-e {
                animation-delay: calc(0.25 * (0.5s * 1));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-letter-l-1 {
                animation-delay: calc(0.25 * (0.5s * 2));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-letter-l-2 {
                animation-delay: calc(0.25 * (0.5s * 3));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-letter-o {
                animation-delay: calc(0.25 * (0.5s * 4));
              }

              .deck86-goin-less-delay.deck86-goin
                .deck86-hello-letter-fullstop {
                animation-delay: calc(0.25 * (0.5s * 5));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-jp-or {
                animation-delay: calc(0.25 * (0.5s * 0));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-jp-ha {
                animation-delay: calc(0.25 * (0.5s * 1));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-jp-yo {
                animation-delay: calc(0.25 * (0.5s * 2));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-jp-u {
                animation-delay: calc(0.25 * (0.5s * 3));
              }

              .deck86-goin-less-delay.deck86-goin .deck86-hello-jp-exclamation {
                animation-delay: calc(0.25 * (0.5s * 4));
              }

              @keyframes deck-goin-animation {
                0% {
                  transform: translate(10vmin, 0%);
                  opacity: 0;
                }
                100% {
                  transform: translate(0%, 0%);
                  opacity: 1;
                }
              }

              @keyframes deck-down-in-animation {
                0% {
                  transform: translate(0, -3vmin);
                  opacity: 0;
                }
                100% {
                  transform: translate(0%, 0%);
                  opacity: 1;
                }
              }

              @keyframes deck-down-arrow-animation {
                0% {
                  transform: translate(0, -3vmin);
                  opacity: 0;
                }
                100% {
                  transform: translate(0%, 0%);
                  opacity: 1;
                }
              }
      `}
      </style>
      {/* <!-- 中文 class寫 chi -->
      <!-- 英文 class寫 eng --> */}
      <div className="deck86-hello eng eng-scroll-down">
              <div className="deck86-hello-parallax">
                <div className="deck86-hello-items deck86-hello-bottom-1"></div>
                <div className="deck86-hello-items deck86-hello-bottom-2"></div>
                <div className="deck86-hello-items deck86-hello-bottom-3"></div>
                <div className="deck86-hello-items deck86-hello-bottom-4"></div>

                <div className="deck86-hello-items deck86-hello-center-1"></div>
                {/* <div className="deck86-hello-items deck86-hello-center-2"></div> */}
                <div className="deck86-hello-items deck86-hello-center-3"></div>

                <div className="deck86-pointer">
                  <div
                    className="deck86-eng-words deck86-hello-items deck86-hello-letter-h"
                  ></div>
                  <div
                    className="deck86-eng-words deck86-hello-items deck86-hello-letter-e"
                  ></div>
                  <div
                    className="deck86-eng-words deck86-hello-items deck86-hello-letter-l-1"
                  ></div>
                  <div
                    className="deck86-eng-words deck86-hello-items deck86-hello-letter-l-2"
                  ></div>
                  <div
                    className="deck86-eng-words deck86-hello-items deck86-hello-letter-o"
                  ></div>
                  <div
                    className="deck86-eng-words deck86-hello-items deck86-hello-letter-fullstop"
                  ></div>

                  <div
                    className="deck86-chi-words deck86-hello-items deck86-hello-chi-nei"
                  ></div>
                  <div
                    className="deck86-chi-words deck86-hello-items deck86-hello-chi-ho"
                  ></div>
                  <div
                    className="deck86-chi-words deck86-hello-items deck86-hello-chi-gui-ho"
                  ></div>

                  <div
                    className="deck86-jp-words deck86-hello-items deck86-hello-jp-or"
                  ></div>
                  <div
                    className="deck86-jp-words deck86-hello-items deck86-hello-jp-ha"
                  ></div>
                  <div
                    className="deck86-jp-words deck86-hello-items deck86-hello-jp-yo"
                  ></div>
                  <div
                    className="deck86-jp-words deck86-hello-items deck86-hello-jp-u"
                  ></div>
                  <div
                    className="deck86-jp-words deck86-hello-items deck86-hello-jp-exclamation"
                  ></div>
                </div>

                <div className="deck86-hello-items deck86-scroll-down">
                  <div className="scroll-down-arrow">
                    <svg
                      width="221"
                      height="72"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path
                          stroke="white"
                          id="svg_9"
                          d="m5.95198,8.00467c1.10381,0.41871 104.14477,53.99114 104.02573,53.99114c-0.11904,0 101.149,-53.19388 102.97427,-53.99114"
                          fillOpacity="null"
                          strokeOpacity="null"
                          fill="none"
                        ></path>
                      </g>
                    </svg>
                  </div>

                  <div className="scroll-down-word">Scroll Down</div>
                </div>
              </div>
            </div>
    </>
  )
}