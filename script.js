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
  let currentPlayer = null;

  const newGame = () => {
    console.log("New Game started");
    resetGame();
    randomStartPlayer();
    gameProcess = true;
  };

  // reacts to click on the board while gameProcess = true
  const handlePlayerMove = (field) => {
    currentPlayer = turnPlayerOne ? playerOne : playerTwo;

    if (verifyTurn(field)) {
      placeMark(field);
    } else {
      screenController.messageToPlayer("Field is already occupied!");
    }

    if (verifyRoundEnd()) {
      handleRoundEnd();
    } else {
      turnCounter++;
    }

    if (verifyGameEnd()) {
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
    } else {
      // only if game ends, next turn is not prepared!
      prepareNextTurn();
    }

    screenController.updateScreen();
  };

  const verifyTurn = (field) => {
    if (
      gameboard.checkField(field - 1) === playerOne.checkSymbol() ||
      gameboard.checkField(field - 1) === playerTwo.checkSymbol()
    ) {
      return false;
    } else {
      return true;
    }
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

  const prepareNextTurn = () => {
    turnPlayerOne = !turnPlayerOne;
    if (turnCounter != 0)
      screenController.messageToPlayer(`Turn: ${turnCounter}`);
  };

  const verifyRoundEnd = () => {
    let gc = gameboard.checkField;

    // get symbol of current player
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
      return true;
    } else if (turnCounter === 9) {
      draw = true;
      return true;
    } else {
      return false;
    }
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
  const updateScreen = () => {
    // Connect Javascript-Data with correspending HTML-Fields
    document.querySelector("#namePlayer1").textContent = game
      .checkPlayerOne()
      .checkName();
    document.querySelector("#namePlayer2").textContent = game
      .checkPlayerTwo()
      .checkName();
    document.querySelector("#symbolPlayer1").textContent = game
      .checkPlayerOne()
      .checkSymbol();
    document.querySelector("#symbolPlayer2").textContent = game
      .checkPlayerTwo()
      .checkSymbol();
    document.querySelector("#scorePlayer1").textContent = game
      .checkPlayerOne()
      .checkScore();
    document.querySelector("#scorePlayer2").textContent = game
      .checkPlayerTwo()
      .checkScore();
    document.querySelector("#currentRound").textContent =
      game.checkRoundCounter();
    document.querySelector("#totalRounds").textContent =
      game.checkRoundsTotal();

    if (game.checkTurnPlayerOne()) {
      document.querySelector("#nextTurnText").textContent = game
        .checkPlayerOne()
        .checkName();
    } else {
      document.querySelector("#nextTurnText").textContent = game
        .checkPlayerTwo()
        .checkName();
    }
  };

  const messageToPlayer = (text) => {
    document.querySelector("#messageToPlayer").textContent = text;
  };

  document.querySelector("#btnNewGame").addEventListener("click", () => {
    console.log("New Game started");
    game.newGame();
  });

  const fields = document.querySelectorAll(".field");

  // get clicks on gameboard & send to gamelogic if gameProcess = true
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

  return {
    updateScreen,
    messageToPlayer,
    placePlayerOne,
    placePlayerTwo,
    resetFields,
  };
})();
