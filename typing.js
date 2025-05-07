const defaultStr = "the quick brown fox jumps over lazy dog speed typing accuracy rhythm practice focus keyboard monitor screen challenge letter fast sunlight window clock pencil notebook dream energy motion silent active clever power always never before behind careful simple planet rocket galaxy universe orbit gravity future digital program terminal command execute random skills boost sharp brain train moment value reason system pattern logic together instant magic wonder rapid storm update create improve master vision hope memory sharpness awareness reflex thunder start finish calm steady precise victory brave courage loyal unity honest bright shadow whisper mountain river forest ocean stormy cloudy breezy summer winter monsoon rainstorm sunrise sunset sparkle shine balance harmony dreamer achiever creator thinker maker believer friend family brother sister parent teacher student captain player team school college university science fiction reality mystery thriller comedy adventure journey path road travel explore discover invent design build code debug compile test deploy network server client cloud database array string integer boolean object variable constant loop method structure solve plan idea concept imagine ancient modern virtual space star moon earth fire air water ice metal stone grass sand wind wave fog mist spell hero villain quest castle kingdom treasure secret trap puzzle lock key portal gate realm myth legend sword shield armor battle warrior archer wizard guardian champion";
let str = defaultStr;
let words = str.trim().split(" ");

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
const typingArea = document.querySelector('.typing-area');
const para = document.querySelector(".para");

let newTest = '';
let totalWords = 100;

// Utility Functions
function addClass(ele, className) {
    ele.classList.add(className);
}
function removeClass(ele, className) {
    ele.classList.remove(className);
}

function formatLetter(word) {
    return [...word].map(char => `<span class="letter">${char}</span>`).join("");
}

function randomWord() {
    const word = words[Math.floor(Math.random() * words.length)];
    return `<div class="word">${formatLetter(word)}</div>`;
}

function insertPara() {
    let html = '';
    for (let i = 0; i < totalWords; i++) {
        html += randomWord() + " ";
    }
    para.innerHTML = html;

    const firstWord = document.querySelector('.word');
    const firstLetter = firstWord.querySelector('.letter');
    document.querySelectorAll(".letter").forEach(el => {
        el.classList.remove("correct", "incorrect", "current");
    });
    document.querySelectorAll(".word").forEach(el => {
        el.classList.remove("current");
    });
    addClass(firstWord, "current");
    addClass(firstLetter, "current");
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerExpired = true;
            typingArea.blur();
            timerDisplay.textContent = "00:00";
        }
    }, 1000);
}

function updateStats() {
    const timeElapsed = 60 - timeLeft;
    const minutes = timeElapsed / 60;

    const wpm = minutes > 0 ? Math.round(typedWords / minutes) : 0;
    const cpm = minutes > 0 ? Math.round(totalTypedChars / minutes) : 0;
    const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;

    wpmDisplay.textContent = `${wpm} WPM`;
    cpmDisplay.textContent = `${cpm} CPM`;
    accuracyDisplay.textContent = `${accuracy}%`;
}

// Initial paragraph render
insertPara();

// Typing Handler
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

    if (!currentLetterEle || !currentWordEle) return;

    let expectedLetter = currentLetterEle.textContent;

    // Handle backspace
    if (keyPressed === "Backspace") {
        let prevLetter = currentLetterEle.previousElementSibling;

        if (prevLetter) {
            removeClass(currentLetterEle, "current");
            addClass(prevLetter, "current");
            removeClass(prevLetter, "correct");
            removeClass(prevLetter, "incorrect");
        } else {
            const prevWord = currentWordEle.previousElementSibling;
            if (prevWord && prevWord.classList.contains("word")) {
                const letters = prevWord.querySelectorAll(".letter");
                const lastLetter = letters[letters.length - 1];

                removeClass(currentLetterEle, "current");
                removeClass(currentWordEle, "current");

                addClass(prevWord, "current");
                addClass(lastLetter, "current");

                removeClass(lastLetter, "correct");
                removeClass(lastLetter, "incorrect");
            }
        }

        event.preventDefault();
        return;
    }

    // Ignore non-character keys (except space)
    if (keyPressed.length !== 1 && keyPressed !== " ") return;

    // Handle space
    if (keyPressed === " ") {
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
        event.preventDefault();
    } else {
        // Handle character input
        totalTypedChars++;
        if (keyPressed === expectedLetter) {
            addClass(currentLetterEle, "correct");
            correctChars++;
        } else {
            addClass(currentLetterEle, "incorrect");
        }

        let nextLetter = currentLetterEle.nextElementSibling;
        if (nextLetter) {
            removeClass(currentLetterEle, "current");
            addClass(nextLetter, "current");
        }
    }

    updateStats();
});

// Restart Button
document.querySelector(".restart").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerStarted = false;
    timerExpired = false;
    timeLeft = 60;
    timerDisplay.textContent = "01:00";

    totalTypedChars = 0;
    correctChars = 0;
    typedWords = 0;
    wpmDisplay.textContent = `0 WPM`;
    cpmDisplay.textContent = `0 CPM`;
    accuracyDisplay.textContent = `0%`;

    // Reset the string and word list to the default
    str = defaultStr;
    words = str.trim().split(" ");

    insertPara();
    typingArea.focus();
});


// Test Button (Generate New Text)
document.querySelector(".test").addEventListener("click", () => {
    newTest = '';
    const charsToUse = ['a', 's', 'd', 'f', 'j'];
    for (let i = 0; i < 50; i++) {
        newTest += charsToUse[Math.floor(Math.random() * charsToUse.length)];
    }

    str = " " + newTest;
    words = str.trim().split(" ");
    insertPara();
    typingArea.focus();
});
