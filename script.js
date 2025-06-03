// ___GAMEBOARD (IIFE-MODULE)___

const gameboard = (function () {
  let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const placePlayerOne = (field) =>
    board.splice(field - 1, 1, game.checkPlayerOne().checkSymbol());
  const placePlayerTwo = (field) =>
    board.splice(field - 1, 1, game.checkPlayerTwo().checkSymbol());
  const clearBoard = () => (board = [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const logGameboard = () => renderConsole.board(board);
  const checkField = (field) => board[field];
  return {
    checkField,
    placePlayerOne,
    placePlayerTwo,
    logGameboard,
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
  let roundsTotal = 3;
  let roundCounter = 0;
  let roundEnd = false;

  let playerOne = createPlayer("Jens", "X");
  let playerTwo = createPlayer("Jenny", "O");
  let turnPlayerOne = true;

  const newGame = () => {
    resetGame();
    randomStartPlayer();

    do {
      playRound();
    } while (roundsTotal > roundCounter);

    handleGameEnd();
  };

  const playRound = () => {
    do {
      playTurn();
      gameboard.logGameboard();
      verifyRoundEnd();
      turnPlayerOne = !turnPlayerOne;
    } while (!roundEnd);

    handleRoundEnd();
  };

  const playTurn = () => {
    let nextPlayer = game.turnPlayerOne ? "Player One" : "Player Two";
    renderConsole.callout(`Next turn: ${nextPlayer}!`);
    let nextTurn = prompt("What`s your turn? (1 - 9)");
    verifyTurn(nextTurn);
    turnPlayerOne
      ? gameboard.placePlayerOne(nextTurn)
      : gameboard.placePlayerTwo(nextTurn);
  };

  const randomStartPlayer = () => {
    if (Math.random() < 0.5) {
      turnPlayerOne = true;
      renderConsole.callout("Player One Begins!");
    } else {
      turnPlayerOne = false;
      renderConsole.callout("Player Two Begins!");
    }
  };

  const verifyTurn = (field) => {
    if (
      gameboard.checkField(field - 1) === playerOne.checkSymbol() ||
      gameboard.checkField(field - 1) === playerTwo.checkSymbol()
    ) {
      renderConsole.invalidTurn("Field is already occupied!");
    } else if (field < 1 || field > 9 || field % 1 !== 0) {
      renderConsole.invalidTurn("Not a valid number!");
    } else if (isNaN(field)) {
      renderConsole.invalidTurn("Not a number at all!");
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
    }
  };

  const handleRoundEnd = () => {
    let winner = turnPlayerOne ? playerTwo : playerOne; // turn changes after verifyRoundEnd
    playerOne.winRound();
    roundEnd = false;
    addRound();

    renderConsole.callout(
      `${winner.checkName()} has won the round!\n
      New Score: ${playerOne.checkName()}: ${playerOne.checkScore()}, ${playerTwo.checkName()}: ${playerTwo.checkScore()}\n
      ${roundCounter} rounds are played, ${
        roundsTotal - roundCounter
      } are left!`
    );

    gameboard.clearBoard();
  };

  const addRound = () => roundCounter++;
  const checkPlayerOne = () => playerOne;
  const checkPlayerTwo = () => playerTwo;

  const resetGame = () => {
    gameboard.clearBoard();
    playerOne.score = 0;
    playerTwo.score = 0;
  };

  return {
    checkPlayerOne,
    checkPlayerTwo,
    newGame,
  };
})();

const renderConsole = (function () {
  const board = (board) => {
    console.log(
      "\n" + " " + board[0],
      board[1],
      board[2],
      "\n",
      board[3],
      board[4],
      board[5],
      "\n",
      board[6],
      board[7],
      board[8],
      "\n"
    );
  };

  const score = () => {
    console.log(
      `Score Player One: ${game.checkPlayerOne().checkScore()}\n` +
        `Score Player Two: ${game.checkPlayerTwo().checkScore()}\n`
    );
  };

  const callout = (call) => {
    console.log(call);
  };

  const invalidTurn = (message) => {
    console.log(message);
  };



  return { board, score, callout, invalidTurn };
})();

gameboard.placePlayerOne(4);
gameboard.placePlayerTwo(6);
game.newGame();
gameboard.logGameboard();
