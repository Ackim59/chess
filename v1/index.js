import { ChessBoard } from "./chessboard.js";

const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

let chessBoard = new ChessBoard();

chessBoard.initChessboard(fen);
