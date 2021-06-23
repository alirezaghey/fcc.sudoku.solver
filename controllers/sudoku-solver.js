class SudokuSolver {
  constructor() {
    this.checkRowPlacement = this.checkRowPlacement.bind(this);
    this.checkColPlacement = this.checkColPlacement.bind(this);
    this.checkRegionPlacement = this.checkRegionPlacement.bind(this);
    this.solve = this.solve.bind(this);
  }
  validate(puzzleString) {}

  checkRowPlacement(puzzleString, row, column, value) {
    // if cell filled by anything but the value itself it's automatic invalid
    if (puzzleString[row * 9 + column] !== "." && puzzleString[row * 9 + column] != value) {
      return false;
    }
    // starting at column going through all the columns in this row
    for (let i = row * 9; i < row * 9 + 9; i++) {
      // we don't check the original cell as it can contain the value itself
      if (i === row * 9 + column) continue;
      // if value already present, it's not valid
      if (puzzleString[i] == value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // if cell filled by anything but the value itself it's an automatic invalid
    if (puzzleString[row * 9 + column] !== "." && puzzleString[row * 9 + column] != value) {
      return false;
    }
    // starting at row zero we add rows in each iteration to sweep the whole column
    for (let i = column; i < 81; i += 9) {
      // we don't check the original cell as it can contain the value itself
      if (i === row * 9 + column) continue;
      // if value already present, it's not valid
      if (puzzleString[i] == value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // if cell filled by anything but the value itself it's an automatic invalid
    if (puzzleString[row * 9 + column] !== "." && puzzleString[row * 9 + column] != value) {
      return false;
    }
    const [oRow, oCol] = [row, column];
    row = Math.floor(row / 3) * 3;
    column = Math.floor(column / 3) * 3;
    for (let i = row; i < row + 3; i++) {
      for (let j = column; j < column + 3; j++) {
        // we don't check the original cell as it can contain the value itself
        if (i * 9 + j === oRow * 9 + oCol) continue;
        // if value already present, it's not valid
        if (puzzleString[i * 9 + j] == value) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!this.validPuzzleString(puzzleString)) return false;
    const backtrack = (idx, grid) => {
      if (idx >= 81) return grid;

      const [row, col] = [Math.floor(idx / 9), idx % 9];
      for (let k = 1; k <= 9; k++) {
        if (
          this.checkRowPlacement(grid, row, col, k) &&
          this.checkColPlacement(grid, row, col, k) &&
          this.checkRegionPlacement(grid, row, col, k)
        ) {
          const res = backtrack(idx + 1, grid.substr(0, idx) + String(k) + grid.substr(idx + 1));
          if (typeof res !== "boolean") return res;
        }
      }
      return false;
    };
    const res = backtrack(0, puzzleString);
    return res;
  }
  validPuzzleString(puzzleString) {
    return /^[\d\.]{81}$/.test(puzzleString);
  }
}

module.exports = SudokuSolver;
