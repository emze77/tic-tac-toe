/* 
================
== GAME BOARD ==
================
*/

const gameboard = (function () {
  // first row = 0, 1, 2. second row = 3, 4, 5. third row = 6, 7, 8.
  let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const placeMark = (field) =>
    board.splice(field, 1, game.checkCurrentPlayer().checkSymbol());

  const clearBoard = () => (board = [0, 1, 2, 3, 4, 5, 6, 7, 8]);

  return {
    checkField: (field) => board[field],
    checkBoard: () => board,
    placeMark,
    clearBoard,
  };
})();

/* 
====================
== CREATE PLAYERS ==
==================== 
*/

function createPlayer(name, symbol) {
  let playerName = name;
  let playerSymbol = symbol;
  let score = 0;

  return {
    checkName: () => playerName,
    checkSymbol: () => playerSymbol,
    checkScore: () => score,
    winRound: () => score++,
    resetScore: () => (score = 0),
    changeName: (newName) => (playerName = newName),
    changeSymbol: (newSymbol) => (playerSymbol = newSymbol),
  };
}

/* 
================
== GAME LOGIC ==
================ 
*/

const game = (function () {
  const DEFAULT_ROUNDS = 3;
  const MAX_TURNS = 9;

  let roundsTotal = DEFAULT_ROUNDS;
  let roundCounter = 0;
  let turnCounter = 0;
  let gameProcess = false;
  let draw = false;
  let legitTurn = false;

  let playerOne = createPlayer("Alice", "X");
  let playerTwo = createPlayer("Bob", "O");
  let currentPlayer = null;

  const newGame = () => {
    console.log("New Game started");
    resetGame();
    randomStartPlayer();
    screenController.highlightCurrentPlayer();
    gameProcess = true;
  };

  // reacts to click on the board while gameProcess = true
  const handlePlayerMove = (field) => {
    if (verifyTurn(field)) {
      handleLegitTurn(field);
    } else {
      handleIllegitTurn();
    }

    if (verifyRoundEnd()) {
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

  const handleLegitTurn = (field) => {
    legitTurn = true;
    gameboard.placeMark(field);
    screenController.placeMark(field);
    turnCounter++;
  };

  const handleIllegitTurn = () => {
    legitTurn = false;
    screenController.messageToPlayer("Field is already occupied!");
  };

  const verifyRoundEnd = () => {
    let winningCombination = checkForWin();

    if (winningCombination) {
      screenController.highlightWinningCombination(winningCombination);
      draw = false;
      return true;
    }

    if (turnCounter === MAX_TURNS) {
      draw = true;
      return true;
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
    roundCounter++;
    resetRound();
  };

  const handleGameEnd = () => {
    console.log("game ends");
    let winner;

    if (playerOne.checkScore() > playerTwo.checkScore()) {
      screenController.messageToPlayer(
        `${playerOne.checkName()} has won the game!`
      );
      winner = "playerOne";
    } else if (playerOne.checkScore() < playerTwo.checkScore()) {
      screenController.messageToPlayer(
        `${playerTwo.checkName()} has won the game!`
      );
      winner = "playerTwo";
    } else if (playerOne.checkScore() === playerTwo.checkScore()) {
      screenController.messageToPlayer("The game ends with a draw!");
    }
    resetGame();
    screenController.highlightWinner(winner);
  };

  const prepareNextTurn = () => {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
    } else {
      currentPlayer = playerOne;
    }
    screenController.highlightCurrentPlayer();
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

    return possibleCombinations.find((el) => {
      return el.every((e) => gameboard.checkField(e) === currentPlayer.checkSymbol());
    });
  };

  const verifyGameEnd = () => {
    return roundCounter === roundsTotal;
  };

  const randomStartPlayer = () => {
    if (Math.random() < 0.5) {
      currentPlayer = playerOne;
      screenController.messageToPlayer(`${playerOne.checkName()} begins!`);
    } else {
      currentPlayer = playerTwo;
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
    playerOne.resetScore();
    playerTwo.resetScore();
    roundCounter = 0;
    turnCounter = 0;
    gameProcess = false;
    screenController.resetPlayerHighlights();
    screenController.resetFields();
    screenController.updateScreen();
  };

  return {
    checkPlayerOne: () => playerOne,
    checkPlayerTwo: () => playerTwo,
    checkGameProcess: () => gameProcess,
    checkRoundCounter: () => roundCounter,
    checkRoundsTotal: () => roundsTotal,
    checkCurrentPlayer: () => currentPlayer,
    changeTotalRounds: (newTotalRounds) =>
      (roundsTotal = parseInt(newTotalRounds)),
    handlePlayerMove,
    newGame,
    resetGame,
  };
})();

/* 
=======================
== SCREEN CONTROLLER ==
======================= 
*/

const screenController = (function () {
  const playerOne = {
    name: document.querySelector("#namePlayer1"),
    symbol: document.querySelector("#symbolPlayer1"),
    score: document.querySelector("#scorePlayer1"),
    container: document.querySelector(".containerPlayer1"),
  };

  const playerTwo = {
    name: document.querySelector("#namePlayer2"),
    symbol: document.querySelector("#symbolPlayer2"),
    score: document.querySelector("#scorePlayer2"),
    container: document.querySelector(".containerPlayer2"),
  };

  const dialog = {
    label: document.querySelector("#dialogLabel"),
    input: document.querySelector("#dialogInput"),
    confirmBtn: document.querySelector("#confirmBtn"),
  };

  const fields = document.querySelectorAll(".field");
  const currentRounds = document.querySelector("#currentRound");
  const totalRounds = document.querySelector("#totalRounds");
  const nextTurnText = document.querySelector("#nextTurnText");
  const message = document.querySelector("#messageToPlayer");
  const btnNewGame = document.querySelector("#btnNewGame");

  // abbreviations
  const checkP1 = game.checkPlayerOne();
  const checkP2 = game.checkPlayerTwo();

  const updateScreen = () => {
    playerOne.name.textContent = checkP1.checkName();
    playerTwo.name.textContent = checkP2.checkName();
    playerOne.symbol.textContent = checkP1.checkSymbol();
    playerTwo.symbol.textContent = checkP2.checkSymbol();
    playerOne.score.textContent = checkP1.checkScore();
    playerTwo.score.textContent = checkP2.checkScore();

    currentRounds.textContent = game.checkRoundCounter();
    totalRounds.textContent = game.checkRoundsTotal();

    if (game.checkCurrentPlayer() === game.checkPlayerOne()) {
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

  const placeMark = (field) =>
    (fields[field].textContent = game.checkCurrentPlayer().checkSymbol());

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

    // dissolve-animation
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        fields[combination[i]].classList.add("highlight-dissolve");
      }
    }, 700);

    setTimeout(() => removeHighlights(combination), 4000);
  };

  const removeHighlights = (combination) => {
    for (let i = 0; i < 3; i++) {
      fields[combination[i]].classList.remove("highlight");
      fields[combination[i]].classList.remove("highlight-dissolve");
    }
  };

  const highlightCurrentPlayer = () => {
    resetPlayerHighlights();
    if (game.checkCurrentPlayer() === game.checkPlayerOne()) {
      playerOne.container.classList.add("highlightTurnP1");
    } else {
      playerTwo.container.classList.add("highlightTurnP2");
    }
  };

  const highlightWinner = (player) => {
    if (player === "playerOne") {
      playerOne.container.classList.add("highlightWinner");
    } else {
      playerTwo.container.classList.add("highlightWinner");
    }
  };

  const resetPlayerHighlights = () => {
    playerOne.container.classList.remove("highlightTurnP1");
    playerTwo.container.classList.remove("highlightTurnP2");
    playerOne.container.classList.remove("highlightWinner");
    playerTwo.container.classList.remove("highlightWinner");
  };

  // configure names, symbols and amount of rounds to play

  let configItem;

  let configurableItems = [
    playerOne.name,
    playerOne.symbol,
    playerTwo.name,
    playerTwo.symbol,
    totalRounds,
  ];

  configurableItems.forEach((item) => {
    item.addEventListener("click", () => {
      configItem = item;
      dialog.input.value = "";
      adjustConfigLabel();
      configureDialog.showModal();
    });
  });

  const adjustConfigLabel = () => {
    // default input-method is text.
    dialog.input.setAttribute("type", "text");
    if (configItem === playerOne.name) {
      dialog.label.textContent = "Choose name for Player One:";
      dialog.input.setAttribute("maxlength", 10);
    } else if (configItem === playerOne.symbol) {
      dialog.input.setAttribute("maxlength", 1);
      dialog.label.textContent = "Choose symbol for Player One:";
    } else if (configItem === playerTwo.name) {
      dialog.input.setAttribute("maxlength", 10);
      dialog.label.textContent = "Choose name for Player Two:";
    } else if (configItem === playerTwo.symbol) {
      dialog.input.setAttribute("maxlength", 1);
      dialog.label.textContent = "Choose symbol for Player Two:";
    } else if (configItem === totalRounds) {
      dialog.label.textContent = "Set total amount of rounds:";
      dialog.input.setAttribute("type", "number");
      messageToPlayer("Ready to start a game?");
      game.resetGame();
    }
  };

  confirmBtn.addEventListener("click", (event) => {
    // form should not submit
    event.preventDefault();
    // returns input when closing
    configureDialog.close(dialog.input.value);
    handleConfigChange();
    updateScreen();
  });

  dialog.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      dialog.confirmBtn.click();
    }
  });

  const handleConfigChange = () => {
    if (configItem === playerOne.name) {
      checkP1.changeName(configureDialog.returnValue);
    } else if (configItem === playerOne.symbol) {
      checkP1.changeSymbol(configureDialog.returnValue);
    } else if (configItem === playerTwo.name) {
      checkP2.changeName(configureDialog.returnValue);
    } else if (configItem === playerTwo.symbol) {
      checkP2.changeSymbol(configureDialog.returnValue);
    } else if (configItem === totalRounds) {
      game.changeTotalRounds(configureDialog.returnValue);
    }
  };

  return {
    updateScreen,
    messageToPlayer,
    placeMark,
    resetFields,
    highlightWinningCombination,
    removeHighlights,
    highlightCurrentPlayer,
    resetPlayerHighlights,
    highlightWinner,
  };
})();

screenController.updateScreen();
