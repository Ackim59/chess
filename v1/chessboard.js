export { ChessBoard, Pawn, Rook, Bishop, Knight, Queen, King, initChessboard,
         fen };
import { map } from "./index.js";

const pieceList = ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br",
"bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp",
"wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp",
"wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr",
];
const initialPositionList = ["18", "28", "38", "48", "58", "68", "78", "88",
          "17", "27", "37", "47", "57", "67", "77", "87",
          "12", "22", "32", "42", "52", "62", "72", "82",
          "11", "21", "31", "41", "51", "61", "71", "81",
          ];

const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

let currentPiece;
let otherPiece;
let actualPositionPieceList = [pieceList, initialPositionList].reduce((a, b) => a.map((v, i) => v + '-' + b[i]));


class ChessBoard extends HTMLElement {
    constructor() {
        super();
        const boardLayout = document.getElementById("board-layout");
        boardLayout.append(this);    
    }

    connectedCallback() {
      this.addEventListener("click", this.selection)
    }

    selection = (e) => {
      if (currentPiece) {
        const newPosition = this.getPosition(e);
        currentPiece.move(newPosition, otherPiece, actualPositionPieceList);
        otherPiece = undefined;
      }
    }

    getPosition = (e) => {
      const bounds = this.getBoundingClientRect()
      let positionX = Math.ceil(((e.clientX - bounds.left) / this.clientWidth) * 8);
      let positionY = Math.ceil(((this.clientHeight - (e.clientY - bounds.top)) / this.clientHeight) * 8);
      return positionX.toString() + positionY.toString();
    };

};
customElements.define("chess-board", ChessBoard);

class Piece extends HTMLDivElement {
  constructor() {
    super();
    if (this.constructor == Piece) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  connectedCallback() {
    this.addEventListener("click", this.selection);
  }

  displayPositionsPattern = (pos) => {
    const elt = document.createElement("div");
    const chessboard = document.getElementsByTagName("chess-board");
    elt.classList.add("spot", "square-" + pos)
    chessboard[0].appendChild(elt);
  }

  removePositionsPattern = () => {
    const shine = document.getElementsByClassName("spot");
    while (shine[0]) {
      shine[0].parentNode.removeChild(shine[0]);
    }
  }

  changeSelection = (piece) => {
    piece.selected = !piece.selected; 
  }

  selection = (e) => {
    this.possiblePositions = this.moveConditions(actualPositionPieceList);
    if (currentPiece != this) {
      if (currentPiece == undefined) {
        currentPiece = this;
        this.changeSelection(currentPiece);
        currentPiece.possiblePositions.forEach(this.displayPositionsPattern);
      } else if (currentPiece.color == this.color || !currentPiece.selected) {
        currentPiece.possiblePositions.forEach(this.removePositionsPattern)
        currentPiece = this;
        this.changeSelection(currentPiece);
        currentPiece.possiblePositions.forEach(this.displayPositionsPattern);
      } else if (currentPiece.possiblePositions.includes(e.target.position)) {
        otherPiece = this;
      } else {
        this.changeSelection(currentPiece);
        currentPiece.possiblePositions.forEach(this.removePositionsPattern);
      }
    } else {
      this.changeSelection(currentPiece);
      if (currentPiece.selected) {
        currentPiece.possiblePositions.forEach(this.displayPositionsPattern);
      } else {
        currentPiece.possiblePositions.forEach(this.removePositionsPattern);
      }
    }
  }

  changeCharacter = (c, move) => String.fromCharCode(c.charCodeAt(0) + move);

  generatePosition = (xPosition, xMove, yPosition, yMove) => {
    let xNewPosition = this.changeCharacter(xPosition, xMove);
    let yNewPosition = this.changeCharacter(yPosition, yMove);
    return xNewPosition + yNewPosition;
  };
  
  changePosition = (newPosition) => {
    for (let i = 0; i < this.classList.length; i++) {
      if (this.classList.value.includes("square")) {
        this.classList.remove("square-" + this.position)
        this.classList.add("square-" + newPosition)
      };
    this.position = newPosition;
    this.selected = false;
    }
  }
  
  moveConditions = (actualPositionPieceList) => {};

  move = (newPosition, otherPiece, actualPositionPieceList) => {
    const possiblePositions = this.moveConditions(actualPositionPieceList)
    const indexActualPosition = actualPositionPieceList.indexOf(this.pieceType + "-" + this.position);
    if (possiblePositions.includes(newPosition)) {
      if (this.selected && this.position != newPosition) {
        if (!otherPiece) {
          this.changePosition(newPosition)
          currentPiece.possiblePositions.forEach(this.removePositionsPattern)
          actualPositionPieceList[indexActualPosition] = this.pieceType + "-" + this.position;
        } else {
          const indexOtherPosition = actualPositionPieceList.indexOf(otherPiece.pieceType + "-" + otherPiece.position);
          otherPiece.className = "element-pool";
          this.changePosition(newPosition)
          currentPiece.possiblePositions.forEach(this.removePositionsPattern)
          actualPositionPieceList[indexActualPosition] = this.pieceType + "-" + this.position;
          actualPositionPieceList.splice(indexOtherPosition,1)
        }
      }
    }
  };
};

class RookBishopQueen extends Piece {
  constructor() {
    super();
    if (this.constructor == Piece) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  moveConditions = (actualPositionPieceList) => {

    let coord = ["1", "2", "3", "4", "5", "6", "7", "8"]
    const possiblePositions = [];
    
    for (let i = 0; i < this.moveArray.length; i++) {
      
      const xMove = this.moveArray[i][0];
      const yMove = this.moveArray[i][1];
      let newPosition = this.generatePosition(
        this.position[0],
        xMove,
        this.position[1],
        yMove
      );
      let xPosition = newPosition[0];
      let yPosition = newPosition[1];
      let isPiece = actualPositionPieceList.find(elt => elt.includes(newPosition));
      let areDifferentColor;
      if (isPiece) {
        areDifferentColor = isPiece[0] != this.color;
      } else {
        areDifferentColor = true;
      }

      while (coord.includes(xPosition) && coord.includes(yPosition) && !isPiece) {
          possiblePositions.push(newPosition);
          newPosition = this.generatePosition(xPosition, xMove, yPosition, yMove);
          isPiece = actualPositionPieceList.find(elt => elt.includes(newPosition))
          if (isPiece) {
            areDifferentColor = isPiece[0] != this.color;
          } else {
            areDifferentColor = true;
          }
          xPosition = newPosition[0];
          yPosition = newPosition[1];
      }
      if (isPiece && areDifferentColor) {
        possiblePositions.push(newPosition);
      }

    }
    this.possiblePositions = possiblePositions;
    return possiblePositions;
  }
};

class KnightKing extends Piece {
  constructor() {
    super();
    if (this.constructor == Piece) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  moveConditions = (actualPositionPieceList) => {
    let coord = ["1", "2", "3", "4", "5", "6", "7", "8"]
    const possiblePositions = [];
    for (let i = 0; i < this.moveArray.length; i++) {
      const xMove = this.moveArray[i][0];
      const yMove = this.moveArray[i][1];
      let newPosition = this.generatePosition(
        this.position[0],
        xMove,
        this.position[1],
        yMove
      );
      let xPosition = newPosition[0];
      let yPosition = newPosition[1];
      let isPiece = actualPositionPieceList.find(elt => elt.includes(newPosition));
      let areDifferentColor;
      if (isPiece) {
        areDifferentColor = isPiece[0] != this.color;
      } else {
        areDifferentColor = true;
      }
      if (coord.includes(xPosition) && coord.includes(yPosition) && !isPiece) {
        possiblePositions.push(newPosition);
        newPosition = this.generatePosition(xPosition, xMove, yPosition, yMove);
        xPosition = newPosition[0];
        yPosition = newPosition[1];

      } else if (isPiece && areDifferentColor) {
        possiblePositions.push(newPosition);
      }
    }
    this.possiblePositions = possiblePositions;
    return possiblePositions;

  };
};

class Pawn extends Piece {
  constructor(position, color) {
    super();
    this.position = position;
    this.possiblePositions = [];
    this.initialPosition = position;
    this.color = color;
    this.pieceType = this.color + "p";
    this.selected = false;
    this.classList.add("piece", this.pieceType ,"square-" + this.position);
  }

  moveConditions = (actualPositionPieceList) => {
    let moveArray;
    if (this.color == "w") {
      moveArray = [
        [0, 1],
        [-1, 1],
        [1, 1],
        [0, 2],
      ];
    } else {
      moveArray = [
        [0, -1],
        [1, -1],
        [-1, -1],
        [0, -2],
      ];   
    }
    let coord = ["1", "2", "3", "4", "5", "6", "7", "8"]
    const possiblePositions = [];
    const isInitialMove = this.position == this.initialPosition;
    const leftPiecePosition = this.generatePosition(this.position[0], moveArray[1][0], this.position[1], moveArray[1][1]);
    const rightPiecePosition = this.generatePosition(this.position[0], moveArray[2][0], this.position[1], moveArray[2][1]);
    const beforePiecePosition = this.generatePosition(this.position[0], moveArray[0][0], this.position[1], moveArray[0][1]);
    const leftPiece = actualPositionPieceList.find(elt => elt.includes(leftPiecePosition));
    const rightPiece = actualPositionPieceList.find(elt => elt.includes(rightPiecePosition));
    const beforePiece = actualPositionPieceList.find(elt => elt.includes(beforePiecePosition));
    let isLeftPiece;
    let isRightPiece;
    let isBeforePiece;
    if (leftPiece) {
      isLeftPiece = leftPiece[0] != this.color;
    }
    if (rightPiece) {
      isRightPiece = rightPiece[0] != this.color;
    }
    if (beforePiece) {
      isBeforePiece = true;
    }

    if (!isLeftPiece && !isRightPiece) {
      moveArray.splice(1,2);
    } else if (!isLeftPiece) {
      moveArray.splice(1,1);
    } else if (!isRightPiece) {
      moveArray.splice(2,1);
    }
    if (isBeforePiece) {
      moveArray.splice(0,1);
    }

    if (!isInitialMove || isBeforePiece) {
      moveArray.splice(-1);
    }
      for (let i = 0; i < moveArray.length; i++) {
        const xMove = moveArray[i][0];
        const yMove = moveArray[i][1];
        let newPosition = this.generatePosition(
          this.position[0],
          xMove,
          this.position[1],
          yMove
        );
        let xPosition = newPosition[0];
        let yPosition = newPosition[1];
        if (coord.includes(xPosition) && coord.includes(yPosition) ) {
          possiblePositions.push(newPosition);
          newPosition = this.generatePosition(xPosition, xMove, yPosition, yMove);
          xPosition = newPosition[0];
          yPosition = newPosition[1];
        }
      }
    this.possiblePositions = possiblePositions;
    return possiblePositions;
  };
};
customElements.define("pawn-custom", Pawn, { extends: "div" });

class Rook extends RookBishopQueen {
    constructor(position, color) {
      super();
      this.position = position;
      this.possiblePositions = [];
      this.color = color;
      this.pieceType = this.color + "r";
      this.selected = false;
      this.moveArray = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]; 
      this.classList.add("piece", this.pieceType ,"square-" + this.position);
    }
};
customElements.define("rook-custom", Rook, { extends: "div" });

class Bishop extends RookBishopQueen {
    constructor(position, color) {
      super();
      this.position = position;
      this.possiblePositions = [];
      this.color = color;
      this.pieceType = this.color + "b"
      this.selected = false;
      this.moveArray = [
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1],
      ]; 
      this.classList.add("piece", this.pieceType ,"square-" + this.position)
    }
};
customElements.define("bishop-custom", Bishop, { extends: "div" });

class Knight extends KnightKing {
    constructor(position, color) {
      super();
      this.position = position;
      this.possiblePositions = [];
      this.color = color;
      this.pieceType = this.color + "n"
      this.selected = false;
      this.moveArray = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
      ];
      this.classList.add("piece", this.pieceType ,"square-" + this.position)
    }
};
customElements.define("knight-custom", Knight, { extends: "div" });

class Queen extends RookBishopQueen {
    constructor(position, color) {
      super();
      this.position = position;
      this.possiblePositions = [];
      this.color = color;
      this.pieceType = this.color + "q"
      this.selected = false;
      this.moveArray = [
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      this.classList.add("piece", this.pieceType ,"square-" + this.position)
    }
};
customElements.define("queen-custom", Queen, { extends: "div" });

class King extends KnightKing {
    constructor(position, color) {
      super();
      this.position = position;
      this.possiblePositions = [];
      this.color = color;
      this.pieceType = this.color + "k"
      this.selected = false;
      this.moveArray = [
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      this.classList.add("piece", this.pieceType ,"square-" + this.position)
    }
};
customElements.define("king-custom", King, { extends: "div" });

const initChessboard = (chessBoard, fen) => {
  const fenSplitted = fen.split(/\/| /);
  const map = {"w":[], "b":[]}
  for (let i = 0; i < 8; i++) {
    const fenRange = fenSplitted[i];
    let j = 0;
    let p = 1;
    while (fenRange[j]) {
        const position = p.toString() + (8-i).toString();
        const elt = fenRange[j];
        switch (elt) {
            case 'r':
                chessBoard.appendChild(new Rook(position, "b"));
                map.b.push(position);
                p += 1;
                break;
            case 'n':
                chessBoard.appendChild(new Knight(position, "b"));
                map.b.push(position);
                p += 1;
                break;
            case 'b':
                chessBoard.appendChild(new Bishop(position, "b"));
                map.b.push(position);
                p += 1;
                break;
            case 'q':
                chessBoard.appendChild(new Queen(position, "b"));
                map.b.push(position);
                p += 1;
                break;
            case 'k':
                chessBoard.appendChild(new King(position, "b"));
                map.b.push(position);
                p += 1;
                break;
            case 'p':
                chessBoard.appendChild(new Pawn(position, "b"));
                map.b.push(position);
                p += 1;
                break;
            case 'R':
                chessBoard.appendChild(new Rook(position, "w"));
                map.w.push(position);
                p += 1;
                break;
            case 'N':
                chessBoard.appendChild(new Knight(position, "w"));
                map.w.push(position);
                p += 1;
                break;
            case 'B':
                chessBoard.appendChild(new Bishop(position, "w"));
                map.w.push(position);
                p += 1;
                break;
            case 'Q':
                chessBoard.appendChild(new Queen(position, "w"));
                map.w.push(position);
                p += 1;
                break;
            case 'K':
                chessBoard.appendChild(new King(position, "w"));
                map.w.push(position);
                p += 1;
                break;
            case 'P':
                p += 1;
                chessBoard.appendChild(new Pawn(position, "w"));
                map.w.push(position);
                break;
            default:
                p += parseInt(elt)
            }
        j += 1;
    };
  };
  return map;
};

