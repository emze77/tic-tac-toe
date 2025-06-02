// ___GAMEBOARD (IIFE-MODULE)___

const gameboard = (function () {
  let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const placePlayerOne = (field) => board.splice(field - 1, 1, game.playerOne.checkSymbol());
  const placePlayerTwo = (field) => board.splice(field - 1, 1, game.playerTwo.checkSymbol());
  const clearBoard = () => (board = [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const logGameboard = () => renderConsole(board);
  return { board, placePlayerOne, placePlayerTwo, logGameboard, clearBoard };
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

  }

  const resetGame = () => {
    gameboard.clearBoard();
    playerOne.score = 0;
    playerTwo.score = 0;
  };

  const randomStartPlayer =  () => {
    if (Math.random() < 0.5) {
      turnPlayerOne = true;
      console.log("Player One Begins!")
    } else {
      turnPlayerOne = false;
      console.log("Player Two Begins!")
    }
  }



  return {
    gameCounter,
    roundCounter,
    playerOne,
    playerTwo,
    turnPlayerOne,
    newGame,
    resetGame,
    randomStartPlayer,
    playRound,
    playTurn,
  };
})();


function renderConsole(board) {
  console.log(
    "\n" + 
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
    `Score Player Two: ${game.playerTwo.checkScore()}\n`
  );
}

game.newGame();
gameboard.placePlayerOne(4);
gameboard.placePlayerTwo(6);
gameboard.logGameboard();
