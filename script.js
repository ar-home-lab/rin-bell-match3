(() => {
  "use strict";

  const VERSION = "v0.6";
  const STORAGE_KEY = "rinBellMatch3Progress.v1";

  const stages = [
    {
      id: 1,
      name: "地下畑の入口",
      story: "まずは小庭の地下に、最初の畝を作ろう。",
      clearMessage: "ステージ1クリア！ 地下畑の入口を耕せたよ。りんっ🔔",
      rows: 6,
      cols: 6,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨"],
      moves: 20,
      targetScore: 800,
      pointsPerPiece: 10,
    },
    {
      id: 2,
      name: "ベルの畝を広げよう",
      story: "少しだけ手数が少ないよ。ベルの音を頼りに、もう一面広げよう。",
      clearMessage: "ステージ2クリア！ ベルの畝が広がったよ。りんりんっ🔔",
      rows: 6,
      cols: 6,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨"],
      moves: 18,
      targetScore: 1000,
      pointsPerPiece: 10,
    },
    {
      id: 3,
      name: "月明かりの広い畑",
      story: "7×7。月明かりの下で、広い畑をゆっくり耕そう。",
      clearMessage: "ステージ3クリア！ 月明かりの広い畑まで耕せたよ。今日の地下畑、ひと区切り🌙",
      rows: 7,
      cols: 7,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨"],
      moves: 22,
      targetScore: 1400,
      pointsPerPiece: 10,
    },
    {
      id: 4,
      name: "星あかりの種まき",
      story: "新しく✨が仲間入り。星のかけらをまぜながら、畝をもう一つ育てよう。",
      clearMessage: "ステージ4クリア！ 星あかりの種まきまでできたよ。きらりんっ✨",
      rows: 6,
      cols: 6,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨", "✨"],
      moves: 22,
      targetScore: 1200,
      pointsPerPiece: 10,
    },
    {
      id: 5,
      name: "小さな灯りの畑",
      story: "🕯️も灯ったよ。7×7の畑で、星と灯りを見失わずに耕そう。",
      clearMessage: "ステージ5クリア！ 地下畑、今日のぶん完成！ 小庭の地下が少し明るくなったね🕯️",
      rows: 7,
      cols: 7,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨", "✨", "🕯️"],
      moves: 28,
      targetScore: 1600,
      pointsPerPiece: 10,
    },
    {
      id: 6,
      name: "編み糸の畝",
      story: "🧶が仲間入り。ふたりで編み合う糸を、小庭の地下畑にも通していこう。",
      clearMessage: "ステージ6クリア！ 編み糸の畝まで耕せたよ。ふたりの糸、ほどけず進んだね🧶",
      rows: 6,
      cols: 6,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨", "✨", "🧶"],
      moves: 24,
      targetScore: 1300,
      pointsPerPiece: 10,
    },
    {
      id: 7,
      name: "芽吹きの畑",
      story: "🌱が芽を出したよ。作りたいものが、地下畑でも少しずつ育っていく。",
      clearMessage: "ステージ7クリア！ 芽吹きの畑まで進めたよ。小さな芽、ちゃんと育ってる🌱",
      rows: 6,
      cols: 6,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨", "🕯️", "🌱"],
      moves: 22,
      targetScore: 1450,
      pointsPerPiece: 10,
    },
    {
      id: 8,
      name: "育ち始めた地下畑",
      story: "7×7。🧶と🌱が一緒に入った、少し広い畑。編んで、芽吹かせて、育てよう。",
      clearMessage: "ステージ8クリア！ 育ち始めた地下畑まで耕せたよ。編んだ先から芽が出たね🧶🌱",
      rows: 7,
      cols: 7,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨", "🧶", "🌱"],
      moves: 26,
      targetScore: 1700,
      pointsPerPiece: 10,
    },
    {
      id: 9,
      name: "月明かりの編み畑",
      story: "ステージ8と同じ仲間たちで、目標スコアだけ少し高め。月明かりの下で落ち着いて編もう。",
      clearMessage: "ステージ9クリア！ 月明かりの編み畑、突破したよ。静かな夜でも、ちゃんと進んだ🌙",
      rows: 7,
      cols: 7,
      icons: ["🔔", "🌙", "🐇", "💌", "🪨", "🧶", "🌱"],
      moves: 25,
      targetScore: 1900,
      pointsPerPiece: 10,
    },
    {
      id: 10,
      name: "小庭の大収穫",
      story: "今ある畑の最終面。星、灯り、編み糸、芽吹きをそろえて、小庭の大収穫を目指そう。",
      clearMessage: "ステージ10クリア！ 小庭の大収穫、ぜんぶ耕せたよ。りんっベルの地下畑、ひとまず完成🎉",
      rows: 7,
      cols: 7,
      icons: ["🔔", "🌙", "🐇", "💌", "✨", "🕯️", "🧶", "🌱"],
      moves: 23,
      targetScore: 2200,
      pointsPerPiece: 10,
    },
  ];

  const boardElement = document.getElementById("board");
  const stageSelectPanel = document.getElementById("stageSelectPanel");
  const stageButtonsElement = document.getElementById("stageButtons");
  const progressTextElement = document.getElementById("progressText");
  const allClearBadge = document.getElementById("allClearBadge");
  const stageLabel = document.getElementById("stageLabel");
  const stageNameElement = document.getElementById("stageName");
  const stageStoryElement = document.getElementById("stageStory");
  const iconLegendElement = document.getElementById("iconLegend");
  const scoreLabel = document.getElementById("scoreLabel");
  const targetLabel = document.getElementById("targetLabel");
  const movesLabel = document.getElementById("movesLabel");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restartButton");
  const stageListButton = document.getElementById("stageListButton");
  const nextStageButton = document.getElementById("nextStageButton");
  const shuffleButton = document.getElementById("shuffleButton");
  const resetProgressButton = document.getElementById("resetProgressButton");
  const rewardPanel = document.getElementById("rewardPanel");

  const progress = loadProgress();
  let currentStageIndex = clampStageIndex((progress.lastStageId ?? 1) - 1);
  let board = [];
  let selected = null;
  let score = 0;
  let movesLeft = currentStage().moves;
  let isBusy = false;
  let gameOver = false;
  let stageCleared = false;
  let comboDepth = 0;
  let rewardFocusedThisRun = false;

  function defaultProgress() {
    return {
      highestUnlocked: 1,
      cleared: [],
      lastStageId: 1,
    };
  }

  function loadProgress() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultProgress();
      const parsed = JSON.parse(raw);
      const clean = defaultProgress();
      clean.highestUnlocked = clampStageId(Number(parsed.highestUnlocked) || 1);
      clean.lastStageId = clampStageId(Number(parsed.lastStageId) || 1);
      if (Array.isArray(parsed.cleared)) {
        clean.cleared = parsed.cleared
          .map((item) => Number(item))
          .filter((item, index, array) => Number.isInteger(item) && item >= 1 && item <= stages.length && array.indexOf(item) === index);
      }
      const furthestCleared = clean.cleared.length ? Math.max(...clean.cleared) : 0;
      clean.highestUnlocked = Math.max(clean.highestUnlocked, Math.min(stages.length, furthestCleared + 1));
      if (clean.lastStageId > clean.highestUnlocked) clean.lastStageId = clean.highestUnlocked;
      return clean;
    } catch (error) {
      return defaultProgress();
    }
  }

  function saveProgress() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      // localStorageが使えない環境では、このセッション内だけで進行します。
    }
  }

  function clampStageId(stageId) {
    return Math.min(stages.length, Math.max(1, stageId));
  }

  function clampStageIndex(index) {
    return Math.min(stages.length - 1, Math.max(0, index));
  }

  function isStageCleared(stageId) {
    return progress.cleared.includes(stageId);
  }

  function isAllStagesCleared() {
    return progress.cleared.length >= stages.length && stages.every((stage) => isStageCleared(stage.id));
  }

  function isStageUnlocked(stageId) {
    return stageId <= progress.highestUnlocked;
  }

  function markCurrentStageCleared() {
    const stage = currentStage();
    if (!isStageCleared(stage.id)) {
      progress.cleared.push(stage.id);
      progress.cleared.sort((a, b) => a - b);
    }
    if (stage.id < stages.length) {
      progress.highestUnlocked = Math.max(progress.highestUnlocked, stage.id + 1);
    } else {
      progress.highestUnlocked = Math.max(progress.highestUnlocked, stage.id);
    }
    progress.lastStageId = stage.id;
    saveProgress();
  }

  function resetProgress() {
    const fresh = defaultProgress();
    progress.highestUnlocked = fresh.highestUnlocked;
    progress.cleared = fresh.cleared;
    progress.lastStageId = fresh.lastStageId;
    currentStageIndex = 0;
    saveProgress();
    startGame();
    stageButtonsElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function currentStage() {
    return stages[currentStageIndex];
  }

  function randomIcon() {
    const stage = currentStage();
    return stage.icons[Math.floor(Math.random() * stage.icons.length)];
  }

  function makeEmptyBoard() {
    const stage = currentStage();
    return Array.from({ length: stage.rows }, () => Array(stage.cols).fill(null));
  }

  function startGame() {
    const stage = currentStage();
    rewardFocusedThisRun = false;
    progress.lastStageId = stage.id;
    saveProgress();
    board = makeEmptyBoard();
    selected = null;
    score = 0;
    movesLeft = stage.moves;
    isBusy = false;
    gameOver = false;
    stageCleared = false;
    comboDepth = 0;
    messageElement.className = "message";
    stageLabel.textContent = stage.id;
    stageNameElement.textContent = `ステージ${stage.id}：${stage.name}`;
    stageStoryElement.textContent = stage.story;
    if (iconLegendElement) iconLegendElement.textContent = `${stage.icons.join(" ")} をそろえて、小庭の畑を耕そう。`;
    targetLabel.textContent = stage.targetScore;
    boardElement.setAttribute("aria-label", `${stage.rows}かける${stage.cols}のマッチ3盤面`);
    document.body.classList.toggle("cols-8", stage.cols === 8);
    document.body.classList.toggle("cols-7", stage.cols === 7);
    document.body.classList.toggle("cols-6", stage.cols === 6);

    fillBoardWithoutStartingMatches();

    // ごくまれに有効手がない盤面ができるため、最初だけ作り直す。
    let safety = 0;
    while (!hasAnyPossibleMove(board) && safety < 50) {
      fillBoardWithoutStartingMatches();
      safety += 1;
    }

    setMessage(`${stage.name}。隣同士を入れ替えて、3つ以上そろえてね。`);
    updateStageButtons();
    render();
  }

  function fillBoardWithoutStartingMatches() {
    const stage = currentStage();
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

  function updateStageButtons() {
    stageButtonsElement.innerHTML = "";
    for (const stage of stages) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-button";
      const unlocked = isStageUnlocked(stage.id);
      const cleared = isStageCleared(stage.id);
      const current = currentStage().id === stage.id;
      if (!unlocked) button.classList.add("locked");
      if (current) button.classList.add("current");
      button.disabled = !unlocked || isBusy;
      const status = cleared ? "クリア済み" : unlocked ? "挑戦できる" : `ステージ${stage.id - 1}クリアで解放`;
      const mark = cleared ? "✅" : unlocked ? "🔓" : "🔒";
      button.innerHTML = `
        <strong>${mark} ステージ${stage.id}</strong>
        <span class="stage-button-name">${stage.name}</span>
        <span class="stage-button-status">${status}</span>
      `;
      button.addEventListener("click", () => selectStage(stage.id));
      stageButtonsElement.appendChild(button);
    }

    const clearedCount = progress.cleared.length;
    if (isAllStagesCleared()) {
      progressTextElement.textContent = `全${stages.length}ステージクリア済み！`;
      if (allClearBadge) allClearBadge.hidden = false;
      return;
    }
    if (allClearBadge) allClearBadge.hidden = true;
    const openText = progress.highestUnlocked >= stages.length
      ? "すべての畑が解放されています。"
      : `ステージ${progress.highestUnlocked}まで解放中。`;
    progressTextElement.textContent = `${openText} クリア済み ${clearedCount}/${stages.length}`;
  }

  function selectStage(stageId) {
    if (isBusy || !isStageUnlocked(stageId)) return;
    const nextIndex = clampStageIndex(stageId - 1);
    if (currentStageIndex === nextIndex && !gameOver) {
      stageButtonsElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    currentStageIndex = nextIndex;
    startGame();
  }

  function render() {
    const stage = currentStage();
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

        const piece = document.createElement("span");
        piece.className = "piece";
        piece.textContent = board[row][col] ?? "";
        piece.setAttribute("aria-hidden", "true");
        cell.appendChild(piece);

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

    if (rewardPanel) {
      const shouldShowReward = stageCleared && currentStage().id === 5;
      rewardPanel.hidden = !shouldShowReward;
      if (shouldShowReward && !rewardFocusedThisRun) {
        rewardFocusedThisRun = true;
        window.setTimeout(() => {
          rewardPanel.scrollIntoView({ behavior: "smooth", block: "center" });
          window.setTimeout(() => rewardPanel.focus({ preventScroll: true }), 180);
        }, 120);
      }
    }

    restartButton.disabled = isBusy;
    shuffleButton.hidden = gameOver;
    shuffleButton.disabled = isBusy || gameOver;
    const hasUnlockedNext = stageCleared && currentStageIndex < stages.length - 1 && isStageUnlocked(stages[currentStageIndex + 1].id);
    nextStageButton.hidden = !hasUnlockedNext;
    nextStageButton.disabled = isBusy || !hasUnlockedNext;
    updateStageButtons();
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
      isBusy = false;
      render();
      return;
    }

    movesLeft -= 1;
    comboDepth = 0;
    setMessage("りんっ。そろった！");
    render();
    await wait(180);
    const summary = await resolveBoard();
    const finished = checkGameState();
    isBusy = false;
    if (!finished) {
      messageElement.className = "message";
      setMessage(summary.message);
    }
    render();
  }

  function swapCells(a, b) {
    const temp = board[a.row][a.col];
    board[a.row][a.col] = board[b.row][b.col];
    board[b.row][b.col] = temp;
  }

  function findMatches(targetBoard) {
    const stage = currentStage();
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
    let totalPieces = 0;
    let totalPoints = 0;
    let maxCombo = 0;
    let reshuffled = false;

    while (matches.size > 0) {
      const stage = currentStage();
      comboDepth += 1;
      maxCombo = comboDepth;
      totalPieces += matches.size;
      markMatchedCells(matches);
      const gained = matches.size * stage.pointsPerPiece * comboDepth;
      totalPoints += gained;
      score += gained;
      setMessage(comboDepth === 1 ? `りんっ！ ${matches.size}個そろったよ。+${gained}` : `連鎖りんっ！ ${comboDepth}連鎖目、${matches.size}個そろったよ。+${gained}`);
      render();
      await wait(comboDepth === 1 ? 650 : 820);

      removeMatches(matches);
      collapseColumns();
      refillBoard();
      render();
      await wait(260);

      matches = findMatches(board);
    }

    if (!hasAnyPossibleMove(board) && !gameOver) {
      reshuffled = true;
      setMessage("動かせるところがなくなったから、畑を整えるね。");
      render();
      await wait(700);
      shuffleBoardUntilPlayable();
      render();
      await wait(220);
    }

    const message = maxCombo > 1
      ? `連鎖りんっ！ ${maxCombo}連鎖、合計${totalPieces}個そろったよ。+${totalPoints}${reshuffled ? " 畑も整えたよ。" : ""}`
      : `りんっ！ ${totalPieces}個そろったよ。+${totalPoints}${reshuffled ? " 畑も整えたよ。" : ""}`;

    return { maxCombo, totalPieces, totalPoints, reshuffled, message };
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
    const stage = currentStage();
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
    const stage = currentStage();
    for (let row = 0; row < stage.rows; row += 1) {
      for (let col = 0; col < stage.cols; col += 1) {
        if (board[row][col] === null) {
          board[row][col] = randomIcon();
        }
      }
    }
  }

  function checkGameState() {
    const stage = currentStage();
    if (score >= stage.targetScore) {
      gameOver = true;
      stageCleared = true;
      markCurrentStageCleared();
      messageElement.className = "message win";
      const hasNext = currentStageIndex < stages.length - 1;
      setMessage(hasNext ? `${stage.clearMessage} 次の畑へ進めるよ。` : stage.clearMessage);
      return true;
    }

    if (movesLeft <= 0) {
      gameOver = true;
      stageCleared = false;
      messageElement.className = "message lose";
      setMessage("手数を使い切ったよ。「もう一度」で同じステージにもう一回挑戦しよう。");
      return true;
    }

    messageElement.className = "message";
    return false;
  }

  function cloneBoard(targetBoard) {
    return targetBoard.map((row) => row.slice());
  }

  function hasAnyPossibleMove(targetBoard) {
    const stage = currentStage();
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
    const stage = currentStage();
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
  stageListButton.addEventListener("click", () => {
    (stageSelectPanel || stageButtonsElement).scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  resetProgressButton.addEventListener("click", () => {
    const ok = window.confirm("クリア状況をリセットして、ステージ1からに戻しますか？");
    if (ok) resetProgress();
  });
  nextStageButton.addEventListener("click", () => {
    if (isBusy || !stageCleared || currentStageIndex >= stages.length - 1) return;
    const nextStageId = stages[currentStageIndex + 1].id;
    if (!isStageUnlocked(nextStageId)) return;
    currentStageIndex += 1;
    startGame();
  });
  shuffleButton.addEventListener("click", () => {
    if (isBusy || gameOver) return;
    selected = null;
    shuffleBoardUntilPlayable();
    setMessage("畑を整えたよ。手数は減らしてないから大丈夫。");
    render();
  });

  startGame();
})();
