package backend

import kotlin.random.Random

class Board(val seed: Int, val words: Array<String>) {
  val cardCount = 6
  val teamCardCount = 1
  val deathCardCount = 1
  val random = Random(seed)
  var startingSide = if (random.nextBoolean()) CardType.RED else CardType.BLUE
  var redCardCount = teamCardCount + (if (startingSide == CardType.RED) 1 else 0)
  var blueCardCount = teamCardCount + (if (startingSide == CardType.BLUE) 1 else 0)
  var cards = generateCards()

  fun generateCards(): Array<Card> {
    val selectedWords = words.asList().shuffled(random).subList(0, cardCount)
    val wordsSequence = selectedWords.shuffled(random).iterator()
    val cards = selectedWords.map { Card(it) }.toTypedArray()
    markCardsWithType(deathCardCount, CardType.DEATH, cards, wordsSequence)
    markCardsWithType(redCardCount, CardType.RED, cards, wordsSequence)
    markCardsWithType(blueCardCount, CardType.BLUE, cards, wordsSequence)
    return cards
  }

  private fun markCardsWithType(cardCount: Int, cardType: CardType, cards: Array<Card>, wordsSequence: Iterator<String>) {
    IntRange(1, cardCount).forEach {
      val nextWord = wordsSequence.next()
      cards
        .filter{ it.word.equals(nextWord) }
        .forEach { it.type = cardType }
    }
  }

}