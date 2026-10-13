(() => {
  "use strict";

  const stages = [
    {
      id: 1,
      rows: 6,
      cols: 6,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨"],
      moves: 20,
      targetScore: 800,
      pointsPerPiece: 10,
    },
  ];

  const stage = stages[0];
  const boardElement = document.getElementById("board");
  const stageLabel = document.getElementById("stageLabel");
  const scoreLabel = document.getElementById("scoreLabel");
  const targetLabel = document.getElementById("targetLabel");
  const movesLabel = document.getElementById("movesLabel");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restartButton");
  const shuffleButton = document.getElementById("shuffleButton");

  let board = [];
  let selected = null;
  let score = 0;
  let movesLeft = stage.moves;
  let isBusy = false;
  let gameOver = false;
  let comboDepth = 0;

  function randomIcon() {
    return stage.icons[Math.floor(Math.random() * stage.icons.length)];
  }

  function makeEmptyBoard() {
    return Array.from({ length: stage.rows }, () => Array(stage.cols).fill(null));
  }

  function startGame() {
    board = makeEmptyBoard();
    selected = null;
    score = 0;
    movesLeft = stage.moves;
    isBusy = false;
    gameOver = false;
    comboDepth = 0;
    messageElement.className = "message";
    stageLabel.textContent = stage.id;
    targetLabel.textContent = stage.targetScore;

    fillBoardWithoutStartingMatches();

    // ごくまれに有効手がない盤面ができるため、最初だけ作り直す。
    let safety = 0;
    while (!hasAnyPossibleMove(board) && safety < 50) {
      fillBoardWithoutStartingMatches();
      safety += 1;
    }

    setMessage("隣同士のアイコンを入れ替えて、3つ以上そろえてね。");
    render();
  }

  function fillBoardWithoutStartingMatches() {
    for (let row = 0; row < stage.rows; row += 1) {
      for (let col = 0; col < stage.cols; col += 1) {
        let icon = randomIcon();
        let safety = 0;
        while (wouldCreateStartingMatch(row, col, icon) && safety < 50) {
          icon = randomIcon();
          safety += 1;
        }
        board[row][col] = icon;
      }
    }
  }

  function wouldCreateStartingMatch(row, col, icon) {
    const horizontal = col >= 2 && board[row][col - 1] === icon && board[row][col - 2] === icon;
    const vertical = row >= 2 && board[row - 1][col] === icon && board[row - 2][col] === icon;
    return horizontal || vertical;
  }

  function render() {
    scoreLabel.textContent = score;
    movesLabel.textContent = movesLeft;
    boardElement.style.gridTemplateColumns = `repeat(${stage.cols}, var(--cell-size))`;
    boardElement.style.gridTemplateRows = `repeat(${stage.rows}, var(--cell-size))`;
    boardElement.innerHTML = "";

    for (let row = 0; row < stage.rows; row += 1) {
      for (let col = 0; col < stage.cols; col += 1) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";
        cell.textContent = board[row][col] ?? "";
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", `${row + 1}行${col + 1}列 ${board[row][col] ?? "空"}`);
        cell.disabled = isBusy || gameOver;

        if (selected && selected.row === row && selected.col === col) {
          cell.classList.add("selected");
        }

        cell.addEventListener("click", () => handleCellClick(row, col));
        boardElement.appendChild(cell);
      }
    }

    restartButton.disabled = isBusy;
    shuffleButton.disabled = isBusy || gameOver;
  }

  async function handleCellClick(row, col) {
    if (isBusy || gameOver) return;

    if (!selected) {
      selected = { row, col };
      setMessage("もう1つ、隣のアイコンを選んでね。");
      render();
      return;
    }

    if (selected.row === row && selected.col === col) {
      selected = null;
      setMessage("選択を外したよ。隣同士を入れ替えてね。");
      render();
      return;
    }

    const first = selected;
    const second = { row, col };

    if (!areAdjacent(first, second)) {
      selected = second;
      setMessage("その子は遠いよ。隣同士で入れ替えよう。");
      render();
      return;
    }

    selected = null;
    await trySwap(first, second);
  }

  function areAdjacent(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  async function trySwap(a, b) {
    isBusy = true;
    swapCells(a, b);
    render();
    await wait(140);

    const matches = findMatches(board);
    if (matches.size === 0) {
      swapCells(a, b);
      setMessage("今の入れ替えではそろわなかったよ。元に戻すね。");
      render();
      isBusy = false;
      return;
    }

    movesLeft -= 1;
    comboDepth = 0;
    setMessage("りんっ。そろった！");
    render();
    await resolveBoard();
    checkGameState();
    isBusy = false;
    render();
  }

  function swapCells(a, b) {
    const temp = board[a.row][a.col];
    board[a.row][a.col] = board[b.row][b.col];
    board[b.row][b.col] = temp;
  }

  function findMatches(targetBoard) {
    const matched = new Set();

    for (let row = 0; row < stage.rows; row += 1) {
      let streakIcon = targetBoard[row][0];
      let streakStart = 0;
      for (let col = 1; col <= stage.cols; col += 1) {
        const current = col < stage.cols ? targetBoard[row][col] : null;
        if (current && current === streakIcon) {
          continue;
        }
        const streakLength = col - streakStart;
        if (streakIcon && streakLength >= 3) {
          for (let markCol = streakStart; markCol < col; markCol += 1) {
            matched.add(key(row, markCol));
          }
        }
        streakIcon = current;
        streakStart = col;
      }
    }

    for (let col = 0; col < stage.cols; col += 1) {
      let streakIcon = targetBoard[0][col];
      let streakStart = 0;
      for (let row = 1; row <= stage.rows; row += 1) {
        const current = row < stage.rows ? targetBoard[row][col] : null;
        if (current && current === streakIcon) {
          continue;
        }
        const streakLength = row - streakStart;
        if (streakIcon && streakLength >= 3) {
          for (let markRow = streakStart; markRow < row; markRow += 1) {
            matched.add(key(markRow, col));
          }
        }
        streakIcon = current;
        streakStart = row;
      }
    }

    return matched;
  }

  async function resolveBoard() {
    let matches = findMatches(board);

    while (matches.size > 0) {
      comboDepth += 1;
      markMatchedCells(matches);
      const gained = matches.size * stage.pointsPerPiece * comboDepth;
      score += gained;
      setMessage(comboDepth === 1 ? `りんっ！ ${matches.size}個そろったよ。+${gained}` : `連鎖りんっ！ ${matches.size}個そろったよ。+${gained}`);
      render();
      await wait(230);

      removeMatches(matches);
      collapseColumns();
      refillBoard();
      render();
      await wait(210);

      matches = findMatches(board);
    }

    if (!hasAnyPossibleMove(board) && !gameOver) {
      setMessage("動かせるところがなくなったから、畑を整えるね。");
      render();
      await wait(280);
      shuffleBoardUntilPlayable();
      render();
      await wait(160);
    }
  }

  function markMatchedCells(matches) {
    for (const item of boardElement.children) {
      const row = Number(item.dataset.row);
      const col = Number(item.dataset.col);
      if (matches.has(key(row, col))) {
        item.classList.add("matched");
      }
    }
  }

  function removeMatches(matches) {
    for (const matchKey of matches) {
      const [row, col] = matchKey.split(",").map(Number);
      board[row][col] = null;
    }
  }

  function collapseColumns() {
    for (let col = 0; col < stage.cols; col += 1) {
      const remaining = [];
      for (let row = stage.rows - 1; row >= 0; row -= 1) {
        if (board[row][col] !== null) {
          remaining.push(board[row][col]);
        }
      }
      for (let row = stage.rows - 1; row >= 0; row -= 1) {
        board[row][col] = remaining.shift() ?? null;
      }
    }
  }

  function refillBoard() {
    for (let row = 0; row < stage.rows; row += 1) {
      for (let col = 0; col < stage.cols; col += 1) {
        if (board[row][col] === null) {
          board[row][col] = randomIcon();
        }
      }
    }
  }

  function checkGameState() {
    if (score >= stage.targetScore) {
      gameOver = true;
      messageElement.className = "message win";
      setMessage("クリア！ 小庭の地下畑、今日はここまで耕せたよ。りんっ🔔");
      return;
    }

    if (movesLeft <= 0) {
      gameOver = true;
      messageElement.className = "message lose";
      setMessage("手数を使い切ったよ。もう一回、畑を整えて挑戦しよう。");
      return;
    }

    messageElement.className = "message";
    setMessage("いい感じ。次も3つ以上そろえていこう。");
  }

  function cloneBoard(targetBoard) {
    return targetBoard.map((row) => row.slice());
  }

  function hasAnyPossibleMove(targetBoard) {
    for (let row = 0; row < stage.rows; row += 1) {
      for (let col = 0; col < stage.cols; col += 1) {
        const directions = [
          { row: row + 1, col },
          { row, col: col + 1 },
        ];

        for (const next of directions) {
          if (next.row >= stage.rows || next.col >= stage.cols) continue;
          const testBoard = cloneBoard(targetBoard);
          const temp = testBoard[row][col];
          testBoard[row][col] = testBoard[next.row][next.col];
          testBoard[next.row][next.col] = temp;
          if (findMatches(testBoard).size > 0) return true;
        }
      }
    }
    return false;
  }

  function shuffleBoardUntilPlayable() {
    const pieces = board.flat();
    let safety = 0;

    do {
      shuffleArray(pieces);
      for (let row = 0; row < stage.rows; row += 1) {
        for (let col = 0; col < stage.cols; col += 1) {
          board[row][col] = pieces[row * stage.cols + col];
        }
      }
      safety += 1;
    } while ((findMatches(board).size > 0 || !hasAnyPossibleMove(board)) && safety < 200);
  }

  function shuffleArray(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }
  }

  function key(row, col) {
    return `${row},${col}`;
  }

  function setMessage(text) {
    messageElement.textContent = text;
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  restartButton.addEventListener("click", startGame);
  shuffleButton.addEventListener("click", () => {
    if (isBusy || gameOver) return;
    selected = null;
    shuffleBoardUntilPlayable();
    setMessage("畑を整えたよ。手数は減らしてないから大丈夫。");
    render();
  });

  startGame();
})();
