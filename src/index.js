var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')

css('ress')
css('gr8')

css`
  html {
    font-size: 62.5%;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Arial, Helvetica, sans-serif;
  }

  h1, h2, h3, h4, h5, h6, h7 {
    font-size: inherit;
    font-weight: inherit;
    font-style: inherit;
  }

  button, input {
    outline: none;
  }

  ul, ol, li { 
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  img, video {
    width: 100%;
    height: auto;
  }

  .bb1-white {
    border-bottom: 1px solid white;
  }

  /*.rows > * {
    border-top: 1px dashed black;
  }

  .rows > *:last-child {
    border-bottom: 1px dashed black;
  }*/

  a:hover {
    display: inline-block;
    transform: rotateY(180deg);
  }

  .external {
    position: relative;
  }
  .external:after {
    content: ' ➚';
    display: block;
    position: absolute;
    right: -1em;
    top: 0;
    pointer-events: none;
  }
`

var app = choo()

app.use(function () {
  // ios vh hack
  var navigator = window.navigator
  var isios = (function detect_iOS (userAgent) {
    return /iPad|iPhone|iPod/.test(userAgent)
  })(navigator ? navigator.userAgent : '')
  var style = html`<style></style>`
  if (el && isios) {
    style.innerHTML = `.vhmn100{min-height:${window.innerHeight}px}`
  }
  document.head.appendChild(style)
})

function mainview () {
  return html`
    <body class="x xjc xac xdc vhmn100 p1 fs2-4 tac rows psr" sm="fs3-2">
      <h1 class="p1 s1">
        monoequipment
      </h1>
      <p class="p1 s1">
        opinionated <a href="https://github.com/choojs/nanocomponent" target="_blank">nanocomponents</a> for websites
      </p>
      <ul class="p1 s1">
        <li><a class="external" target="_blank" href="https://github.com/jongacnik/monolazy">monolazy</a></li>
        <li><a class="external" target="_blank" href="https://github.com/jongacnik/monoimage">monoimage</a></li>
        <li><a class="external" target="_blank" href="https://github.com/jongacnik/monocontextual">monocontextual</a></li>
      </ul>
      <p class="p1 s1">
        more soon
      </p>
    </body>
  `
}

app.route('/', mainview)

app.mount('body')