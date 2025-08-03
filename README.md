# CHESS_BOT
This is a web-based chess game where you can play against a strong AI engine.

## Features

- Play chess directly in your browser.
- Clean and simple interface with draggable pieces.
- AI powered by an online chess engine with an estimated strength of around 1600 ELO.
- Save your game as a PGN file.
- Flip the board to change the view.

## Important Notes

- Currently, **you can only play as White**.
- The AI engine is quite strong (about 1600 ELO), so expect a challenging opponent.
- If the AI engine fails to respond, the app will fallback to random moves to keep the game going.

## How to Use

- Click on a white piece to select it.
- Click on a highlighted square to move the piece.
- After your move, the AI will respond automatically.
- Use the "Flip Board" button to change your view perspective.
- Use the "New Game" button to start a fresh game.
- Use the "Save PGN" button to download your game moves in PGN format.

## Development

- Built with JavaScript and [chess.js](https://github.com/jhlywa/chess.js) for game logic.
- Uses a public online chess engine API (also lichess explorer) to power the AI moves.

## License

This project is open source and free to use.

---

Enjoy your game!  
If you want to add support for playing as Black or improve AI integration, feel free to contribute.
