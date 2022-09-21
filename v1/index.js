import { ChessBoard, initChessboard, actualPositionPieceList } from "./chessboard.js";

let chessBoard = new ChessBoard();

initChessboard(chessBoard,actualPositionPieceList);

let currentPiece;
let newPosition;
let otherPiece;

let pieces = chessBoard.querySelectorAll(".piece");

const getPosition = (e) => {
  const bounds = chessBoard.getBoundingClientRect()
  let positionX = Math.ceil(((e.clientX - bounds.left) / chessBoard.clientWidth) * 8);
  let positionY = Math.ceil(((chessBoard.clientHeight - (e.clientY - bounds.top)) / chessBoard.clientHeight) * 8);
  return positionX.toString() + positionY.toString();
};

chessBoard.addEventListener("click", (e) => {
  newPosition = getPosition(e);
  currentPiece.move(newPosition, otherPiece, actualPositionPieceList);
  otherPiece = undefined;
});

pieces.forEach((newPiece) => {
  newPiece.addEventListener("click", (e) => {

    if (currentPiece == undefined) {
      newPiece.selected = true;
      currentPiece = newPiece;
    } else if (currentPiece != newPiece) {
      if (!(currentPiece.color != newPiece.color && currentPiece.selected)) {
        newPiece.selected = true;
        currentPiece.selected = false;
        currentPiece = newPiece;
      } else {
        otherPiece = newPiece;
      }
    } else {
      currentPiece.selected = !currentPiece.selected
    }
  })
});