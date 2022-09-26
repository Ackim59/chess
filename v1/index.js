import { ChessBoard, initChessboard, fen } from "./chessboard.js";

let map;
let chessBoard = new ChessBoard();

map = initChessboard(chessBoard,fen);

export { map };