// ___QUERY SELECTORS___

const qs = {
  player1: document.querySelector("#namePlayer1"),
  scorePlayer1: document.querySelector("#scorePlayer1"),
  player2: document.querySelector("#namePlayer2"),
  scorePlayer2: document.querySelector("#scorePlayer2"),
  nextTurntext: document.querySelector("#nextTurntext"),
  currentRound: document.querySelector("#currentRound"),
  fields: document.querySelectorAll(".field"),
};

// ___GAMEBOARD (IIFE-MODULE)___

const gameboard = (function () {
  let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const placePlayerOne = (field) =>
    board.splice(field - 1, 1, game.checkPlayerOne().checkSymbol());
  const placePlayerTwo = (field) =>
    board.splice(field - 1, 1, game.checkPlayerTwo().checkSymbol());
  const clearBoard = () => (board = [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const checkBoard = () => board;
  // const logGameboard = () => renderConsole.board(board);
  const checkField = (field) => board[field];
  return {
    checkField,
    checkBoard,
    placePlayerOne,
    placePlayerTwo,
    clearBoard,
  };
})();

// ___PLAYER___

function createPlayer(name, symbol) {
  const playerName = name;
  let playerSymbol = symbol;
  let score = 0;

  const checkName = () => playerName;
  const checkSymbol = () => playerSymbol;
  const checkScore = () => score;
  const winRound = () => score++;

  return { checkName, checkSymbol, checkScore, winRound };
}

// ___GAME-LOGIC (IIFE-Module)____

const game = (function () {
  const consoleMode = false;

  let roundsTotal = 3;
  let roundCounter = 0;
  let turnCounter = 0;
  let roundEnd = false;
  let draw = false;

  let playerOne = createPlayer("Alice", "X");
  let playerTwo = createPlayer("Bob", "O");
  let turnPlayerOne = true;

  const newGame = () => {
    resetGame();
    randomStartPlayer();
    consoleMode ? renderConsole.board() : screenController.updateScreen();

    do {
      playRound();
    } while (roundsTotal > roundCounter);

    handleGameEnd();
  };

  const playRound = () => {
    do {
      playTurn();
      renderConsole.board();
      verifyRoundEnd();
      turnPlayerOne = !turnPlayerOne;
    } while (!roundEnd);

    promotingWinner();
    resetRound();

    addRound();
    renderConsole.score();
    renderConsole.roundsLeft();
  };

  const playTurn = () => {
    let nextPlayer = turnPlayerOne ? playerOne : playerTwo;

    if (consoleMode) {
      renderConsole.callout(
        `Next turn: ${nextPlayer.checkName()} (${nextPlayer.checkSymbol()})!`
      );
    } else {
      screenController.updateScreen();
    }

    let nextTurn;

    if (consoleMode) {
      do {
        nextTurn = prompt("What`s your turn? (1 - 9)");
      } while (!verifyTurn(nextTurn));
    } else {
      do {
        nextTurn = screenController.clickHandlerBoard();
      } while (!verifyTurn(nextTurn));
    }

    turnPlayerOne
      ? gameboard.placePlayerOne(nextTurn)
      : gameboard.placePlayerTwo(nextTurn);
    turnCounter++;
  };

  const randomStartPlayer = () => {
    if (Math.random() < 0.5) {
      turnPlayerOne = true;
      renderConsole.callout(`${playerOne.checkName()} begins!`);
    } else {
      turnPlayerOne = false;
      renderConsole.callout(`${playerTwo.checkName()} begins!`);
    }
  };

  const verifyTurn = (field) => {
    if (
      gameboard.checkField(field - 1) === playerOne.checkSymbol() ||
      gameboard.checkField(field - 1) === playerTwo.checkSymbol()
    ) {
      renderConsole.callout("Field is already occupied!");
    } else if (field < 1 || field > 9 || field % 1 !== 0) {
      renderConsole.callout("Not a valid number!");
    } else if (isNaN(field)) {
      renderConsole.callout("Not a number at all!");
    } else {
      return true;
    }
  };

  const verifyRoundEnd = () => {
    let gc = gameboard.checkField;
    let csym = turnPlayerOne
      ? playerOne.checkSymbol()
      : playerTwo.checkSymbol();

    if (
      // horicontal winning oppertunities
      (csym === gc(0) && csym === gc(1) && csym === gc(2)) ||
      (csym === gc(3) && csym === gc(4) && csym === gc(5)) ||
      (csym === gc(6) && csym === gc(7) && csym === gc(8)) ||
      // vertical winning oppertunities
      (csym === gc(0) && csym === gc(3) && csym === gc(6)) ||
      (csym === gc(1) && csym === gc(4) && csym === gc(7)) ||
      (csym === gc(2) && csym === gc(5) && csym === gc(8)) ||
      // diagonal winning oppertunities
      (csym === gc(0) && csym === gc(4) && csym === gc(8)) ||
      (csym === gc(6) && csym === gc(4) && csym === gc(2))
    ) {
      renderConsole.callout("game ends!");
      roundEnd = true;
    } else if (turnCounter === 9) {
      renderConsole.callout("It's a draw!");
      roundEnd = true;
      draw = true;
    }
  };

  const promotingWinner = () => {
    if (!draw) {
      let winner = turnPlayerOne ? playerTwo : playerOne; // turn changes after verifyRoundEnd
      winner.winRound();
      renderConsole.callout(`${winner.checkName()} has won the round`);
    }
  };

  const resetRound = () => {
    gameboard.clearBoard();
    roundEnd = false;
    turnCounter = 0;
  };

  const resetGame = () => {
    gameboard.clearBoard();
    playerOne.score = 0;
    playerTwo.score = 0;
    roundCounter = 0;
    turnCounter = 0;
  };

  const handleGameEnd = () => {
    console.log("Game is over");
  };

  const addRound = () => roundCounter++;
  const checkPlayerOne = () => playerOne;
  const checkPlayerTwo = () => playerTwo;
  const checkRoundCounter = () => roundCounter;
  const checkRoundsTotal = () => roundsTotal;

  return {
    checkPlayerOne,
    checkPlayerTwo,
    checkRoundCounter,
    checkRoundsTotal,
    newGame,
  };
})();

// ___RENDER IN WINDOW___

const screenController = (function () {
  const updateScreen = () => {
    //
  };

  const clickHandlerBoard = () => {
    qs.fields.forEach((item) => {
      item.addEventListener("click", () => {
        console.log("clicked: " + item.value);
        return item.value;
      });
    });
  };

  return {
    updateScreen,
    clickHandlerBoard,
  };
})();

// qs.fields.forEach((item) => {
//   item.addEventListener("click", () => {
//     console.log("clicked: " + item.value);
//     return item.value;
//   });
// });

// ___RENDER IN CONSOLE___

const renderConsole = (function () {
  const board = () => {
    const gcf = gameboard.checkField;
    console.log(
      "\n" + " " + gcf(0),
      gcf(1),
      gcf(2),
      "\n",
      gcf(3),
      gcf(4),
      gcf(5),
      "\n",
      gcf(6),
      gcf(7),
      gcf(8),
      "\n"
    );
  };

  const score = () => {
    console.log(
      `Score ${game.checkPlayerOne().checkName()}: ${game
        .checkPlayerOne()
        .checkScore()}\n` +
        `Score ${game.checkPlayerTwo().checkName()}: ${game
          .checkPlayerTwo()
          .checkScore()}\n`
    );
  };

  const roundsLeft = () => {
    console.log(
      `${game.checkRoundCounter()} rounds are played, ${
        game.checkRoundsTotal() - game.checkRoundCounter()
      } are left!`
    );
  };

  const callout = (call) => {
    console.log(call);
  };

  return { board, score, roundsLeft, callout };
})();

game.newGame(); // START GAME
