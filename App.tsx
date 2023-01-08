import { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const NUM_MINES = 10;
const MINE = "X";
const MARKED_MINE = "🚩";
const EXPLODED_MINE = "💥";
const OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const getNewBoard = () =>
  Array(BOARD_ROWS)
    .fill(null)
    .map(() => Array(BOARD_COLS).fill(null));

const getNewMines = () => {
  const mines = getNewBoard();

  for (let i = 0; i < NUM_MINES; i++) {
    let row = Math.floor(Math.random() * BOARD_ROWS);
    let col = Math.floor(Math.random() * BOARD_COLS);
    while (mines[row][col] === MINE) {
      row = Math.floor(Math.random() * BOARD_ROWS);
      col = Math.floor(Math.random() * BOARD_COLS);
    }
    mines[row][col] = MINE;
  }

  return mines;
};

const isInbounds = (row, col) => {
  if (row < 0 || row >= BOARD_ROWS) return false;
  if (col < 0 || col >= BOARD_COLS) return false;
  return true;
};

export default function App() {
  const [board, setBoard] = useState(getNewBoard());
  const [mines, setMines] = useState(getNewMines());
  const [gameStatus, setGameStatus] = useState<"ongoing" | "win" | "lose">(
    "ongoing"
  );
  const [minesRemaining, setMinesRemaining] = useState(NUM_MINES);

  const isGameOver = () => gameStatus !== "ongoing";

  const toggleNewGame = () => {
    setGameStatus("ongoing");
    setBoard(getNewBoard());
    setMines(getNewMines());
    setMinesRemaining(NUM_MINES);
  };

  const incrementMinesRemaining = () => {
    setMinesRemaining((prev) => prev + 1);
  };

  const decrementMinesRemaining = () => {
    setMinesRemaining((prev) => prev - 1);
  };

  const getNumAdjacentMines = (row, col) => {
    let count = 0;
    for (const [offsetX, offsetY] of OFFSETS) {
      if (
        isInbounds(row + offsetX, col + offsetY) &&
        mines[row + offsetX][col + offsetY] === MINE
      ) {
        count += 1;
      }
    }
    return count;
  };

  const handleCellPress = (row, col) => {
    if (isGameOver()) return;
    if (mines[row][col] === MARKED_MINE) return;

    if (mines[row][col] === MINE) {
      const nextBoard = [...board];
      nextBoard[row][col] = EXPLODED_MINE;
      setBoard(nextBoard);
      setGameStatus("lose");
      return;
    }

    // Reveals the mine or number of touching mines
    const nextBoard = [...board];
    nextBoard[row][col] = getNumAdjacentMines(row, col);
    setBoard(nextBoard);
  };

  const handleLongCellPress = (row, col) => {
    if (isGameOver()) return;

    // Marks or removes a mine
    const nextBoard = [...board];
    switch (board[row][col]) {
      case null:
        if (minesRemaining === 0) return;
        nextBoard[row][col] = MARKED_MINE;
        decrementMinesRemaining();
        break;
      case MARKED_MINE:
        nextBoard[row][col] = null;
        incrementMinesRemaining();
    }
    setBoard(nextBoard);
  };

  const renderGameEmoji = () => {
    switch (gameStatus) {
      case "ongoing":
        return "😊";
      case "lose":
        return "😢";
      case "win": // TODO: add method to calculate 'win' gameStatus
        return "😎";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <View style={styles.minesRemaining}>
          <Text style={styles.minesRemainingText}>{minesRemaining}</Text>
        </View>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleNewGame}>
            <Text style={styles.newGameButton}>{renderGameEmoji()}</Text>
          </TouchableOpacity>
        </View>
        {board.map((rows, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {rows.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.cell}
                onPress={() => handleCellPress(rowIndex, colIndex)}
                onLongPress={() => handleLongCellPress(rowIndex, colIndex)}
              >
                <Text>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#efe3ff",
  },
  board: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#f0e7f5",
    borderWidth: 3,
    borderColor: "#a046e8",
    borderRadius: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  minesRemaining: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    top: 12,
    left: 8,
    backgroundColor: "#f6b1e3",
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "#f48ad7",
  },
  minesRemainingText: { fontSize: 20, fontWeight: "bold", color: "white" },
  newGameButton: { fontSize: 35 },
  row: { flexDirection: "row" },
  cell: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    margin: 3,
    borderWidth: 1,
    borderColor: "#a046e8",
  },
});
