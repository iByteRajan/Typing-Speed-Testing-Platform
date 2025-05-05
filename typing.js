let timerStarted = false;
let timeLeft = 60; // seconds
let timerInterval;

let totalTypedChars = 0;
let correctChars = 0;
let typedWords = 0;

const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("WPM");
const cpmDisplay = document.getElementById("CPM");
const accuracyDisplay = document.getElementById("accuracy");

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            typingArea.blur(); // stop typing
        }
    }, 1000);
}


function updateStats() {
    const timeElapsed = 60 - timeLeft;
    const minutes = timeElapsed / 60;
  
    const wpm = minutes > 0 ? Math.round((typedWords) / minutes) : 0;
    const cpm = minutes > 0 ? Math.round(totalTypedChars / minutes) : 0;
    const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;
  
    wpmDisplay.textContent = `${wpm} WPM`;
    cpmDisplay.textContent = `${cpm} CPM`;
    accuracyDisplay.textContent = `${accuracy}%`;
  }


const str = "the quick brown fox jumps over lazy dog speed typing accuracy rhythm practice focus keyboard monitor screen challenge letter fast sunlight window clock pencil notebook dream energy motion silent active clever power always never before behind careful simple planet rocket galaxy universe orbit gravity future digital program terminal command execute random skills boost sharp brain train moment value reason system pattern logic together instant magic wonder rapid storm update create improve master vision hope memory sharpness awareness reflex thunder start finish calm steady precise victory brave courage loyal unity honest bright shadow whisper mountain river forest ocean stormy cloudy breezy summer winter monsoon rainstorm sunrise sunset sparkle shine balance harmony dreamer achiever creator thinker maker believer friend family brother sister parent teacher student captain player team school college university science fiction reality mystery thriller comedy adventure journey path road travel explore discover invent design build code debug compile test deploy network server client cloud database array string integer boolean object variable constant loop method structure solve plan idea concept imagine ancient modern virtual space star moon earth fire air water ice metal stone grass sand wind wave fog mist spell hero villain quest castle kingdom treasure secret trap puzzle lock key portal gate realm myth legend sword shield armor battle warrior archer wizard guardian champion";
const words = str.split(" ");
const typingArea = document.querySelector('.typing-area');
const para = document.querySelector(".para");
const totalWords = 290;

function formatletter(word) {
    let result = ``;
    for (let char of word) {
        result += `<span class="letter">${char}</span>`;
    }
    return result;
}

function randomWord() {
    let word = words[Math.floor(Math.random() * words.length)];
    return `<div class="word">${formatletter(word)}</div>`;
}

function insertpara() {
    let html = '';
    for (let i = 0; i < totalWords; i++) {
        html += randomWord() + " ";
    }
    para.innerHTML = html;
}

insertpara();

function addClass(ele, className) {
    return ele.classList.add(className);
}
function removeClass(ele, className) {
    return ele.classList.remove(className);
}

let firstWord = document.querySelector('.word');
let firstLetter = document.querySelector('.letter');
firstLetter.classList.add("current");
firstWord.classList.add("current");


//HANDLING THE KEYPRESS EVENTS

typingArea.addEventListener("keydown", (event) => {

    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    let keyPressed = event.key;
    let currentLetterEle = document.querySelector('.letter.current');
    let currentWordEle = document.querySelector('.word.current');
    let expectedLetter = currentLetterEle.textContent;
    // console.log("expected letter : " + expectedLetter);
    if (keyPressed === "Backspace") {
        const prevLetter = currentLetterEle.previousElementSibling;
        if (prevLetter && prevLetter.classList.contains("letter")) {        //<---------
            removeClass(currentLetterEle, "current");
            addClass(prevLetter, "current");
            removeClass(prevLetter, "correct");
            removeClass(prevLetter, "incorrect");
        }
        event.preventDefault(); // prevent default backspace behavior
        return;
    }

    // HANDLING THE SHIFT AND OTHER KEYS 
    if (keyPressed.length !== 1 && keyPressed != " ") return;

    // HANDLING THE SPACEBAR KEY EVENT
    if (keyPressed === " ") {
        const nextWord = currentWordEle.nextElementSibling;
        if (nextWord && nextWord.classList.contains("word")) {                //<--------
            removeClass(currentWordEle, "current");
            addClass(nextWord, "current");

            const firstLetter = nextWord.querySelector('.letter');
            if (firstLetter) {
                removeClass(currentLetterEle, "current");
                addClass(firstLetter, "current");
            }

            typedWords++;
        }
        event.preventDefault();
    }

    // HANDLING THE letter KEY EVENT 
    else {
        totalTypedChars++;
        if (keyPressed == expectedLetter) {
            addClass(currentLetterEle, "correct");
            correctChars++;
        }
        else {
            addClass(currentLetterEle, "incorrect");
        }
        let nextLetter = currentLetterEle.nextElementSibling;
        if (nextLetter) {
            addClass(nextLetter, "current");
            removeClass(currentLetterEle, "current");
        }
    }

    updateStats();
})
