const boxes = document.querySelectorAll(".box");
let pn1 = document.getElementById("pn1");
let pawnSelected = false;
let currentBox = "";
boxes.forEach((box) => {
  box.addEventListener("click", (e) => {
    if (pawnSelected && currentBox != box && currentBox != "") {
      currentBox.innerHTML = "";
      box.innerHTML = pn1.outerHTML;
      pawnSelected = false;
      currentBox = box;
    } else {
      currentBox = box;
    }
  });
});

pn1.addEventListener("click", (e) => {
  pawnSelected = !pawnSelected;
});
