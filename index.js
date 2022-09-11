const boxes = document.querySelectorAll(".box");
let pn1 = document.getElementById("pn1");
let pawnSelected = false;
let previousBox = "";

boxes.forEach((box) => {
  box.addEventListener("click", (e) => {
    console.log(previousBox.firstChild);
    if (
      pawnSelected &&
      previousBox != box &&
      previousBox != "" &&
      previousBox.firstChild != null
    ) {
      console.log(pawnSelected);
      previousBox.innerHTML = "";
      box.innerHTML = pn1.outerHTML;
      pawnSelected = false;
      previousBox = box;
    } else {
      previousBox = box;
    }
  });
});

pn1.addEventListener("click", (e) => {
  pawnSelected = !pawnSelected;
});
