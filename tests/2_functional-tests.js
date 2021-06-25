const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const puzzleString = require("../controllers/puzzle-strings").puzzlesAndSolutions;
chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string", (done) => {
    const postData = { puzzle: puzzleString[0][0] };
    const solution = { solution: puzzleString[0][1] };
    chai
      .request(server)
      .post("/api/solve")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.property(resData, "solution");
        assert.propertyVal(resData, "solution", solution.solution);
        done();
      });
  });
  test("Solve a puzzle with missing puzzle string", (done) => {
    const postData = { wrongKeName: puzzleString[0][0] };
    const solution = { error: "Required field missing" };
    chai
      .request(server)
      .post("/api/solve")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.property(resData, "error");
        assert.propertyVal(resData, "error", solution.error);
        done();
      });
  });
  test("Solve a puzzle with invalid characters", (done) => {
    const postData = {
      puzzle: puzzleString[0][0].substr(0, 18) + "X" + puzzleString[0][0].substr(19),
    };
    const solution = { error: "Invalid characters in puzzle" };
    chai
      .request(server)
      .post("/api/solve")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.property(resData, "error");
        assert.propertyVal(resData, "error", solution.error);
        done();
      });
  });
  test("Solve a puzzle with incorrect length", (done) => {
    const postData = {
      puzzle: puzzleString[0][0] + "9",
    };
    const solution = { error: "Expected puzzle to be 81 characters long" };
    chai
      .request(server)
      .post("/api/solve")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.property(resData, "error");
        assert.propertyVal(resData, "error", solution.error);
        done();
      });
  });
  test("Solve a puzzle which cannot be solved", (done) => {
    const unsolvablePuzzleString =
      puzzleString[2][0].substr(0, 79) + "1" + puzzleString[2][0].substr(80);
    const postData = {
      puzzle: unsolvablePuzzleString,
    };
    const solution = { error: "Puzzle cannot be solved" };
    chai
      .request(server)
      .post("/api/solve")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.property(resData, "error");
        assert.propertyVal(resData, "error", solution.error);
        done();
      });
  });
  test("Check a puzzle placement with all fields", (done) => {
    const postData = {
      puzzle: puzzleString[4][1],
      coordinate: "I9",
      value: 1,
    };
    const solution = { valid: true };
    chai
      .request(server)
      .post("/api/check")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.property(resData, "valid");
        assert.propertyVal(resData, "valid", solution.valid);
        done();
      });
  });
  test("Check a puzzle placement with single placement conflict", (done) => {
    const postData = {
      puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "I1",
      value: 8,
    };
    const solution = { valid: false, conflict: ["column"] };
    chai
      .request(server)
      .post("/api/check")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.deepEqual(resData, solution);
        done();
      });
  });
  test("Check a puzzle placement with multiple placement conflicts", (done) => {
    const postData = {
      puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.3784.3..6..",
      coordinate: "I9",
      value: 4,
    };
    const solution = { valid: false, conflict: ["row", "column", "region"] };
    chai
      .request(server)
      .post("/api/check")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.deepEqual(resData, solution);
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts", (done) => {
    const postData = {
      puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "E6",
      value: 9,
    };
    const solution = { valid: false, conflict: ["row", "column", "region"] };
    chai
      .request(server)
      .post("/api/check")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.deepEqual(resData, solution);
        done();
      });
  });

  test("Check a puzzle placement with missing required fields", (done) => {
    const postData = {
      puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      value: 9,
    };
    const solution = { error: "Required field(s) missing" };
    chai
      .request(server)
      .post("/api/check")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.deepEqual(resData, solution);
        done();
      });
  });

  test("Check a puzzle placement with invalid characters", (done) => {
    const postData = {
      puzzle: "..9..5.1.X5.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "I8",
      value: 9,
    };
    const solution = { error: "Invalid characters in puzzle" };
    chai
      .request(server)
      .post("/api/check")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.deepEqual(resData, solution);
        done();
      });
  });

  test("Check a puzzle placement with incorrect length", (done) => {
    const postData = {
      puzzle: "..9..5.1....5.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "I8",
      value: 9,
    };
    const solution = { error: "Expected puzzle to be 81 characters long" };
    chai
      .request(server)
      .post("/api/check")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.deepEqual(resData, solution);
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinates", (done) => {
    const postData = {
      puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "X8",
      value: 9,
    };
    const solution = { error: "Invalid coordinate" };
    chai
      .request(server)
      .post("/api/check")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.deepEqual(resData, solution);
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value", (done) => {
    const postData = {
      puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "A8",
      value: 10,
    };
    const solution = { error: "Invalid value" };
    chai
      .request(server)
      .post("/api/check")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(postData)
      .end((err, res) => {
        const resData = res.body;
        assert.isObject(resData);
        assert.deepEqual(resData, solution);
        done();
      });
  });
});
