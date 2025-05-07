let timerStarted = false;
let timerExpired = false;
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
            timerExpired = true;
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
var words = str.split(" ");
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

function addClass(el, className) {              //<<<<<<<<<<
    if (el) el.classList.add(className);
}

function removeClass(el, className) {
    if (el) el.classList.remove(className);
}                                                //>>>>>>>>>>>


let firstWord = document.querySelector('.word');
let firstLetter = document.querySelector('.letter');
firstLetter.classList.add("current");
firstWord.classList.add("current");


//HANDLING THE KEYPRESS EVENTS
typingArea.addEventListener("keydown", (event) => {
    if (timerExpired) {
        event.preventDefault();
        return;
    }

    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    let keyPressed = event.key;
    let currentLetterEle = document.querySelector('.letter.current');
    let currentWordEle = document.querySelector('.word.current');

    if (!currentLetterEle || !currentWordEle) return;                   //<-------                       //<<<<

    let expectedLetter = currentLetterEle.textContent;                      //<<<<<

    // BACKSPACE handling
    if (keyPressed === "Backspace") {                   
        event.preventDefault();

        if (currentLetterEle.classList.contains("correct") || currentLetterEle.classList.contains("incorrect")) {
            removeClass(currentLetterEle, "correct");
            removeClass(currentLetterEle, "incorrect");
            return;
        }

        let prevLetter = currentLetterEle.previousElementSibling;

        if (prevLetter) {
            removeClass(currentLetterEle, "current");
            addClass(prevLetter, "current");
            removeClass(prevLetter, "correct");
            removeClass(prevLetter, "incorrect");
        } else {
            const prevWord = currentWordEle.previousElementSibling;
            if (prevWord && prevWord.classList.contains("word")) {
                const prevLetters = prevWord.querySelectorAll(".letter");
                const lastLetter = prevLetters[prevLetters.length - 1];

                removeClass(currentLetterEle, "current");
                addClass(lastLetter, "current");

                removeClass(currentWordEle, "current");
                addClass(prevWord, "current");

                removeClass(lastLetter, "correct");
                removeClass(lastLetter, "incorrect");
            }
        }
        return;
    }

    // IGNORE shift, ctrl, alt, capslock, etc.
    if (keyPressed.length !== 1 && keyPressed !== " ") return;

    // SPACEBAR handling
    if (keyPressed === " ") {
        event.preventDefault();

        const nextWord = currentWordEle.nextElementSibling;
        if (nextWord && nextWord.classList.contains("word")) {
            removeClass(currentWordEle, "current");
            addClass(nextWord, "current");

            const firstLetter = nextWord.querySelector(".letter");
            if (firstLetter) {
                removeClass(currentLetterEle, "current");
                addClass(firstLetter, "current");
            }
            typedWords++;
        }
        return;
    }

    // LETTER typing logic
    totalTypedChars++;
    if (keyPressed === expectedLetter) {
        if(!currentLetterEle.classList.contains('incorrect')){
            addClass(currentLetterEle, "correct");
            correctChars++;
        }
    } else {
        if(!currentLetterEle.classList.contains('correct')){
            addClass(currentLetterEle, "incorrect");
        }
    }

    // Move to next letter
    const nextLetter = currentLetterEle.nextElementSibling;

    if (nextLetter && nextLetter.classList.contains("letter")) {
        removeClass(currentLetterEle, "current");
        addClass(nextLetter, "current");
    }

    updateStats();
})


// Test Button (Generate New Text)
document.querySelector(".test").addEventListener("click", () => {
    let newTest = '';
    const charsToUse = ['a', 's', 'd', 'f', 'j'," "];
    for (let i = 0; i <400; i++) {
        newTest += charsToUse[Math.floor(Math.random() * charsToUse.length)];
    }
    words=newTest.split(" ");
    insertpara();
    const firstWord = document.querySelector('.word');
    const firstLetter = firstWord.querySelector('.letter');
    firstLetter.classList.add("current");
    firstWord.classList.add("current");
    typingArea.focus();
});
