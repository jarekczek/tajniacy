function initCards() {
  var cardsElem = document.querySelector("#cards")
  cardsElem.innerHTML = ''
  var cardParent = null
  var cards = getCards()
  for (var i = 0; i < cards.length; i++) {
    if (i % 5 == 0)
      cardParent = createCardParent(cardsElem)
    var input = document.createElement("input")
    input.classList.add("card")
    input.setAttribute("type", "button")
    input.setAttribute("value", cards[i].word)
    input.setAttribute("cardIndex", i)
    input.setAttribute("cardVisible", isAdvising())
    if (isAdvising()) {
      input.classList.add("advising")
    }
    if (isGuessing()) {
      input.classList.add("guessing")
    }
    input.onclick = cardOnClick
    cardParent.appendChild(input)
  }
  refreshCardClasses()
  updateScore()
}

function createCardParent(cardsElem) {
  var div = document.createElement("div")
  div.classList.add("cardColumn")
  cardsElem.appendChild(div)
  return div
}

function showLicense() {
  document.querySelector("#licenseQuestion").classList.remove("invisible")
}

function reject() {
  document.querySelector("#reject").classList.remove("invisible")
  document.querySelector("#licenseQuestion").classList.add("invisible")
}

function acceptLicense() {
  document.querySelector("#licenseQuestion").classList.add("invisible")
  document.querySelector("#game").classList.remove("invisible")
}

function refreshCardClasses() {
  var cards = getCards()
  document.querySelectorAll(".card").forEach( (cardElem) => {
    var i = cardElem.getAttribute("cardIndex")
    if (cardElem.getAttribute("cardVisible") == "true") {
      //console.log("updating class of card " + i + " to " + cards[i].type)
      cardElem.classList.add(("" + cards[i].type).toLowerCase())
      //console.log("current classes: " + cardElem.classList)
    }
    if (cardElem.getAttribute("cardClicked") == "true") {
      cardElem.classList.add("clicked")
    }
  })
}

function updateScore() {
  document.querySelector("#score").classList.remove("invisible")
  var cards = getCards()
  var scores = { RED: 0, BLUE: 0 }
  document.querySelectorAll(".card").forEach( (cardElem) => {
    var i = cardElem.getAttribute("cardIndex")
    var type = cards[i].type
    if (cardElem.getAttribute("cardVisible") == "true" && type in scores) {
      scores[type]++
    }
  })
  var redScoreToDisplay = "? / "
  var blueScoreToDisplay = "? / "
  if (isGuessing()) {
    redScoreToDisplay = scores['RED'] + " / "
    blueScoreToDisplay = scores['BLUE'] + " / "
  }
  document.querySelector("#scoreRed").value = redScoreToDisplay + window.board.redCardCount
  document.querySelector("#scoreBlue").value = blueScoreToDisplay + window.board.blueCardCount
}

function getCards() {
  return board.cards
}

function isAdvising() {
  return document.querySelector("#advising").checked
}

function isGuessing() {
  return document.querySelector("#guessing").checked
}

function cardOnClick(a, b, c) {
  //console.log("clicked card " + a.toElement.getAttribute("cardIndex"))
  a.toElement.setAttribute("cardVisible", "true")
  a.toElement.setAttribute("cardClicked", "true")
  refreshCardClasses()
  updateScore()
}

function initNextBoard(side, boardNumber) {
  if (side == 'guessing') {
    document.querySelector("#guessing").checked = true
  } else {
    document.querySelector("#advising").checked = true
  }
  window.board = backend.nextBoard(boardNumber)
  document.querySelector("#boardSeed").textContent = window.board.seed
  initCards(window.board)
  if (window.boardTimer == undefined) {
    window.boardTimer = new Timer("time")
  }
  timerStart(120000)
}

class Timer {
  constructor(valueId) {
    this.valueId = valueId
  }

  start(millis) {
    window.clearTimeout(this.timeout)
    this.alarmStartTime = Date.now()
    this.alarmTime = Date.now() + millis
    this.updateDisplay()
    this.timeoutCallback()
  }

  timeoutCallback() {
    this.updateDisplay()
    var millisRemaining = (this.alarmTime - Date.now())
    if (millisRemaining >= 0) {
      this.timeout = window.setTimeout(this.timeoutCallback.bind(this), millisRemaining % 1000)
    }
  }

  updateDisplay() {
    var secondsRemaining = Math.round(Math.max(0, this.alarmTime - Date.now()) / 1000, 0)
    document.querySelector("#" + this.valueId).value = secondsRemaining
  }
}

function timerStart(millis) {
  window.boardTimer.start(millis)
}

// main
if (window.location.href.indexOf("noQuestion") >= 0) {
  acceptLicense()
} else {
  showLicense()
}

var backend = new tajniacy.backend.TajniacyBackend(getWords())
if (window.location.href.indexOf("board=") >= 0) {
  var boardNumber = parseInt(window.location.href.match(/board=([0-9]+)/)[1])
  initNextBoard('guessing', boardNumber)
} else {
  initNextBoard('guessing')
}