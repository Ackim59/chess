export { ChessBoard, Pawn, Rook, Bishop, Knight, Queen, King };



let currentPiece;
let otherPiece;

class ChessBoard extends HTMLElement {
    constructor() {
        super();
        this.fen = "";
        this.pieceCollection = {"w":[] , "b":[]};
        this.pattern = {"w":[] , "b":[]};
        this.map = {};

        const boardLayout = document.getElementById("board-layout");
        boardLayout.append(this);    
    }

    connectedCallback() {
      this.addEventListener("click", this.selection)
    }

    initChessboard = (fen) => {
      this.fen = fen;
      this.map = this.getMap();
      const fenSplitted = this.fen.split(/\/| /);
      let piece;
      for (let lin = 0; lin < 8; lin++) {
        const fenRange = fenSplitted[lin];
        let j = 0;
        let col = 1;
        let [p, r, n, b, q, k] = [1, 1, 1, 1, 1, 1];
        while (fenRange[j]) {
          const position = col.toString() + (8-lin).toString();
          const elt = fenRange[j];
            switch (elt) {
                case 'r':
                    piece = new Rook(position, "b", r);
                    this.pieceCollection.b.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(piece);
                    r += 1;
                    col += 1;
                    break;
                case 'n':
                    piece = new Knight(position, "b", n);
                    this.pieceCollection.b.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(piece);
                    n += 1
                    col += 1;
                    break;
                case 'b':
                    piece = new Bishop(position, "b", b);
                    this.pieceCollection.b.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(piece);
                    b += 1
                    col += 1;
                    break;
                case 'q':
                    piece = new Queen(position, "b", q);
                    this.pieceCollection.b.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(piece);
                    q += 1;
                    col += 1;
                    break;
                case 'k':
                    piece = new King(position, "b", k);
                    this.pieceCollection.b.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(piece);
                    k += 1
                    col += 1;
                    break;
                case 'p':
                    piece = new Pawn(position, "b", p);
                    this.pieceCollection.b.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(piece);
                    p += 1
                    col += 1;
                    break;
                case 'R':
                    piece = new Rook(position, "w", r);
                    this.pieceCollection.w.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(this.pieceCollection.w[this.pieceCollection.w.length -1]);
                    r += 1;
                    col += 1;
                    break;
                case 'N':
                    piece = new Knight(position, "w", n);
                    this.pieceCollection.w.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(this.pieceCollection.w[this.pieceCollection.w.length -1]);
                    n += 1
                    col += 1;
                    break;
                case 'B':
                    piece = new Bishop(position, "w", b);
                    this.pieceCollection.w.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(this.pieceCollection.w[this.pieceCollection.w.length -1]);
                    b += 1;
                    col += 1;
                    break;
                case 'Q':
                    piece = new Queen(position, "w", q);
                    this.pieceCollection.w.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(piece);
                    q += 1;
                    col += 1;
                    break;
                case 'K':
                    piece = new King(position, "w", k);
                    this.pieceCollection.w.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(piece);
                    k += 1;
                    col += 1;
                    break;
                case 'P':
                    piece = new Pawn(position, "w", p);
                    this.pieceCollection.w.push(piece);
                    this.pieceCollection[piece.pieceId] = piece;
                    this.appendChild(piece);
                    p += 1;
                    col += 1;
                    break;
                default:
                    col += parseInt(elt)
                }
            j += 1;
        };
      };
      this.getPattern();
    };

    selection = (e) => {
      if (currentPiece) {
        const newPosition = this.getPosition(e);
        currentPiece.move(newPosition, otherPiece);
        otherPiece = undefined;
      }
    }

    getPosition = (e) => {
      const bounds = this.getBoundingClientRect()
      let positionX = Math.ceil(((e.clientX - bounds.left) / this.clientWidth) * 8);
      let positionY = Math.ceil(((this.clientHeight - (e.clientY - bounds.top)) / this.clientHeight) * 8);
      return positionX.toString() + positionY.toString();
    };

    getPattern = () => {
      for (let color in this.pieceCollection) {
          if (!+color) {
            for (let i = 0; i < this.pieceCollection[color].length; i++) {
              const pieceId = this.pieceCollection[color][i].pieceId;
              this.pattern[pieceId] = this.pieceCollection[color][i].moveConditions(this.map);
              this.pattern[color] = this.pattern[color].concat(this.pattern[pieceId]['possible']);
          }
        }
      }
    }

    updatePattern = (piece, previousPosition, otherPiece=undefined) => {
      const newPosition = piece.position;
      const color = piece.color;
      // We update pattern of pieces for which possible positions are different after piece move.
      for (let id in this.pattern) {
        if (this.pieceCollection[id].color == color && id != "w" && id != "b" && this.pieceCollection[id] != piece) {
          if (this.pattern[id]["possible"].includes(previousPosition)
          || this.pattern[id]["possible"].includes(newPosition)
          || this.pattern[id]["blocked"].includes(previousPosition)
          || this.pattern[id]["blocked"].includes(newPosition)) {
                console.log(id);
            this.pattern[id] = this.pieceCollection[id].moveConditions(this.map);
          }
        } else if (this.pieceCollection[id] == piece) {
          this.pattern[id] = piece.moveConditions(this.map);
        }
      }
      this.pattern[color] = [];
      if (otherPiece) {
        this.pattern[otherPiece.color] = [];
        this.pattern[otherPiece.pieceId] = {"possible":[],"blocked":[]};
      }
      for (let id in this.pattern) {
        if (id != "w" && id != "b" && this.pieceCollection[id].color == color) {
          this.pattern[color] = this.pattern[color].concat(this.pattern[id]["possible"]);
        } else if (otherPiece && id != "w" && id != "b" && this.pieceCollection[id].color != color) {
          this.pattern[otherPiece.color] = this.pattern[otherPiece.color].concat(this.pattern[id]["possible"]);
        }
      }
    }

    getMap = () => {
      const fenSplitted = this.fen.split(/\/| /);
      const map = {"w":[], "b":[], "e":[]}
      for (let lin = 0; lin < 8; lin++) {
        const fenRange = fenSplitted[lin];
        let j = 0;
        let col = 1;
        while (fenRange[j]) {
            const position = col.toString() + (8-lin).toString();
            const elt = fenRange[j];
            switch (elt) {
                case 'r':
                    map.b.push(position);
                    col += 1;
                    break;
                case 'n':
                    map.b.push(position);
                    col += 1;
                    break;
                case 'b':
                    map.b.push(position);
                    col += 1;
                    break;
                case 'q':
                    map.b.push(position);
                    col += 1;
                    break;
                case 'k':
                    map.b.push(position);
                    col += 1;
                    break;
                case 'p':
                    map.b.push(position);
                    col += 1;
                    break;
                case 'R':
                    map.w.push(position);
                    col += 1;
                    break;
                case 'N':
                    map.w.push(position);
                    col += 1;
                    break;
                case 'B':
                    map.w.push(position);
                    col += 1;
                    break;
                case 'Q':
                    map.w.push(position);
                    col += 1;
                    break;
                case 'K':
                    map.w.push(position);
                    col += 1;
                    break;
                case 'P':
                    col += 1;
                    map.w.push(position);
                    break;
                default:
                    for (let i = 0; i < parseInt(elt); i++) {
                      map.e.push((col+i).toString() + (8-lin).toString())
                    }
                    col += parseInt(elt)
                }
            j += 1;
        };
      };
      return map;
    }

    updateMap = (newPosition, currentPiece, otherPiece=undefined) => {
      if (!otherPiece) {
        this.map[currentPiece.color].splice(this.map[currentPiece.color].indexOf(currentPiece.position), 1);
        this.map.e.splice(this.map.e.indexOf(newPosition), 1);
        this.map[currentPiece.color].push(newPosition), this.map.e.push(currentPiece.position);
      } else {
        this.map[currentPiece.color].splice(this.map[currentPiece.color].indexOf(currentPiece.position), 1);
        this.map[currentPiece.color].push(newPosition);
        this.map.e.push(currentPiece.position);
        this.map[otherPiece.color].splice(this.map[otherPiece.color].indexOf(newPosition), 1);
      }
    }
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
    const spot = document.createElement("div");
    const chessboard = document.getElementsByTagName("chess-board");
    spot.classList.add("spot", "square-" + pos)
    chessboard[0].appendChild(spot);
  }

  removePositionsPattern = () => {
    const spot = document.getElementsByClassName("spot");
    while (spot[0]) {
      spot[0].parentNode.removeChild(spot[0]);
    }
  }

  changeSelection = (piece) => {
    piece.selected = !piece.selected; 
  }

  selection = (e) => {
    let map = document.getElementsByTagName("chess-board")[0].map;
    this.possiblePositions = this.moveConditions(map);
    if (currentPiece != this) {
      if (currentPiece == undefined) {
        this.selected = true;
        currentPiece = this;
        currentPiece.possiblePositions["possible"].forEach(this.displayPositionsPattern);
      } else if (currentPiece.color == this.color || !currentPiece.selected) {
        currentPiece.possiblePositions["possible"].forEach(currentPiece.removePositionsPattern)
        this.selected = true;
        currentPiece = this;
        currentPiece.possiblePositions["possible"].forEach(this.displayPositionsPattern);
      } else if (currentPiece.possiblePositions["possible"].includes(e.target.position)) {
        otherPiece = this;
      } else {
        this.changeSelection(currentPiece);
        currentPiece.possiblePositions["possible"].forEach(this.removePositionsPattern);
      }
    } else {
      this.changeSelection(currentPiece);
      if (currentPiece.selected) {
        currentPiece.possiblePositions["possible"].forEach(this.displayPositionsPattern);
      } else {
        currentPiece.possiblePositions["possible"].forEach(this.removePositionsPattern);
      }
    }
  }

  changeCharacter = (c, move) => String.fromCharCode(c.charCodeAt(0) + move);

  generatePosition = (position, move) => {
    let xNewPosition = this.changeCharacter(position[0], move[0]);
    let yNewPosition = this.changeCharacter(position[1], move[1]);
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

  move = (newPosition, otherPiece) => {
    const chessboard = document.getElementsByTagName("chess-board")[0];
    const previousPosition = this.position;
    let map = chessboard.map;
    if (this.possiblePositions["possible"].includes(newPosition) && this.selected && this.position != newPosition) {
      if (map.e.includes(newPosition)) {
        chessboard.updateMap(newPosition,this);
        this.changePosition(newPosition);
        currentPiece.possiblePositions["possible"].forEach(this.removePositionsPattern)
        // mise à jour des couvertures
        chessboard.updatePattern(this, previousPosition);

      } else if (!map.e.includes(newPosition) && !map[this.color].includes(newPosition)) {
        chessboard.updateMap(newPosition,this,otherPiece)
        otherPiece.className = "element-pool"; // the captured piece is moved off the chessboard
        this.changePosition(newPosition)
        currentPiece.possiblePositions["possible"].forEach(this.removePositionsPattern)
        // mise à jour des couvertures
        chessboard.updatePattern(this, previousPosition, otherPiece);
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

  moveConditions = (map) => {
    
    const possiblePositions = {"possible":[], "blocked":[]};
    for (let i = 0; i < this.moveArray.length; i++) {
      const move = this.moveArray[i];
      let newPosition = this.generatePosition(this.position,move)
      while (map.e.includes(newPosition)) {
        possiblePositions["possible"].push(newPosition);
        newPosition = this.generatePosition(newPosition, move);
      }
      if (!map[this.color].includes(newPosition) && map.e.concat(map.w,map.b).includes(newPosition)) {
        possiblePositions["possible"].push(newPosition);
      } else if (map[this.color].includes(newPosition) && map.e.concat(map.w,map.b).includes(newPosition)) {
        possiblePositions["blocked"].push(newPosition)
      }

    }
    this.possiblePositions = possiblePositions;
    return possiblePositions;
  }
};



class Pawn extends Piece {
  constructor(position, color, pieceId) {
    super();
    this.pieceId = color + "p" + pieceId;
    this.position = position;
    this.possiblePositions = [];
    this.initialPosition = position;
    this.color = color;
    this.pieceType = this.color + "p";
    this.selected = false;
    this.classList.add("piece", this.pieceType ,"square-" + this.position);
  }

  moveConditions = (map) => {
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
    const possiblePositions = {"possible":[], "blocked":[]};
    let potentialMove = [];
    for (let i = 0; i < moveArray.length; i++) {
      const move = moveArray[i];
      potentialMove.push(this.generatePosition(this.position, move));
    }
    const isBeforeMoveAuthorized = map.e.includes(potentialMove[0]) ? true : false;
    const isLargeBeforeMoveAuthorised = (map.e.includes(potentialMove[0]) && map.e.includes(potentialMove[3])
                                         && (this.position == this.initialPosition)) ? true : false;
    const ifLeftCapturePossible = (!map.e.includes(potentialMove[1]) && !map[this.color].includes(potentialMove[1])) ? true : false;
    const isRightCapturePossible = (!map.e.includes(potentialMove[2]) && !map[this.color].includes(potentialMove[2])) ? true : false;
    if (isBeforeMoveAuthorized && map.e.concat(map.w,map.b).includes(potentialMove[0])) {
      possiblePositions["possible"].push(potentialMove[0]);
    } else if (!isBeforeMoveAuthorized && map.e.concat(map.w,map.b).includes(potentialMove[0])) {
      possiblePositions["blocked"].push(potentialMove[0])
    }
    if (isLargeBeforeMoveAuthorised && map.e.concat(map.w,map.b).includes(potentialMove[3])) {
      possiblePositions["possible"].push(potentialMove[3]);
    } else if (!isLargeBeforeMoveAuthorised && map.e.concat(map.w,map.b).includes(potentialMove[3])
               && this.position == this.initialPosition) {
      possiblePositions["blocked"].push(potentialMove[3])
    }
    if (ifLeftCapturePossible && map.e.concat(map.w,map.b).includes(potentialMove[1])) {
      possiblePositions["possible"].push(potentialMove[1]);
    }
    if (isRightCapturePossible && map.e.concat(map.w,map.b).includes(potentialMove[2])) {
      possiblePositions["possible"].push(potentialMove[2]);
    }
    this.possiblePositions = possiblePositions;
    return possiblePositions;
    }
};
customElements.define("pawn-custom", Pawn, { extends: "div" });

class Rook extends RookBishopQueen {
    constructor(position, color, pieceId) {
      super();
      this.pieceId = color + "r" + pieceId;
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
    constructor(position, color, pieceId) {
      super();
      this.pieceId = color + "b" + pieceId;
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

class Queen extends RookBishopQueen {
  constructor(position, color, pieceId) {
    super();
    this.pieceId = color + "q" + pieceId;
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

class Knight extends Piece {
    constructor(position, color, pieceId) {
      super();
      this.pieceId = color + "n" + pieceId;
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

    moveConditions = (map) => {
      const possiblePositions = {"possible":[], "blocked":[]};
      for (let i = 0; i < this.moveArray.length; i++) {
        const move = this.moveArray[i];
        let newPosition = this.generatePosition(this.position,move)
  
        if (map.e.includes(newPosition) || !map[this.color].includes(newPosition)
            && map.e.concat(map.w,map.b).includes(newPosition)) {
          possiblePositions["possible"].push(newPosition);
        } else if (map[this.color].includes(newPosition) && map.e.concat(map.w,map.b).includes(newPosition)) {
          possiblePositions["blocked"].push(newPosition);
        }
      }
      this.possiblePositions = possiblePositions;
      return possiblePositions;
    };
};
customElements.define("knight-custom", Knight, { extends: "div" });

class King extends Piece {
    constructor(position, color, pieceId) {
      super();
      this.pieceId = color + "k" + pieceId;
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

    moveConditions = (map) => {
      const possiblePositions = {"possible":[], "blocked":[]};
      for (let i = 0; i < this.moveArray.length; i++) {
        const move = this.moveArray[i];
        let newPosition = this.generatePosition(this.position,move)
  
        if (map.e.includes(newPosition) || !map[this.color].includes(newPosition)
            && map.e.concat(map.w,map.b).includes(newPosition)) {
          possiblePositions["possible"].push(newPosition);
        } else if (map[this.color].includes(newPosition) && map.e.concat(map.w,map.b).includes(newPosition)) {
          possiblePositions["blocked"].push(newPosition);
        }
      }
      this.possiblePositions = possiblePositions;
      return possiblePositions;
    };
};
customElements.define("king-custom", King, { extends: "div" });

