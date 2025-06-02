// ___GAMEBOARD (IIFE-MODULE)___

const gameboard = (function () {
  let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const placePlayerOne = (field) =>
    board.splice(field - 1, 1, game.playerOne.checkSymbol());
  const placePlayerTwo = (field) =>
    board.splice(field - 1, 1, game.playerTwo.checkSymbol());
  const clearBoard = () => (board = [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const logGameboard = () => renderConsole.board(board);
  return {
    board,
    placePlayerOne,
    placePlayerTwo,
    logGameboard,
    clearBoard,
  };
})();

// ___PLAYER___

function createPlayer(symbol) {
  let score = 0;
  let playerSymbol = symbol;

  const checkSymbol = () => playerSymbol; // notwendig? geht auch mit game.playerOne.playerSymbol
  const checkScore = () => score;
  const winRound = () => score++;

  return { score, playerSymbol, checkSymbol, checkScore, winRound };
}

// ___GAME-LOGIC (IIFE-Module)____

const game = (function () {
  let gameCounter = 0;
  let roundCounter = 0;
  let playerOne = createPlayer("X");
  let playerTwo = createPlayer("O");
  let turnPlayerOne = true;

  const newGame = () => {
    resetGame();
    randomStartPlayer();
    playRound();
  };

  const playRound = () => {
    playTurn();
  };

  const playTurn = () => {
    renderConsole.nextTurn();
    let nextTurn = prompt("What`s your turn? (1 - 9)");
    verifyTurn(nextTurn);
  };

  const resetGame = () => {
    gameboard.clearBoard();
    playerOne.score = 0;
    playerTwo.score = 0;
  };

  const randomStartPlayer = () => {
    if (Math.random() < 0.5) {
      turnPlayerOne = true;
      console.log("Player One Begins!");
    } else {
      turnPlayerOne = false;
      console.log("Player Two Begins!");
    }
  };

  const verifyTurn = (field) => {
    if (
      gameboard.board[field - 1] === game.playerOne.checkSymbol() ||
      gameboard.board[field - 1] === game.playerTwo.checkSymbol()
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

  return {
    gameCounter,
    roundCounter,
    playerOne,
    playerTwo,
    turnPlayerOne,
    newGame,
    resetGame,
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
      `Score Player One: ${game.playerOne.checkScore()}\n` +
        `Score Player Two: ${game.playerTwo.checkScore()}\n`
    );
  };

  const nextTurn = () => {
    let nextPlayer = "";
    if (game.turnPlayerOne) {
      nextPlayer = "Player One";
    } else {
      nextPlayer = "Player Two";
    }
    console.log(`Next turn: ${nextPlayer}!`);
  };

  const invalidTurn = (message) => {
    console.log(message);
  };

  return { board, score, nextTurn, invalidTurn };
})();

gameboard.placePlayerOne(4);
gameboard.placePlayerTwo(6);
game.newGame();
gameboard.logGameboard();
