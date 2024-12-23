const gridSizeSelect = document.getElementById('size-select');
const imageSelect = document.getElementById('image-select');
const gameBoard = document.getElementById('game-board');
const newGameBtn = document.getElementById('new-game-btn');
const timerDisplay = document.getElementById('timer');
const moveCountDisplay = document.getElementById('move-count');
const leaderboardList = document.getElementById('leaderboard-list');

let gridSize = parseInt(gridSizeSelect.value);
let imageSrc = imageSelect.value;
let tiles = [];
let emptyTileIndex;
let moveCount;
let startTime;
let timerInterval;
let leaderboard = [];

// Initialize the game
initGame();

// Listen for grid size changes
gridSizeSelect.addEventListener('change', () => {
  gridSize = parseInt(gridSizeSelect.value);
  initGame();
});

// Listen for image changes
imageSelect.addEventListener('change', () => {
  imageSrc = imageSelect.value;
  initGame();
});

// Start a new game
newGameBtn.addEventListener('click', startNewGame);

// Function to initialize the game
function initGame() {
  clearInterval(timerInterval);
  timerDisplay.textContent = '00:00:00';
  moveCountDisplay.textContent = 'Moves: 0';
  moveCount = 0;

  tiles = generateTiles();
  emptyTileIndex = tiles.length - 1;

  renderGameBoard();

  leaderboard = getLeaderboardFromStorage();
  updateLeaderboard();
}

// Function to generate the tile array
function generateTiles() {
  const totalTiles = gridSize * gridSize;
  const tileIndexes = Array.from({ length: totalTiles }, (_, index) => index);
  const shuffledIndexes = shuffleArray(tileIndexes);

  const newTiles = shuffledIndexes.map((index, i) => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.style.backgroundImage = imageSrc ? `url(${imageSrc})` : '';
    tile.style.backgroundPosition = getTileBackgroundPosition(index);
    tile.addEventListener('click', () => moveTile(i));
    return tile;
  });

  return newTiles;
}

// Function to render the game board
function renderGameBoard() {
  gameBoard.innerHTML = '';

  tiles.forEach(tile => {
    gameBoard.appendChild(tile);
  });
}

// Function to start a new game
function startNewGame() {
  initGame();
  startTimer();
}

// Function to move a tile
function moveTile(index) {
  if (isValidMove(index)) {
    swapTiles(index, emptyTileIndex);
    emptyTileIndex = index;
    moveCount++;
    moveCountDisplay.textContent = `Moves: ${moveCount}`;
    checkWin();
  }
}

// Function to check if a move is valid
function isValidMove(index) {
  const rowDiff = Math.floor(index / gridSize) - Math.floor(emptyTileIndex / gridSize);
  const colDiff = index % gridSize - emptyTileIndex % gridSize;

  return (Math.abs(rowDiff) === 0 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 0);
}

// Function to swap two tiles
function swapTiles(index1, index2) {
  [tiles[index1], tiles[index2]] = [tiles[index2], tiles[index1]];
  renderGameBoard();
}

// Function to check if the puzzle is solved
function checkWin() {
  const sortedTiles = tiles.slice(0, tiles.length - 1).map(tile => tile.style.backgroundPosition).sort();

  if (tiles.slice(0, tiles.length - 1).every((tile, index) => tile.style.backgroundPosition === sortedTiles[index])) {
    stopTimer();
    showWinMessage();
    updateLeaderboard();
  }
}

// Function to start the timer
function startTimer() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Function to update the timer
