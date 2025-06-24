## Pseudocode

hier muss jede Logic rein:

Gameboard-Factory mit Functionen:

1.  Gameboard-Array
    *   O auf Platz _n_
    *   X auf Platz _n_
    *   clear Board

Player-Factory mit Functionen:

1.  name
2.  score
    *   create Player
    *   winRound

Game-Factory:

1.  game-counter
2.  round-counter
3.  next-player
    *   newGame
    *   playRound
    *   checkValidMove
    *   checkGameEnd
    *   switchPlayer

Reihenfolge:

NEWGAME

1.  INPUT press button to start new game
2.  Zufällige Auswahl, wer beginnt.

PLAYROUND:

*   SET gameProcess = true
*   click:
    *   SEQUENCE handle player move:
    *   VALIDATE turn
        *   IF valid turn
            *   SET field with player mark
            *   SET turn counter + 1
            *   SET next Players turn
            *   proceed to “Validate rounds end”
        *   ELSE
            *   WRITE error message
    *   VERIFY rounds end
        *   IF round end = true
            *   WRITE rounds end message (Dra
            *   SET round counter + 1
            *   RESET gameboard + turns
            *   IF NOT draw 
                *   SET winners score + 1
        *   ELSE
            *   (wait for next click)
    *   VERIFY game end
        *   IF game end = true
            *   WRITE winner message
            *   RESET board + scores + round
            *   SET gameProcess = false
        *   ELSE
            *   RESET board

Gewinn-Möglichkeiten: (1-9)

*   horizontal: 1 2 3, 4 5 6, 7 8 9
*   vertical: 1 4 7, 2 5 8 , 3 6 9
*   diagonal: 1 5 9, 7 5 3