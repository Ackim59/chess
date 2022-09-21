const boxes = document.querySelectorAll(".box");

const xCoord = ["a", "b", "c", "d", "e", "f", "g", "h"];
const yCoord = ["1", "2", "3", "4", "5", "6", "7", "8"];

const bp1 = document.getElementById("wp1");
// const bB1 = document.getElementById("bB1");
const parent = document.getElementById("bB1").parentElement;

let pawnSelected = false;
let previousBox;

class Piece extends HTMLImageElement {
  constructor() {
    super();
    if (this.constructor == Piece) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  changeCharacter = (c, move) => String.fromCharCode(c.charCodeAt(0) + move);

  generatePosition = (xPosition, xMove, yPosition, yMove) => {
    let xNewPosition = this.changeCharacter(xPosition, xMove);
    let yNewPosition = this.changeCharacter(yPosition, yMove);
    return xNewPosition + yNewPosition;
  };
}

class Bishop extends Piece {
  constructor(position, color, id) {
    super();
    this.src = "bishop.png";
    this.classList.add("piece");
    this.position = position;
    this.color = color;
    this.id = color[0] + "B" + id;
    this.selected = false;

    this.addEventListener("pieceSelection", (e) => {
      this.selected = e.detail.selection;
    });
  }

  selectPiece = (selected) => {
    const event = new CustomEvent("pieceSelection", {
      detail: {
        selection: !selected,
      },
    });

    bishop.dispatchEvent(event);
  };

  moveConditions = () => {
    let moveArray = [
      [1, 1],
      [1, -1],
      [-1, -1],
      [-1, 1],
    ];
    const newPossiblePositions = [];

    for (let i = 0; i < 4; i++) {
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
      while (xCoord.includes(xPosition) && yCoord.includes(yPosition)) {
        newPossiblePositions.push(newPosition);
        newPosition = this.generatePosition(xPosition, xMove, yPosition, yMove);
        xPosition = newPosition[0];
        yPosition = newPosition[1];
      }
    }
    return newPossiblePositions;
  };

  move = (nextBox) => {
    let currentBox = document.getElementById(this.position);
    //   const currentPosition = this.position;
    //   const newPosition = nextBox.getAttribute("id");
    const newPosition = nextBox.id;
    const possibleNewPositions = this.moveConditions();

    // if (newPossiblePositions.includes(newPosition)) {
    //   if (checkPiecePresence(nextBox)) {
    //     const otherPiece = nextBox.childNodes[1];
    //     const otherColor = getPieceColor(otherPiece);
    //     if (this.color != otherColor) {
    //       nextBox.removeChild(otherPiece);
    //     }
    //   }
    if (
      this.position != nextBox.id &&
      possibleNewPositions.includes(newPosition)
    ) {
      currentBox.removeChild(this);
      nextBox.appendChild(this);
      this.position = newPosition;
      this.selected = false;
    }
  };
}
customElements.define("bishop-custom", Bishop, { extends: "img" });

let bishop = new Bishop((position = "b2"), (color = "black"), (id = "2"));
elt = document.getElementById("b2");
elt2 = document.getElementById("b3");
elt.appendChild(bishop);

bishop.addEventListener("click", (e) => {
  bishop.selectPiece(bishop.selected);
  console.log(bishop.selected);
});

ChessBoard.forEach((box) => {
  box.addEventListener("click", (e) => {
    if (bishop.selected) {
      console.log(previousBox);
      console.log(box);
      bishop.move(box);
    }
  });
});

// let changeCharacter = (c, move) => String.fromCharCode(c.charCodeAt(0) + move);

// let generatePosition = (xPosition, xMove, yPosition, yMove) => {
//   let xNewPosition = changeCharacter(xPosition, xMove);
//   let yNewPosition = changeCharacter(yPosition, yMove);
//   return xNewPosition + yNewPosition;
// };

// let checkPiecePresence = (box) => (box.firstChild != null ? true : false);

// let getPieceColor = (piece) =>
//   piece.getAttribute("id")[0] === "b" ? "black" : "white";

// let moveBishopConditions = (piece, currentPosition) => {
//   let moveArray = [
//     [1, 1],
//     [1, -1],
//     [-1, -1],
//     [-1, 1],
//   ];
//   const newPossiblePositions = [];
//   const currentColor = getPieceColor(piece);

//   for (let i = 0; i < 4; i++) {
//     const xMove = moveArray[i][0];
//     const yMove = moveArray[i][1];
//     let position = generatePosition(
//       currentPosition[0],
//       xMove,
//       currentPosition[1],
//       yMove
//     );
//     let xPosition = position[0];
//     let yPosition = position[1];
//     while (xCoord.includes(xPosition) && yCoord.includes(yPosition)) {
//       const boxPosition = document.getElementById(position);

//       if (checkPiecePresence(boxPosition)) {
//         const otherPiece = boxPosition.childNodes[1];
//         const otherColor = getPieceColor(otherPiece);

//         if (currentColor != otherColor) {
//           newPossiblePositions.push(position);
//           position = generatePosition(xPosition, xMove, yPosition, yMove);
//           xPosition = position[0];
//           yPosition = position[1];
//         }
//         break;
//       } else {
//         newPossiblePositions.push(position);
//         position = generatePosition(xPosition, xMove, yPosition, yMove);
//         xPosition = position[0];
//         yPosition = position[1];
//       }
//     }
//   }

//   return newPossiblePositions;
// };

// let move = (piece, previousBox, box) => {
//   const currentPosition = previousBox.getAttribute("id");
//   const newPosition = box.getAttribute("id");
//   const currentColor = getPieceColor(piece);

//   newPossiblePositions = moveBishopConditions(piece, currentPosition);

//   if (newPossiblePositions.includes(newPosition)) {
//     if (checkPiecePresence(box)) {
//       const otherPiece = box.childNodes[1];
//       const otherColor = getPieceColor(otherPiece);
//       if (currentColor != otherColor) {
//         box.removeChild(otherPiece);
//       }
//     }
//     previousBox.removeChild(piece);
//     box.appendChild(piece);
//     previousBox.innerHTML = null;
//   }
// };

// boxes.forEach((box) => {
//   box.addEventListener("click", (e) => {
//     if (pawnSelected && previousBox != box && previousBox.firstChild != null) {
//       move(bB1, previousBox, box);
//       pawnSelected = false;
//       previousBox = box;
//     } else {
//       previousBox = box;
//     }
//   });
// });

// bB1.addEventListener("click", (e) => {
//   position = document.getElementById("bB1").parentElement.id;
//   previousBox = document.getElementById(position);
//   pawnSelected = !pawnSelected;
// });
