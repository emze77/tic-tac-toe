/*
====================
== TIC-TAC-TOE ==
====================
A professional single-file implementation with improved structure, immutability, and readability.
*/

// ====================
// Constants
// ====================
const PLAYER_DEFAULTS = {
  PLAYER_ONE: { name: "Alice", symbol: "X" },
  PLAYER_TWO: { name: "Bob", symbol: "O" },
};
const INITIAL_BOARD = Array.from({ length: 9 }, (_, i) => i);
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6],             // Diagonals
];
const MAX_ROUNDS = 10;
const MIN_ROUNDS = 1;

// ====================
// Game Board Module
// ====================
const gameboard = (() => {
  let board = [...INITIAL_BOARD];

  const placeMark = (field, symbol) => {
    if (!isValidField(field) return false;
    board = board.map((val, idx) => (idx === field ? symbol : val));
    return true;
  };

  const isValidField = (field) => {
    return (
      Number.isInteger(field) &&
      field >= 0 &&
      field < board.length &&
      typeof board[field] !== "string"
    );
  };

  const clearBoard = () => {
    board = [...INITIAL_BOARD];
  };

  const getBoard = () => [...board];
  const getField = (field) => board[field];

  return { placeMark, clearBoard, getBoard, getField, isValidField };
})();

// ====================
// Player Factory
// ====================
const createPlayer = (name, symbol) => {
  let score = 0;

  const validateSymbol = (sym) => {
    return typeof sym === "string" && sym.length === 1 && sym.trim() !== "";
  };

  const changeSymbol = (newSymbol) => {
    if (!validateSymbol(newSymbol)) return false;
    symbol = newSymbol;
    return true;
  };

  return {
    getName: () => name,
    getSymbol: () => symbol,
    getScore: () => score,
    incrementScore: () => ++score,
    resetScore: () => (score = 0),
    changeName: (newName) => (name = newName),
    changeSymbol,
  };
};

// ====================
// Game Module
// ====================
const game = (() => {
  let playerOne = createPlayer(
    PLAYER_DEFAULTS.PLAYER_ONE.name,
    PLAYER_DEFAULTS.PLAYER_ONE.symbol
  );
  let playerTwo = createPlayer(
    PLAYER_DEFAULTS.PLAYER_TWO.name,
    PLAYER_DEFAULTS.PLAYER_TWO.symbol
  );
  let currentPlayer = null;
  let roundsTotal = 3;
  let roundCounter = 0;
  let turnCounter = 0;
  let isGameActive = false;
  let isRoundActive = false;

  const startNewGame = () => {
    resetGame();
    isGameActive = true;
    isRoundActive = true;
    setRandomStartingPlayer();
    ui.updateGameStatus();
    ui.displayMessage(`${currentPlayer.getName()} starts!`);
  };

  const handlePlayerMove = (field) => {
    if (!isRoundActive || !gameboard.isValidField(field)) {
      ui.displayMessage("Invalid move!");
      return;
    }

    const symbol = currentPlayer.getSymbol();
    if (!gameboard.placeMark(field, symbol)) return;

    ui.updateField(field, symbol);
    turnCounter++;

    if (checkRoundEnd()) return;
    prepareNextTurn();
  };

  const checkRoundEnd = () => {
    const winner = checkWinner();
    if (winner) {
      endRound(winner);
      return true;
    }

    if (turnCounter === 9) {
      endRound(null); // Draw
      return true;
    }

    return false;
  };

  const checkWinner = () => {
    const board = gameboard.getBoard();
    const symbol = currentPlayer.getSymbol();

    return WINNING_COMBINATIONS.some((combo) =>
      combo.every((idx) => board[idx] === symbol)
    );
  };

  const endRound = (winner) => {
    isRoundActive = false;
    roundCounter++;

    if (winner) {
      winner.incrementScore();
      ui.highlightWinningCells(getWinningCombo());
      ui.displayMessage(`${winner.getName()} wins round ${roundCounter}!`);
    } else {
      ui.displayMessage("Round ended in a draw!");
    }

    if (roundCounter >= roundsTotal) {
      endGame();
    } else {
      setTimeout(startNewRound, 1500);
    }
  };

  const endGame = () => {
    isGameActive = false;
    const winner = determineGameWinner();
    ui.displayMessage(
      winner
        ? `${winner.getName()} wins the game!`
        : "Game ended in a draw!"
    );
    ui.highlightWinner(winner);
  };

  const determineGameWinner = () => {
    const p1Score = playerOne.getScore();
    const p2Score = playerTwo.getScore();

    if (p1Score > p2Score) return playerOne;
    if (p2Score > p1Score) return playerTwo;
    return null; // Draw
  };

  const getWinningCombo = () => {
    const board = gameboard.getBoard();
    const symbol = currentPlayer.getSymbol();

    return WINNING_COMBINATIONS.find((combo) =>
      combo.every((idx) => board[idx] === symbol)
    );
  };

  const startNewRound = () => {
    gameboard.clearBoard();
    turnCounter = 0;
    isRoundActive = true;
    setRandomStartingPlayer();
    ui.resetBoard();
    ui.updateGameStatus();
    ui.displayMessage(`Round ${roundCounter + 1} of ${roundsTotal}`);
  };

  const prepareNextTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    ui.updateGameStatus();
    ui.displayMessage(`Turn ${turnCounter + 1}`);
  };

  const setRandomStartingPlayer = () => {
    currentPlayer = Math.random() < 0.5 ? playerOne : playerTwo;
  };

  const setRoundsTotal = (rounds) => {
    roundsTotal = Math.max(
      MIN_ROUNDS,
      Math.min(MAX_ROUNDS, parseInt(rounds) || 3)
    );
  };

  const resetGame = () => {
    gameboard.clearBoard();
    playerOne.resetScore();
    playerTwo.resetScore();
    roundCounter = 0;
    turnCounter = 0;
    isGameActive = false;
    isRoundActive = false;
    ui.resetBoard();
    ui.resetPlayerHighlights();
    ui.updateGameStatus();
  };

  return {
    startNewGame,
    handlePlayerMove,
    setRoundsTotal,
    resetGame,
    getCurrentPlayer: () => currentPlayer,
    getPlayerOne: () => playerOne,
    getPlayerTwo: () => playerTwo,
    getGameStatus: () => ({
      isGameActive,
      isRoundActive,
      roundCounter,
      roundsTotal,
      turnCounter,
    }),
  };
})();

// ====================
// UI Controller
// ====================
const ui = (() => {
  // DOM Elements
  const elements = {
    player1Name: document.querySelector("#namePlayer1"),
    player1Symbol: document.querySelector("#symbolPlayer1"),
    player1Score: document.querySelector("#scorePlayer1"),
    player1Container: document.querySelector(".containerPlayer1"),
    player2Name: document.querySelector("#namePlayer2"),
    player2Symbol: document.querySelector("#symbolPlayer2"),
    player2Score: document.querySelector("#scorePlayer2"),
    player2Container: document.querySelector(".containerPlayer2"),
    fields: document.querySelectorAll(".field"),
    currentRound: document.querySelector("#currentRound"),
    totalRounds: document.querySelector("#totalRounds"),
    nextTurnText: document.querySelector("#nextTurnText"),
    message: document.querySelector("#messageToPlayer"),
    newGameBtn: document.querySelector("#btnNewGame"),
    dialogLabel: document.querySelector("#dialogLabel"),
    dialogInput: document.querySelector("#dialogInput"),
    confirmBtn: document.querySelector("#confirmBtn"),
  };

  // Initialize event listeners
  const init = () => {
    elements.newGameBtn.addEventListener("click", () => game.startNewGame());
    elements.fields.forEach((field) =>
      field.addEventListener("click", handleFieldClick)
    );
    setupConfigurableElements();
    setupDialog();
    updateGameStatus();
  };

  const handleFieldClick = (e) => {
    const fieldIndex = parseInt(e.target.value);
    if (!isNaN(fieldIndex)) {
      game.handlePlayerMove(fieldIndex);
    }
  };

  const setupConfigurableElements = () => {
    const configurableElements = [
      elements.player1Name,
      elements.player1Symbol,
      elements.player2Name,
      elements.player2Symbol,
      elements.totalRounds,
    ];

    configurableElements.forEach((el) =>
      el.addEventListener("click", () => openConfigDialog(el))
    );
  };

  const setupDialog = () => {
    elements.confirmBtn.addEventListener("click", handleDialogConfirm);
    elements.dialogInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") elements.confirmBtn.click();
    });
  };

  let currentConfigElement = null;

  const openConfigDialog = (element) => {
    currentConfigElement = element;
    elements.dialogInput.value = "";
    configureDialogLabel();
    elements.dialogInput.focus();
    elements.dialogInput.setAttribute("type", "text");
    
    if (element === elements.totalRounds) {
      elements.dialogInput.setAttribute("type", "number");
      elements.dialogInput.min = MIN_ROUNDS;
      elements.dialogInput.max = MAX_ROUNDS;
    } else if (element === elements.player1Symbol || element === elements.player2Symbol) {
      elements.dialogInput.maxLength = 1;
    } else if (element === elements.player1Name || element === elements.player2Name) {
      elements.dialogInput.maxLength = 10;
    }
    
    document.querySelector("#configureDialog").showModal();
  };

  const configureDialogLabel = () => {
    const labels = {
      [elements.player1Name.id]: "Player 1 Name:",
      [elements.player1Symbol.id]: "Player 1 Symbol:",
      [elements.player2Name.id]: "Player 2 Name:",
      [elements.player2Symbol.id]: "Player 2 Symbol:",
      [elements.totalRounds.id]: "Total Rounds:",
    };
    elements.dialogLabel.textContent = labels[currentConfigElement.id] || "Configure:";
  };

  const handleDialogConfirm = (e) => {
    e.preventDefault();
    const value = elements.dialogInput.value.trim();
    if (!value) return;

    applyConfiguration(value);
    document.querySelector("#configureDialog").close();
    updateGameStatus();
  };

  const applyConfiguration = (value) => {
    const player1 = game.getPlayerOne();
    const player2 = game.getPlayerTwo();

    switch (currentConfigElement) {
      case elements.player1Name:
        player1.changeName(value);
        break;
      case elements.player1Symbol:
        player1.changeSymbol(value);
        break;
      case elements.player2Name:
        player2.changeName(value);
        break;
      case elements.player2Symbol:
        player2.changeSymbol(value);
        break;
      case elements.totalRounds:
        game.setRoundsTotal(value);
        break;
    }
  };

  // UI Update Methods
  const updateGameStatus = () => {
    const { player1, player2 } = getPlayerData();
    const gameStatus = game.getGameStatus();

    // Update player info
    elements.player1Name.textContent = player1.name;
    elements.player1Symbol.textContent = player1.symbol;
    elements.player1Score.textContent = player1.score;
    elements.player2Name.textContent = player2.name;
    elements.player2Symbol.textContent = player2.symbol;
    elements.player2Score.textContent = player2.score;

    // Update round info
    elements.currentRound.textContent = gameStatus.roundCounter;
    elements.totalRounds.textContent = gameStatus.roundsTotal;

    // Update current player highlight
    updateCurrentPlayerHighlight();
  };

  const getPlayerData = () => {
    const player1 = game.getPlayerOne();
    const player2 = game.getPlayerTwo();
    return {
      player1: {
        name: player1.getName(),
        symbol: player1.getSymbol(),
        score: player1.getScore(),
      },
      player2: {
        name: player2.getName(),
        symbol: player2.getSymbol(),
        score: player2.getScore(),
      },
    };
  };

  const updateCurrentPlayerHighlight = () => {
    resetPlayerHighlights();
    const currentPlayer = game.getCurrentPlayer();
    if (!currentPlayer) return;

    const isPlayer1 = currentPlayer === game.getPlayerOne();
    const highlightClass = isPlayer1 ? "highlightTurnP1" : "highlightTurnP2";
    const container = isPlayer1
      ? elements.player1Container
      : elements.player2Container;
    container.classList.add(highlightClass);
  };

  const updateField = (index, symbol) => {
    if (index >= 0 && index < elements.fields.length) {
      elements.fields[index].textContent = symbol;
      elements.fields[index].setAttribute("aria-label", `${symbol} at position ${index + 1}`);
    }
  };

  const displayMessage = (message) => {
    elements.message.textContent = message;
    elements.message.setAttribute("aria-live", "polite");
  };

  const highlightWinningCells = (combo) => {
    if (!combo) return;
    combo.forEach((idx) => {
      elements.fields[idx].classList.add("highlight");
    });
    setTimeout(() => {
      combo.forEach((idx) => {
        elements.fields[idx].classList.add("highlight-dissolve");
      });
    }, 700);
    setTimeout(() => removeHighlights(combo), 4000);
  };

  const removeHighlights = (combo) => {
    combo.forEach((idx) => {
      elements.fields[idx].classList.remove("highlight", "highlight-dissolve");
    });
  };

  const highlightWinner = (player) => {
    resetPlayerHighlights();
    if (!player) return;

    const isPlayer1 = player === game.getPlayerOne();
    const container = isPlayer1
      ? elements.player1Container
      : elements.player2Container;
    container.classList.add("highlightWinner");
  };

  const resetPlayerHighlights = () => {
    elements.player1Container.classList.remove(
      "highlightTurnP1",
      "highlightWinner"
    );
    elements.player2Container.classList.remove(
      "highlightTurnP2",
      "highlightWinner"
    );
  };

  const resetBoard = () => {
    elements.fields.forEach((field, idx) => {
      field.textContent = "";
      field.classList.remove("highlight", "highlight-dissolve");
      field.setAttribute("aria-label", `Position ${idx + 1}, empty`);
    });
  };

  return {
    init,
    updateGameStatus,
    updateField,
    displayMessage,
    highlightWinningCells,
    highlightWinner,
    resetPlayerHighlights,
    resetBoard,
  };
})();

// Initialize the game
ui.init();