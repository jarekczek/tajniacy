package backend

import kotlin.random.Random

public class TajniacyBackend(val words: Array<String>) {
  var seed = 0

  init {
    println("creating TajniacyBackend")
  }

  @JsName("nextBoard")
  fun nextBoard(boardNumber: Int?): Board {
    if (boardNumber != null) {
      seed = boardNumber
    } else {
      seed++
    }
    return Board(seed, words)
  }
}
