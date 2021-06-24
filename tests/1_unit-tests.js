const chai = require("chai");
const assert = chai.assert;

const puzzleStrings = require("../controllers/puzzle-strings").puzzlesAndSolutions;
const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  test("Handle a valid puzzle string of 81 characters", () => {
    const [puzzle, solution] = [puzzleStrings[0][0], puzzleStrings[0][1]];
    assert.equal(solver.solve(puzzle), solution);
  });

  test("Handle a puzzle string with invalid characters", () => {
    let puzzle = puzzleStrings[0][0];
    puzzle = puzzle.substr(0, 18) + "X" + puzzle.substr(18 + 1);
    assert.equal(solver.solve(puzzle), false);
  });

  test("Handle a puzzle string that is not 81 characters long", () => {
    const puzzle = puzzleStrings[0][0] + "9";
    assert.equal(solver.solve(puzzle), false);
  });

  test("Handle a valid row placement", () => {
    let puzzle = puzzleStrings[1][0];
    assert.equal(solver.checkRowPlacement(puzzle, 8, 2, 9), true);
  });

  test("Handle a invalid row placement", () => {
    let puzzle = puzzleStrings[1][0];
    assert.equal(solver.checkRowPlacement(puzzle, 1, 2, 3), false);
  });

  test("Handle a valid column placement", () => {
    let puzzle = puzzleStrings[1][0];
    assert.equal(solver.checkRowPlacement(puzzle, 0, 0, 5), true);
  });

  test("Handle a invalid column placement", () => {
    let puzzle = puzzleStrings[1][0];
    assert.equal(solver.checkRowPlacement(puzzle, 8, 8, 4), false);
  });

  test("Handle a valid region", () => {
    let puzzle = puzzleStrings[1][0];
    assert.equal(solver.checkRowPlacement(puzzle, 0, 3, 9), true);
  });

  test("Handle a invalid region placement", () => {
    let puzzle = puzzleStrings[1][0];
    assert.equal(solver.checkRowPlacement(puzzle, 0, 0, 8), false);
  });

  test("Valid puzzle strings pass the solver", () => {
    for (const puzzleComb of puzzleStrings) {
      const [puzzle, solution] = [puzzleComb[0], puzzleComb[1]];
      assert.equal(solver.solve(puzzle), solution);
    }
  });
  test("invalid puzzle strings fail the solver", () => {
    for (const puzzleComb of puzzleStrings) {
      const [puzzle, solution] = [puzzleComb[0], puzzleComb[1]];
      const idx = Math.floor(Math.random() * 81);
      assert.equal(solver.solve(puzzle.substr(0, idx) + "X" + puzzle.substr(idx + 1)), false);
    }
  });

  test("solver returns the expected solution for an incomplete puzzle", () => {
    for (const puzzleComb of puzzleStrings) {
      const [puzzle, solution] = [puzzleComb[0], puzzleComb[1]];
      assert.equal(solver.solve(puzzle), solution);
    }
  });
});
