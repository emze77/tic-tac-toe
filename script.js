/* 
================
== GAME BOARD ==
================
*/

const gameboard = (function () {
  // first row = 0, 1, 2. second row = 3, 4, 5. third row = 6, 7, 8.
  let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const placePlayerOne = (field) =>
    board.splice(field, 1, game.checkPlayerOne().checkSymbol());

  const placePlayerTwo = (field) =>
    board.splice(field, 1, game.checkPlayerTwo().checkSymbol());

  // clearing Board = rewrite fields with numbers
  const clearBoard = () => (board = [0, 1, 2, 3, 4, 5, 6, 7, 8]);

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
  let roundsTotal = 3;
  let roundCounter = 0;
  let turnCounter = 0;
  let gameProcess = false;

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
    let legitTurn = false;
    let draw = false;

    if (verifyTurn(field)) {
      placeMark(field);
      turnCounter++;
      legitTurn = true;
    } else {
      screenController.messageToPlayer("Field is already occupied!");
      legitTurn = false;
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

  const placeMark = (field) => {
    if (currentPlayer === playerOne) {
      gameboard.placePlayerOne(field);
      screenController.placePlayerOne(field);
    } else  {
      gameboard.placePlayerTwo(field);
      screenController.placePlayerTwo(field);
    }
  };

  const verifyRoundEnd = () => {
    let winningCombination = checkForWin();

    if (winningCombination) {
      screenController.highlightWinningCombination(winningCombination);
      draw = false;
      return true;
    }

    if (turnCounter === 9) {
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
      currentPlayer = playerTwo
    } else {
      currentPlayer = playerOne
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

    let currentSymbol = (currentPlayer === playerOne)
      ? playerOne.checkSymbol()
      : playerTwo.checkSymbol();

    let gc = gameboard.checkField;

    return possibleCombinations.find((el) => {
      return el.every((e) => gc(e) === currentSymbol);
    });
  };

  const verifyGameEnd = () => {
    return (roundCounter === roundsTotal)
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
  const player1Name = document.querySelector("#namePlayer1");
  const player1Symbol = document.querySelector("#symbolPlayer1");
  const player1Score = document.querySelector("#scorePlayer1");
  const player1Container = document.querySelector(".containerPlayer1");
  const player2Name = document.querySelector("#namePlayer2");
  const player2Symbol = document.querySelector("#symbolPlayer2");
  const player2Score = document.querySelector("#scorePlayer2");
  const player2Container = document.querySelector(".containerPlayer2");
  const fields = document.querySelectorAll(".field");
  const currentRounds = document.querySelector("#currentRound");
  const totalRounds = document.querySelector("#totalRounds");
  const nextTurnText = document.querySelector("#nextTurnText");
  const message = document.querySelector("#messageToPlayer");
  const btnNewGame = document.querySelector("#btnNewGame");
  const dialogLabel = document.querySelector("#dialogLabel");
  const dialogInput = document.querySelector("#dialogInput");
  const confirmBtn = document.querySelector("#confirmBtn");

  // abbreviations
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

    if (game.checkCurrentPlayer() === game.checkPlayerOne()) {
      nextTurnText.textContent = checkP1.checkName();
    } else {
      nextTurnText.textContent = checkP2.checkName();
    }
  };

  // different messages for the players
  const messageToPlayer = (text) => {
    message.textContent = text;
  };

  // Button to start the game
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

  // placing and removing marks
  const placePlayerOne = (field) => {
    fields[field].textContent = game.checkPlayerOne().checkSymbol();
  };

  const placePlayerTwo = (field) => {
    fields[field].textContent = game.checkPlayerTwo().checkSymbol();
  };

  const resetFields = () => {
    fields.forEach((item) => {
      item.textContent = "";
    });
  };

  // adding and removing different highlights
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
      player1Container.classList.add("highlightTurnP1");
    } else {
      player2Container.classList.add("highlightTurnP2");
    }
  };

  const highlightWinner = (player) => {
    if (player === "playerOne") {
      player1Container.classList.add("highlightWinner");
    } else {
      player2Container.classList.add("highlightWinner");
    }
  };

  const resetPlayerHighlights = () => {
    player1Container.classList.remove("highlightTurnP1");
    player2Container.classList.remove("highlightTurnP2");
    player1Container.classList.remove("highlightWinner");
    player2Container.classList.remove("highlightWinner");
  };

  // configure names, symbols and amount of rounds to play

  let configItem;

  let configurableItems = [
    player1Name,
    player1Symbol,
    player2Name,
    player2Symbol,
    totalRounds,
  ];

  configurableItems.forEach((item) => {
    item.addEventListener("click", () => {
      configItem = item;
      dialogInput.value = "";
      adjustConfigLabel();
      configureDialog.showModal();
    });
  });

  const adjustConfigLabel = () => {
    // default input-method is text.
    dialogInput.setAttribute("type", "text");
    if (configItem === player1Name) {
      dialogLabel.textContent = "Choose name for Player One:";
      dialogInput.setAttribute("maxlength", 10);
    } else if (configItem === player1Symbol) {
      dialogInput.setAttribute("maxlength", 1);
      dialogLabel.textContent = "Choose symbol for Player One:";
    } else if (configItem === player2Name) {
      dialogInput.setAttribute("maxlength", 10);
      dialogLabel.textContent = "Choose name for Player Two:";
    } else if (configItem === player2Symbol) {
      dialogInput.setAttribute("maxlength", 1);
      dialogLabel.textContent = "Choose symbol for Player Two:";
    } else if (configItem === totalRounds) {
      dialogLabel.textContent = "Set total amount of rounds:";
      dialogInput.setAttribute("type", "number");
      messageToPlayer("Ready to start a game?");
      game.resetGame();
    }
  };

  confirmBtn.addEventListener("click", (event) => {
    // form should not submit
    event.preventDefault();
    // returns input when closing
    configureDialog.close(dialogInput.value);
    handleConfigChange();
    updateScreen();
  });

  dialogInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      //simulate clicking confirm
      confirmBtn.click();
    }
  });

  const handleConfigChange = () => {
    if (configItem === player1Name) {
      checkP1.changeName(configureDialog.returnValue);
    } else if (configItem === player1Symbol) {
      checkP1.changeSymbol(configureDialog.returnValue);
    } else if (configItem === player2Name) {
      checkP2.changeName(configureDialog.returnValue);
    } else if (configItem === player2Symbol) {
      checkP2.changeSymbol(configureDialog.returnValue);
    } else if (configItem === totalRounds) {
      game.changeTotalRounds(configureDialog.returnValue);
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
    highlightCurrentPlayer,
    resetPlayerHighlights,
    highlightWinner,
  };
})();

screenController.updateScreen();
