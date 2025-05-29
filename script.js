// ___GAMEBOARD (IIFE-MODULE)___

const gameboard = (function () {
  let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const placeX = (field) => board.splice(field - 1, 1, "X");
  const placeO = (field) => board.splice(field - 1, 1, "O");
  const clearGame = () => board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const logGameboard = () => renderConsole(board);
  return { board, placeX, placeO, logGameboard, clearGame };
})();

// ___PLAYER___

function createPlayer(name) {
  const playerName = name;
  let score = 0;

  const checkScore = () => score;
  const winRound = () => score++;

  return { playerName, checkScore, winRound };
}

// ___GAME-LOGIC____

function game () {
    let gameCounter = 0;
    let roundCounter = 0;

    const newGame = () => {
        //
    }

    const playRound = () => {
        //
    }

    return { gameCounter , roundCounter}
}

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
}

gameboard.placeX(5);
gameboard.logGameboard();
gameboard.clearGame();
