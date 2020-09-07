let buttonViewGrid = document.querySelector(".btn-view-grid");
let grid = document.querySelector(".view-grid");
let buttonViewList = document.querySelector(".btn-view-list");
let list = document.querySelector(".view-list");

// para ver de forma grid
buttonViewGrid.onclick = function (e) {

    grid.classList.remove("d-none");
    list.classList.add("d-none");

    e.preventDefault();
}


// para ver de forma lista
buttonViewList.onclick = function (e) {

    grid.classList.add("d-none");
    list.classList.remove("d-none");

    e.preventDefault();
}