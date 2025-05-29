function gameboard() {
  let gameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const placeX = (field) => {
    gameboard.splice(field - 1, 1, "X");
  };

  const placeO = (field) => {
    gameboard.splice(field - 1, 1, "O");
  };

  const clearGame = () => {
    gameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  };

  return { gameboard, placeX, placeO, clearGame };
}

function renderConsole (gameboard) {
 console.log(
    " " + gameboard[0], gameboard[1], gameboard[2], "\n",
    gameboard[3], gameboard[4], gameboard[5], "\n",
    gameboard[6], gameboard[7], gameboard[8], "\n",
 )
}



const newGame = gameboard();

newGame.placeX(5);
newGame.placeO(4);
newGame.placeX(3);
renderConsole(newGame.gameboard);
newGame.clearGame();
