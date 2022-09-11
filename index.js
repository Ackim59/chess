const boxes = document.querySelectorAll(".box");
let previousBox;
let currentBox;
let isBlack;

boxes.forEach((box) => {
  box.addEventListener("click", (e) => {
    if (previousBox) {
      if (isBlack) {
        previousBox.style.setProperty("background-color", "#8b4513");
      } else {
        previousBox.style.setProperty("background-color", "#ffe4c4");
      }
    }
    currentBox = e.target;
    isBlack = currentBox.classList.value.split(" ").includes("black");
    currentBox.style.setProperty("--bgc", "#f4a460");
    previousBox = currentBox;
  });
});
