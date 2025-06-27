// ___GAMEBOARD (IIFE-MODULE)___

const gameboard = (function () {
  // first row = 1 2 3, second row = 4 5 6, third row = 7 8 9
  let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const placePlayerOne = (field) =>
    board.splice(field - 1, 1, game.checkPlayerOne().checkSymbol());

  const placePlayerTwo = (field) =>
    board.splice(field - 1, 1, game.checkPlayerTwo().checkSymbol());

  // clearing Board = rewrite fields with numbers
  const clearBoard = () => (board = [1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const checkBoard = () => board;

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
  let roundsTotal = 3;
  let roundCounter = 0;
  let turnCounter = 0;
  let draw = false;
  let gameProcess = false;

  let playerOne = createPlayer("Alice", "X");
  let playerTwo = createPlayer("Bob", "O");
  let turnPlayerOne = true;
  let legitTurn = false;
  let currentPlayer = null;

  const newGame = () => {
    console.log("New Game started");
    resetGame();
    randomStartPlayer();
    gameProcess = true;
  };

  // reacts to click on the board while gameProcess = true
  const handlePlayerMove = (field) => {
    legitTurn = false;
    currentPlayer = turnPlayerOne ? playerOne : playerTwo;

    if (verifyTurn(field - 1)) {
      placeMark(field);
      turnCounter++;
      legitTurn = true;
    } else {
      screenController.messageToPlayer("Field is already occupied!");
      legitTurn = false;
    }

    let winningCombination = checkForWin();

    if (winningCombination) {
      screenController.highlightWinningCombination(winningCombination);
      handleRoundEnd();
    }

    if (turnCounter === 9) {
      draw = true;
      handleRoundEnd();
    }

    if (checkForWin()) {
      handleRoundEnd();
    }

    if (verifyGameEnd()) {
      handleGameEnd();
    }

    if (legitTurn && gameProcess) prepareNextTurn();
  };

  const verifyTurn = (fieldIndex) => {
    return (
      gameboard.checkField(fieldIndex) !== playerOne.checkSymbol() &&
      gameboard.checkField(fieldIndex) !== playerTwo.checkSymbol()
    );
  };

  const placeMark = (field) => {
    if (turnPlayerOne) {
      gameboard.placePlayerOne(field);
      screenController.placePlayerOne(field);
    } else {
      gameboard.placePlayerTwo(field);
      screenController.placePlayerTwo(field);
    }
  };

  const handleRoundEnd = () => {
    if (draw) {
      screenController.messageToPlayer("It's a draw!");
    } else {
      screenController.messageToPlayer(
        `${currentPlayer.checkName()} has won the round!`
      );
      currentPlayer.winRound();
    }
    resetRound();
  };

  const handleGameEnd = () => {
    if (playerOne.checkScore() > playerTwo.checkScore()) {
      screenController.messageToPlayer(
        `${playerOne.checkName()} has won the game!`
      );
    } else if (playerOne.checkScore() < playerTwo.checkScore()) {
      screenController.messageToPlayer(
        `${playerTwo.checkName()} has won the game!`
      );
    } else if (playerOne.checkScore() === playerTwo.checkScore()) {
      screenController.messageToPlayer("The game ends with a draw!");
    }
    resetGame();
  };

  const prepareNextTurn = () => {
    turnPlayerOne = !turnPlayerOne;
    if (turnCounter != 0)
      screenController.messageToPlayer(`Turn: ${turnCounter}`);
    screenController.updateScreen();
  };

  const checkForWin = () => {
    const possibleCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // vertical
      [0, 4, 8],
      [6, 4, 2], // diagonal
    ];

    let csym = turnPlayerOne
      ? playerOne.checkSymbol()
      : playerTwo.checkSymbol();

    let gc = gameboard.checkField;

    return possibleCombinations.find((el) => {
      return el.every((e) => gc(e) === csym);
    });
  };

  const verifyGameEnd = () => {
    if (roundCounter === roundsTotal) return true;
  };

  const randomStartPlayer = () => {
    if (Math.random() < 0.5) {
      turnPlayerOne = true;
      screenController.messageToPlayer(`${playerOne.checkName()} begins!`);
    } else {
      turnPlayerOne = false;
      screenController.messageToPlayer(`${playerTwo.checkName()} begins!`);
    }
  };

  const resetRound = () => {
    gameboard.clearBoard();
    turnCounter = 0;
    screenController.updateScreen();
    screenController.resetFields();
  };

  const resetGame = () => {
    gameboard.clearBoard();
    playerOne.score = 0;
    playerTwo.score = 0;
    roundCounter = 0;
    turnCounter = 0;
    gameProcess = false;
    screenController.resetFields();
    screenController.updateScreen();
  };

  const checkGameProcess = () => gameProcess;
  const checkPlayerOne = () => playerOne;
  const checkPlayerTwo = () => playerTwo;
  const checkRoundCounter = () => roundCounter;
  const checkRoundsTotal = () => roundsTotal;
  const checkTurnPlayerOne = () => turnPlayerOne;

  return {
    checkPlayerOne,
    checkPlayerTwo,
    checkGameProcess,
    checkRoundCounter,
    checkRoundsTotal,
    checkTurnPlayerOne,
    newGame,
    handlePlayerMove,
  };
})();

// ___SCREEN CONTROLLER___

const screenController = (function () {
  // Connect Javascript-Data with correspending HTML-Fields
  const player1Name = document.querySelector("#namePlayer1");
  const player1Symbol = document.querySelector("#symbolPlayer1");
  const player1Score = document.querySelector("#scorePlayer1");

  const player2Name = document.querySelector("#namePlayer2");
  const player2Symbol = document.querySelector("#symbolPlayer2");
  const player2Score = document.querySelector("#scorePlayer2");

  const fields = document.querySelectorAll(".field");
  
  const currentRounds = document.querySelector("#currentRound");
  const totalRounds = document.querySelector("#totalRounds");
  const nextTurnText = document.querySelector("#nextTurnText");
  const message = document.querySelector("#messageToPlayer");
  const btnNewGame = document.querySelector("#btnNewGame");

  const checkP1 = game.checkPlayerOne();
  const checkP2 = game.checkPlayerTwo();

  const updateScreen = () => {
    player1Name.textContent = checkP1.checkName();
    player2Name.textContent = checkP2.checkName();
    player1Symbol.textContent = checkP1.checkSymbol();
    player2Symbol.textContent = checkP2.checkSymbol();
    player1Score.textContent = checkP1.checkScore();
    player2Score.textContent = checkP2.checkScore();

    currentRounds.textContent = game.checkRoundCounter();
    totalRounds.textContent = game.checkRoundsTotal();

    if (game.checkTurnPlayerOne()) {
      nextTurnText.textContent = checkP1.checkName();
    } else {
      nextTurnText.textContent = checkP2.checkName();
    }
  };

  const messageToPlayer = (text) => {
    message.textContent = text;
  };

  btnNewGame.addEventListener("click", () => {
    console.log("New Game started");
    game.newGame();
  });

  // get clicks on game board & send to game logic if gameProcess = true
  fields.forEach((item) => {
    item.addEventListener("click", () => {
      if (game.checkGameProcess()) {
        game.handlePlayerMove(item.value);
      }
    });
  });

  const placePlayerOne = (field) => {
    fields[field - 1].textContent = game.checkPlayerOne().checkSymbol();
  };

  const placePlayerTwo = (field) => {
    fields[field - 1].textContent = game.checkPlayerTwo().checkSymbol();
  };

  const resetFields = () => {
    fields.forEach((item) => {
      item.textContent = "";
    });
  };

  const highlightWinningCombination = (combination) => {
    // remove highlights first to stop dissolve-animation in very quick games
    removeHighlights(combination);

    for (let i = 0; i < 3; i++) {
      fields[combination[i]].classList.add("highlight");
    }

    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        fields[combination[i]].classList.add("highlight-dissolve");
        //increase specificity
        fields[combination[i]].classList.add("highlight-dissolve");
      }
    }, 700);

    setTimeout(() => removeHighlights(combination), 4000);
  };

  const removeHighlights = (combination) => {
    for (let i = 0; i < 3; i++) {
      fields[combination[i]].classList.remove("highlight");
      fields[combination[i]].classList.remove("highlight-dissolve");
      fields[combination[i]].classList.remove("highlight-dissolve");
    }
  };

  return {
    updateScreen,
    messageToPlayer,
    placePlayerOne,
    placePlayerTwo,
    resetFields,
    highlightWinningCombination,
    removeHighlights,
  };
})();

screenController.updateScreen();