"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

const ROW_TO_NUM = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8 };
module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    if (
      req.body.puzzle === undefined ||
      req.body.coordinate === undefined ||
      req.body.value === undefined
    ) {
      return res.json({ error: "Required field(s) missing" });
    }
    const puzzle = req.body.puzzle;
    const [row, col] = [req.body.coordinate[0], req.body.coordinate[1]];
    const value = req.body.value;
    if (
      row.toLowerCase().charCodeAt(0) < "a".charCodeAt(0) ||
      row.toLowerCase().charCodeAt(0) > "i".charCodeAt(0) ||
      Number.isNaN(Number(col)) ||
      Number(col) < 1 ||
      Number(col) > 9
    ) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (Number.isNaN(Number(value)) || Number(value) < 1 || Number(value) > 9) {
      return res.json({ error: "Invalid value" });
    }
    if (invalidChars(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    const rowStat = solver.checkRowPlacement(puzzle, ROW_TO_NUM[row], col - 1, value);
    const colStat = solver.checkColPlacement(puzzle, ROW_TO_NUM[row], col - 1, value);
    const regionStat = solver.checkRegionPlacement(puzzle, ROW_TO_NUM[row], col - 1, value);

    if (!rowStat || !colStat || !regionStat) {
      const conflict = [];
      if (!rowStat) conflict.push("row");
      if (!colStat) conflict.push("column");
      if (!regionStat) conflict.push("region");
      return res.json({ valid: false, conflict });
    } else {
      return res.json({ valid: true });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }
    if (invalidChars(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }
    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }
    const result = solver.solve(puzzle);
    if (!result) {
      return res.json({ error: "Puzzle cannot be solved" });
    }
    return res.json({ solution: result });
  });
};

const invalidChars = (puzzle) => {
  if (/[^1-9\.]+/.test(puzzle)) return true;
  return false;
};
