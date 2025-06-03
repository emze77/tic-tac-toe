# Pseudocode

hier muss jede Logic rein: 

1. Gameboard-Factory mit Functionen: 
    1. Gameboard-Array
        * O auf Platz *n*
        * X auf Platz *n*
        * clear Board

2. Player-Factory mit Functionen:
    1. name
    2. score
        * create Player
        * winRound

3. Game-Factory:
    1. game-counter
    2. round-counter
    3. next-player
        * newGame
        * playRound
        * checkValidMove
        * checkGameEnd
        * switchPlayer

Reihenfolge: 

NEWGAME
1. Reinigen von Spielfeld & Spielständen
5. Zufällige Auswahl, wer beginnt.

PLAYROUND:
* Zug erster Spieler
    * Überprüfung ob valide
    * Überprüfung ob Spielende


Gewinn-Möglichkeiten: (1-9)
    * horizontal: 1 2 3, 4 5 6, 7 8 9
    * vertical: 1 4 7, 2 5 8 , 3 6 9
    * diagonal: 1 5 9, 7 5 3
