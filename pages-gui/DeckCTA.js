import { useEffect } from "react"

export function  DeckCTA () {

  useEffect(() => {
    (function () {
      //abc

      function makeRenderables() {
        var decks = document.querySelectorAll(".deck");

        var i = 0;
        var n = decks.length;
        var renderable;
        var bucket = [];
        for (i = 0; i < n; i++) {
          renderable = {
            deck: decks[i],
            rect: decks[i].getBoundingClientRect()
          };
          bucket.push(renderable);
        }
        return bucket;
      }

      function clamp(val, min, max) {
        if (val < min) {
          return min;
        }
        if (val > max) {
          return max;
        }
        return val;
      }

      function main() {
        var deckText = document.querySelector(".deck-text");
        var deckContainer = document.querySelector(".deck-wrapper");

        var state = {
          x: deckContainer.clientWidth / 2,
          y: deckContainer.clientHeight / 2,

          animated: false,

          geoUpdateTimer: 0,

          deckTextHeight: deckText.clientHeight
        };
        var renderables = makeRenderables();

        var cube = document.querySelector(".btn-cube");

        cube.addEventListener("mouseenter", function () {
          cube.classList.toggle("show-bottom");
        });
        cube.addEventListener("mouseleave", function () {
          cube.classList.toggle("show-bottom");
        });
        cube.addEventListener("touchstart", function () {
          cube.classList.toggle("show-bottom");
        });

        cube.addEventListener("click", function () {
          // window.location.assign("http://86deck.com/work/");
        });

        function render(item, key) {
          var wW = window.innerWidth;
          var wH = window.innerHeight;

          var h = item.rect.height;
          var w = item.rect.width;

          var hH = item.rect.height / 2;
          var hW = item.rect.width / 2;
          var top = item.rect.top;
          var left = item.rect.left;
          var cX = left + hW;
          var cY = top + hH;

          var mX = state.x;
          var mY = state.y;

          var dX = mX - cX;
          var dY = mY - cY;

          var distance = Math.sqrt(dX * dX + dY * dY);
          var diagonal = Math.sqrt(w * w + h * h) * 0.75;

          var opacity = clamp(1 - distance / diagonal - 0.2, 0, 1).toFixed(3);
          item.deck.style.opacity = opacity;
        }

        var renderText = function () {
          var factor = 2.5;
          deckText.style.transform =
            "perspective(100vmax) rotateY(" +
            (factor * state.x) / window.innerWidth +
            "deg) rotateX(" +
            (-state.y / state.deckTextHeight) * factor +
            "deg)  translateZ(10vmin)";
        };

        var update = function () {
          // renderText();

          renderables.forEach(render);
          window.requestAnimationFrame(update);
        };

        var kickStart = function () {
          if (!state.animated) {
            state.animated = true;

            var deckRow = document.querySelector(".deck-row");
            deckRow.addEventListener(
              "animationend",
              function () {
                updateGeo();

                window.requestAnimationFrame(update);
              },
              false
            );

            setTimeout(function () {
              deckContainer.classList.add("animated");
            }, 500);
          }
        };

        function updateGeo() {
          renderables = makeRenderables();
        }

        window.addEventListener("resize", function () {
          clearTimeout(state.geoUpdateTimer);
          state.geoUpdateTimer = setTimeout(updateGeo, 1000);
        });
        let stoprun = false
        function onScroll() {
          if (stoprun) {
            return
          }

          var rect = deckContainer.getBoundingClientRect();
          var elemTop = rect.top;
          var elemBottom = rect.bottom;

          // console.log(rect);

          // var isInView = (elemTop >= 0);// && (elemBottom <= window.innerHeight);
          var isInView = elemBottom <= window.innerHeight; // && (elemBottom <= window.innerHeight);

          isInView = true;
          if (!state.animated && isInView) {
            kickStart();
          }

          //
          clearTimeout(state.geoUpdateTimer);
          state.geoUpdateTimer = setTimeout(updateGeo, 2000);
        }

        setTimeout(onScroll, 500);

        window.addEventListener("scroll", onScroll);

        window.addEventListener('clean-cta-deck', () => {
          stoprun = true
        })

        deckContainer.addEventListener(
          "mousemove",
          function (evt) {
            state.x = evt.clientX;
            state.y = evt.clientY;
          },
          false
        );
        deckContainer.addEventListener(
          "touchmove",
          function (evt) {
            //   evt.preventDefault();

            state.x = evt.touches[0].clientX;
            state.y = evt.touches[0].clientY;
          },
          false
        );
      }

      main();
    })();

    return () => {
      window.dispatchEvent(new CustomEvent('clean-cta-deck', { detail: {} }))
    }
  })

  return (
    <>
      <style jsx>{`

      body {
    background-color: rgba(0, 0, 0, 0.1);
  }

  html,
  body,
  .deck-wrapper,
  .deck-wrapper * {
    margin: 0px;
    padding: 0px;
    -webkit-tap-highlight-color: transparent;
  }

  .deck-wrapper {
    background-color: white;
    height: 650px;
    width: 100vw;
    overflow: hidden;
    position: relative;
  }

  .deck-text {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 650px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .deck-text .deck-text-box {
    max-width: 750px;
  }

  .deck-text .deck-text-title {
    font-family: proxima-nova, sans-serif;
    font-size: 2.1rem;
    line-height: 5rem;
    letter-spacing: 0px;
    font-weight: bold;
    margin-bottom: 18px;
    text-align: center;
  }

  .deck-text .deck-text-desc {
    font-family: proxima-nova, sans-serif;
    font-size: 1.2rem;
    line-height: 2.2rem;
    letter-spacing: 0px;
    font-weight: 300;
    margin-bottom: 18px;
    text-align: center;
  }

  .decks {
    transform: perspective(100vmax) translateY(-15%) rotateX(45deg)
      rotateZ(45deg) translateY(-10%);
    width: 100vw;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .decks {
    transition: height 0.1s;
  }
  .decks {
    opacity: 0;
  }
  .animated .decks {
    opacity: 1;
  }

  .deck-row {
    width: 500vmin;
    height: 15vmin;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    margin: 0vmin 0vmin;
  }

  .deck {
    background-color: white;
    transition: opacity 0.5s;
    will-change: opacity;
    transform: translateZ(1px);

    margin: 0vmin 0vmin;

    width: 68vmin;
    height: 15vmin;
    border: #cac9c9 solid 1px;
  }

  .animated .deck-row:nth-child(2n + 1) {
    animation: row100 2.3s 0s 1 normal forwards;
  }
  .animated .deck-row:nth-child(2n) {
    animation: row101 2.3s 0s 1 normal forwards;
  }

  @keyframes row101 {
    0% {
      transform: translate(-450vmin);
    }
    100% {
      transform: translate(-50vmin);
    }
  }
  @keyframes row100 {
    0% {
      transform: translate(400vmin);
    }
    100% {
      transform: translate(0vmin);
    }
  }

  @media (max-width: 500px) {
    .deck-text {
      height: 650px;
    }
    .deck-wrapper {
      height: 650px;
    }
  }

  .deck-btn,
  .deck-btn-group,
  .deck-btn-a,
  .deck-btn-b {
    width: 173px;
    height: 52px;
  }

  .deck-btn-group {
    position: relative;

    background-color: white;

    cursor: pointer;
    transform-style: flat;
    perspective: 1000px;
  }
  .deck-btn-a,
  .deck-btn-b {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: proxima-nova, sans-serif;
    font-size: 1.5rem;
    line-height: 3.6rem;
    letter-spacing: 0px;
    font-weight: 300;
    margin-bottom: 18px;
    text-align: center;

    transition: transform 1.3s cubic-bezier(0.01, 0.8, 0.25, 0.98), opacity 1.3s;
  }

  .btn-cube-con {
    cursor: pointer;
    opacity: 0;
  }

  .animated .btn-cube-con {
    opacity: 1;
    animation-name: intro-btn;
    animation-duration: 1s; /* or: Xms */
    animation-iteration-count: 1;
    animation-direction: normal; /* alternate or: normal */
    animation-timing-function: ease; /* or: ease, ease-in, ease-in-out, linear, cubic-bezier(x1, y1, x2, y2) */
    animation-fill-mode: both; /* or: forwards, backwards, both, none */
    animation-delay: 3.2s; /* or: Xms */
  }

  @keyframes intro-btn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .btn-cube-con {
    width: 168px;
    height: 68px;
    position: relative;
    perspective: 1000px;
  }

  .btn-cube {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .obj-face {
    font-family: proxima-nova, sans-serif;
    margin: 0;
    width: 196px;
    height: 196px;

    display: block;

    position: absolute;
    border: silver solid 1px;

    background-color: rgba(255, 255, 0, 0.2);

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 0px;
    left: 0px;

    backface-visibility: hidden;
  }

  .btn-cube .obj-front {
    transform: rotateY(0deg) translateZ(26.5px);
  }
  .btn-cube .obj-back {
    transform: rotateX(180deg) translateZ(26.5px);
  }
  .btn-cube .obj-right {
    transform: rotateY(90deg) translateZ(26.5px);
  }
  .btn-cube .obj-left {
    transform: rotateY(-90deg) translateZ(26.5px);
  }
  .btn-cube .obj-top {
    transform: rotateX(90deg) translateZ(26.5px);
  }
  .btn-cube .obj-bottom {
    transform: rotateX(-91deg) translateZ(26.5px);
  }

  .btn-cube {
    transition: transform 1.386s cubic-bezier(0.01, 0.8, 0.25, 0.98);
  }
  .btn-cube.show-front {
    transform: rotateY(0deg);
  }
  .btn-cube.show-back {
    transform: rotateX(-180deg);
  }
  .btn-cube.show-right {
    transform: rotateY(-90deg);
  }
  .btn-cube.show-left {
    transform: rotateY(90deg);
  }
  .btn-cube.show-top {
    transform: rotateX(-90deg);
  }
  .btn-cube.show-bottom {
    transform: rotateX(90deg);
  }

  figure.hidden {
    display: none !important;
  }

  .obj-top,
  .obj-bottom,
  .obj-front,
  .obj-left {
    width: 169px;
    height: 53px;
  }

  .obj-front {
    color: white;
    background-color: black;
  }
  .obj-bottom {
    color: black;
    background-color: white;
  }
      `}</style>

<div className="deck-wrapper">
  <div className="decks">
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck" id="target"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
    <div className="deck-row">
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
      <div className="deck"></div>
    </div>
  </div>

  <div className="deck-text">
    <div className="deck-text-box">
      <div className="deck-text-title">We design.</div>
      <div className="deck-text-desc">
        We deliver creative design solutions – from concept, design to
        production for companies of all sizes. Our purpose is to enrich visual
        communication through meaningful design and management.
      </div>
    </div>

    <div className="btn-cube-con">
      <div className="btn-cube">
        <figure className="obj-face obj-front">
          Our Work
        </figure>

        <figure className="hidden obj-face obj-back"></figure>
        <figure className="hidden obj-face obj-right"></figure>
        <figure className="hidden obj-face obj-left"></figure>
        <figure className="hidden obj-face obj-top"></figure>

        <figure className="obj-face obj-bottom">
          Let's Go!
        </figure>
      </div>
    </div>
  </div>
</div>
    </>
  )
}