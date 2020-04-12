package backend

import kotlin.random.Random

public class TajniacyBackend(val words: Array<String>) {
  var seed = 0

  init {
    println("creating TajniacyBackend")
  }

  fun main(args: Array<String>) {
    println("hello")
    console.log("hi")
  }

  fun nextBoard() = Board(++seed, words)

}