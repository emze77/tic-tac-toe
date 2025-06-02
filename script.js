// ___GAMEBOARD (IIFE-MODULE)___

const gameboard = (function () {
  let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const placeX = (field) => board.splice(field - 1, 1, "X");
  const placeO = (field) => board.splice(field - 1, 1, "O");
  const clearGame = () => (board = [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const logGameboard = () => renderConsole(board);
  return { board, placeX, placeO, logGameboard, clearGame };
})();

// ___PLAYER___

function createPlayer(symbol) {
  let score = 0;
  let playerSymbol = "";

  const checkSymbol = () => playerSymbol;
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
    //
  };

  const resetGame = () => {
    gameboard.clearGame();
    game.playerOne.score = 0;
    game.playerTwo.score = 0;
  };

  const playRound = () => {
    // //
  };

  return {
    gameCounter,
    roundCounter,
    playerOne,
    playerTwo,
    turnPlayerOne,
    newGame,
    resetGame,
    playRound,
  };
})();

function renderConsole(board) {
  console.log(
    " " + board[0],
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
  console.log(
    `Score Player One: ${game.playerOne.checkScore()}\n` + 
    `Score Player Two: ${game.playerTwo.checkScore()}`
  );
}

gameboard.placeX(5);
gameboard.logGameboard();

game.resetGame();
game.playerOne.winRound();
game.playerOne.winRound();
gameboard.logGameboard();
