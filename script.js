function gameboard () {
    const newGameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let actualGameboard = newGameboard;
    
    const placeX = (field) => {
        actualGameboard.splice((field - 1), 1, "X")
        console.log(actualGameboard)
    };

    const placeO = (field) => {
        actualGameboard.splice((field - 1), 1, "O")
        console.log(actualGameboard)
    }

    const clearGame = () => {
        actualGameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        console.log(actualGameboard);
    }

    return { gameboard , placeX , placeO , clearGame}
}


const newGame = gameboard();

newGame.placeX(5);
newGame.placeO(4)
newGame.placeX(3)
newGame.clearGame()