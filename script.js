const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const newGameBtn = document.getElementById('newGameBtn');
const savePgnBtn = document.getElementById('savePgnBtn');
const flipBoardBtn = document.getElementById('flipBoardBtn');


let playerColor = 'w'; // default bianco


const game = new Chess();

let selectedSquare = null;

function flipBoard() {
  boardEl.classList.toggle('flipped');
}

function newGame() {
  game.reset();
  selectedSquare = null;
  playerColor = colorSelect.value;

  clearHighlights();
  renderPosition();
  updateStatus();

  // Se l'utente gioca nero, l'AI fa subito la prima mossa (bianco muove prima)
  if (playerColor === 'b') {
    setTimeout(makeAIMove, 300);
  }
}

function algebraic(file, rank) {
  const files = 'abcdefgh';
  return files[file - 1] + rank;
}

function createBoard() {
  boardEl.innerHTML = '';
  for(let rank=8; rank>=1; rank--) {
    for(let file=1; file<=8; file++) {
      const square = document.createElement('div');
      square.classList.add('square');
      const isLight = (file + rank) % 2 === 0;
      square.classList.add(isLight ? 'light' : 'dark');
      const sq = algebraic(file, rank);
      square.dataset.square = sq;
      square.addEventListener('click', onSquareClick);
      boardEl.appendChild(square);
    }
  }
}

function renderPosition() {
  // cancella pezzi vecchi
  document.querySelectorAll('.piece').forEach(p => p.remove());

  const boardArray = game.board();
  for(let rank=0; rank<8; rank++) {
    for(let file=0; file<8; file++) {
      const piece = boardArray[rank][file];
      if(piece !== null) {
        const squareName = algebraic(file+1, 8 - rank);
        const squareEl = boardEl.querySelector(`[data-square='${squareName}']`);
        const img = document.createElement('img');
        img.classList.add('piece');
        img.src = `pieces/${piece.color}${piece.type}.png`;
        squareEl.appendChild(img);
      }
    }
  }
}

function clearHighlights() {
  document.querySelectorAll('.square').forEach(sq => sq.classList.remove('highlight'));
}

function highlightSquare(sq) {
  clearHighlights();
  const squareEl = boardEl.querySelector(`[data-square='${sq}']`);
  if(squareEl) squareEl.classList.add('highlight');
}

function updateStatus() {
  if(game.in_checkmate()) {
    statusEl.textContent = 'Scacco matto! Hai perso!';
  } else if(game.in_draw() || game.in_stalemate() || game.insufficient_material()) {
    statusEl.textContent = 'Partita patta.';
  } else if(game.in_check()) {
    statusEl.textContent = 'Re sotto scacco!';
  } else {
    statusEl.textContent = (game.turn() === 'w') ? 'Tocca a te (Bianco).' : 'Turno AI (Nero)...';
  }
}

function onSquareClick(e) {
  if(game.game_over()) return;

  const sq = e.currentTarget.dataset.square;
  const piece = game.get(sq);

  if(selectedSquare) {
    // Provo a fare mossa
    const move = game.move({from: selectedSquare, to: sq, promotion: 'q'});
    if(move) {
      selectedSquare = null;
      clearHighlights();
      renderPosition();
      updateStatus();
      if(!game.game_over()) {
        setTimeout(makeAIMove, 300);
      }
    } else {
      // mossa non valida, reset selezione
      selectedSquare = null;
      clearHighlights();
      if(piece && piece.color === 'w') {
        selectedSquare = sq;
        highlightSquare(sq);
      }
    }
  } else {
    // seleziono se pezzo bianco
    if(piece && piece.color === 'w') {
      selectedSquare = sq;
      highlightSquare(sq);
    }
  }
} 

async function makeAIMove() {
  if (game.game_over()) return;

  try {
    const response = await fetch('https://lichess.org/api/cloud-eval', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({fen: game.fen()})
    });

    if (!response.ok) throw new Error('API non raggiungibile');

    const data = await response.json();
    const bestMove = data.bestMove; // supponendo che l'API risponda con bestMove

    if (bestMove && game.move({from: bestMove.slice(0, 2), to: bestMove.slice(2, 4), promotion: 'q'})) {
      renderPosition();
      updateStatus();
    } else {
      throw new Error('Mossa AI non valida');
    }
  } catch (error) {
    console.warn('Errore durante la chiamata AI:', error.message);
    // fallback mossa casuale
    const moves = game.moves();
    if (moves.length === 0) return;
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    game.move(randomMove);
    renderPosition();
    updateStatus();
  }
}


function savePGN() {
  const pgnData = game.pgn();
  const blob = new Blob([pgnData], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'partita.pgn';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function newGame() {
  game.reset();
  selectedSquare = null;
  clearHighlights();
  renderPosition();
  updateStatus();
}

flipBoardBtn.addEventListener('click', flipBoard);
newGameBtn.addEventListener('click', newGame);
savePgnBtn.addEventListener('click', savePGN);

createBoard();
renderPosition();
updateStatus(); 