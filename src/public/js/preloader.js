
let words = document.querySelector("#words").getAttribute("data-words");
let currentWord = 0;
let isFinished = false;
let str = '';
let wait = 100;
let classes = ["text-primary", "text-secondary"];
let timeout = null;

words = JSON.parse(words);

function hello() {

    let word = words[currentWord];
    
    if (isFinished) {
        str = word.substring(0, str.length - 1);
        wait = 100;
    } else {
        str = word.substring(0, str.length + 1);
    }

    if (str.length == word.length) {
        isFinished = true;
        wait = 1000;
    }

    if (str.length == 0) {
        isFinished = false;
        wait = 100;
    }

    if (str == '') {
        currentWord++;
    }

    if (currentWord === words.length) {
        currentWord = 0;
    }

    document.querySelector("#word").innerHTML = `<span class="${classes[currentWord]}">${str}</span>`;
    timeout = setTimeout(() => hello(), wait);
}

hello();

window.addEventListener("load", function () {
    document.querySelector("#preloader").style.display = "none";
});
