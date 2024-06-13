const canvas = document.getElementById("canvas");
const colorPalette = document.getElementById("colorPalette");
const resetButton = document.getElementById("reset");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const eraserButton = document.getElementById("eraser");
const downloadButton = document.getElementById("download");
const gridSizeInput = document.getElementById("grid-size");
const resizeButton = document.getElementById("resize");
const animalSelector = document.getElementById("animal-selector");

let selectedColor = "black";
let isMouseDown = false;
let eraserMode = false;
let history = [];
let redoStack = [];
let gridSize = 20;

document.addEventListener("DOMContentLoaded", function () {
  createGrid(gridSize);
  createColorPalette();
});

resetButton.addEventListener("click", function () {
  window.location.reload();
});

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
eraserButton.addEventListener("click", function () {
  eraserMode = !eraserMode;
  eraserButton.classList.toggle('active');
});

downloadButton.addEventListener("click", downloadCanvas);
resizeButton.addEventListener("click", function () {
  gridSize = parseInt(gridSizeInput.value);
  createGrid(gridSize);
});

animalSelector.addEventListener("change", function () {
  const animal = animalSelector.value;
  if (animal) {
    loadAnimal(animal);
  }
});

function createGrid(size) {
  canvas.innerHTML = '';
  canvas.style.gridTemplateColumns = `repeat(${size}, 20px)`;
  canvas.style.gridTemplateRows = `repeat(${size}, 20px)`;
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    canvas.appendChild(cell);

    cell.addEventListener("mousedown", function (event) {
      event.preventDefault();
      isMouseDown = true;
      saveState();
      colorCell(cell);
    });

    cell.addEventListener("mouseenter", function () {
      if (isMouseDown) {
        colorCell(cell);
      }
    });

    cell.addEventListener("mouseup", function () {
      isMouseDown = false;
    });
  }
}

function createColorPalette() {
  const colors = [
    "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "aqua", "white",
    "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50",
    "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#9e9e9e", "#607d8b"
  ];
  colors.forEach(color => {
    const colorOption = document.createElement("div");
    colorOption.style.backgroundColor = color;
    colorOption.classList.add("color-option");
    colorOption.addEventListener("click", function () {
      selectedColor = color;
      eraserMode = false;
    });
    colorPalette.appendChild(colorOption);
  });
}

function colorCell(cell) {
  if (eraserMode) {
    cell.style.backgroundColor = '';
  } else {
    cell.style.backgroundColor = selectedColor;
  }
}

function saveState() {
  const gridState = Array.from(document.querySelectorAll('.cell')).map(cell => cell.style.backgroundColor);
  history.push(gridState);
  if (history.length > 20) history.shift();
  redoStack = [];
}

function undo() {
  if (history.length) {
    redoStack.push(history.pop());
    const lastState = history[history.length - 1];
    if (lastState) {
      document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.style.backgroundColor = lastState[index];
      });
    } else {
      document.querySelectorAll('.cell').forEach(cell => {
        cell.style.backgroundColor = '';
      });
    }
  }
}

function redo() {
  if (redoStack.length) {
    history.push(redoStack.pop());
    const currentState = history[history.length - 1];
    document.querySelectorAll('.cell').forEach((cell, index) => {
      cell.style.backgroundColor = currentState[index];
    });
  }
}

function downloadCanvas() {
  const canvasElement = document.createElement('canvas');
  const ctx = canvasElement.getContext('2d');
  canvasElement.width = gridSize * 20;
  canvasElement.height = gridSize * 20;
  
  const cells = Array.from(document.querySelectorAll('.cell'));
  cells.forEach((cell, index) => {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    ctx.fillStyle = cell.style.backgroundColor || '#fff';
    ctx.fillRect(x * 20, y * 20, 20, 20);
  });

  const link = document.createElement('a');
  link.download = 'pixel-art.png';
  link.href = canvasElement.toDataURL();
  link.click();
}

function loadAnimal(animal) {
  const animals = {
    heart: [
      "..........",
      "..#...#...",
      ".##.#.##..",
      "#########.",
      "#########",
      ".#######.",
      "..#####..",
      "...###...",
      "....#....",
    ],
    dog: [
      "..........",
      "..#####...",
      ".#.....#..",
      "#.......#.",
      "#..###..#.",
      "#.......#.",
      ".#.....#..",
      "..#####...",
    ],
    fish: [
      "..........",
      "..#####...",
      ".#.....#..",
      "#.......#.",
      "#.......#.",
      ".#.....#..",
      "..#####...",
      "..........",
    ],
  };

  const pattern = animals[animal];
  if (pattern) {
    document.querySelectorAll('.cell').forEach((cell, index) => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      const char = pattern[y] && pattern[y][x];
      if (char === "#") {
        cell.style.backgroundColor = "black";
      } else {
        cell.style.backgroundColor = "white";
      }
    });
  }
}
