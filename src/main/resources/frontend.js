if (window.location.href.indexOf("noQuestion") >= 0) {
  acceptLicense()
} else {
  showLicense()
}

var backend = new tajniacy.backend.TajniacyBackend(getWords())
initNextBoard()

function initCards() {
  var cardsElem = document.querySelector("#cards")
  cardsElem.innerHTML = ''
  var cards = getCards()
  for (var i = 0; i < cards.length; i++) {
    var input = document.createElement("input")
    input.classList.add("card")
    input.setAttribute("type", "button")
    input.setAttribute("value", cards[i].word)
    input.setAttribute("cardIndex", i)
    input.setAttribute("cardVisible", isAdvicing())
    if (isAdvicing()) {
      input.classList.add("advicing")
    }
    if (isGuessing()) {
      input.classList.add("guessing")
    }
    input.onclick = cardOnClick
    cardsElem.appendChild(input)
  }
  refreshCardClasses()
  updateScore()
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

function isAdvicing() {
  return document.querySelector("#advicing").checked
}

function isGuessing() {
  return document.querySelector("#guessing").checked
}

function cardOnClick(a, b, c) {
  //console.log("clicked card " + a.toElement.getAttribute("cardIndex"))
  a.toElement.setAttribute("cardVisible", "true")
  refreshCardClasses()
  updateScore()
}

function initNextBoard() {
  window.board = backend.nextBoard()
  document.querySelector("#boardSeed").textContent = window.board.seed
  initCards(window.board)
}
