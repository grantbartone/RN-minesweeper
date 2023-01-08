import { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const NUM_MINES = 10;
const MARKED_MINE = "🚩";
const SHOWN_MINE = "💣";

const getNewBoard = () =>
  Array(BOARD_ROWS)
    .fill(null)
    .map(() => Array(BOARD_COLS).fill(null));

const getNewMines = () => {
  const mines = getNewBoard();

  for (let i = 0; i < NUM_MINES; i++) {
    let row = Math.floor(Math.random() * BOARD_ROWS);
    let col = Math.floor(Math.random() * BOARD_COLS);
    while (mines[row][col] === "X") {
      row = Math.floor(Math.random() * BOARD_ROWS);
      col = Math.floor(Math.random() * BOARD_COLS);
    }
    mines[row][col] = "X";
  }

  return mines;
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
    setMinesRemaining((prev) => (prev === NUM_MINES ? prev : prev + 1));
  };

  const decrementMinesRemaining = () => {
    setMinesRemaining((prev) => (prev === 0 ? prev : prev - 1));
  };

  const handleCellPress = (row, col) => {
    if (isGameOver()) return;

    // Reveals the mine or number of touching mines
  };

  const handleLongCellPress = (row, col) => {
    if (isGameOver()) return;

    // Marks or removes a mine
    const nextBoard = [...board];
    switch (board[row][col]) {
      case null:
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
      case "win":
        return "😎";
    }
  };

  return (
    <View style={styles.container}>
      <Text>Mines remaining: {minesRemaining}</Text>
      <View style={styles.board}>
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
    backgroundColor: "#efe3ff",
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
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
