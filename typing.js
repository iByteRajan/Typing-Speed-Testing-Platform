let timerStarted = false;
let timerExpired = false;
let timeLeft = 60; // seconds
let timerInterval;
var ShftParaMltpl = 0;
let animationDuration = 60000;
var animationStartTime;
var cursorDiv;
const man = document.querySelector(".man");


let totalTypedChars = 0;
let correctChars = 0;
let typedWords = 0;
let scoreSaved = false;

const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("WPM");
const cpmDisplay = document.getElementById("CPM");
const accuracyDisplay = document.getElementById("accuracy");

function startTimer() {
    animationStartTime = Date.now();
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;

        if (timeLeft === 0) {
            man.style.animationPlayState = "paused";
            clearInterval(timerInterval);
            timerExpired = true;
            typingArea.blur(); // stop typing
            updateStats();

            para.classList.add("fade-out");
            wpmDisplay.classList.add("centered");
            cpmDisplay.classList.add("centered");
            accuracyDisplay.classList.add("centered");
            timerDisplay.classList.add("fade-out");
        }
    }, 1000);
    man.style.animation = `moveRight ${animationDuration / 1000}s linear forwards`;
}


function updateStats() {
    const stats = getCurrentStats();
    wpmDisplay.textContent = `${stats.wpm} WPM`;
    cpmDisplay.textContent = `${stats.cpm} CPM`;
    accuracyDisplay.textContent = `acc: ${stats.accuracy}%`;
}

function getCurrentStats() {
    const timeElapsed = flagSprint ? 20 - timeLeft : 60 - timeLeft;    const minutes = timeElapsed / 60;
    console.log(timeElapsed);

    const wpm = minutes > 0 ? Math.round((correctChars/5)/minutes) : 0;
    const cpm = minutes > 0 ? Math.round(totalTypedChars / minutes) : 0;
    const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;

    return { wpm, cpm, accuracy };
}


const str = "the quick brown fox jumps over lazy dog speed typing accuracy rhythm practice focus keyboard monitor screen challenge letter fast sunlight window clock pencil notebook dream energy motion silent active clever power always never before behind careful simple planet rocket galaxy universe orbit gravity future digital program terminal command execute random skills boost sharp brain train moment value reason system pattern logic together instant magic wonder rapid storm update create improve master vision hope memory sharpness awareness reflex thunder start finish calm steady precise victory brave courage loyal unity honest bright shadow whisper mountain river forest ocean stormy cloudy breezy summer winter monsoon rainstorm sunrise sunset sparkle shine balance harmony dreamer achiever creator thinker maker believer friend family brother sister parent teacher student captain player team school college university science fiction reality mystery thriller comedy adventure journey path road travel explore discover invent design build code debug compile test deploy network server client cloud database array string integer boolean object variable constant loop method structure solve plan idea concept imagine ancient modern virtual space star moon earth fire air water ice metal stone grass sand wind wave fog mist spell hero villain quest castle kingdom treasure secret trap puzzle lock key portal gate realm myth legend sword shield armor battle warrior archer wizard guardian champion";
var words = str.split(" ");
const typingArea = document.querySelector('.typing-area');
const para = document.querySelector(".para");
const totalWords = 290;

function updateCursor() {
    const existingCursor = document.querySelector('.cursor');
    if (existingCursor) existingCursor.remove();

    const currentLetterEle = document.querySelector('.letter.current');
    if (currentLetterEle) {
        cursorDiv = document.createElement('div');
        cursorDiv = document.createElement('div');
        cursorDiv.classList.add('cursor');
        currentLetterEle.appendChild(cursorDiv);
    }
}

function saveScore(wpm, cpm, accuracy) {
    console.log("saveScore() called");
    const user = firebase.auth().currentUser;
    if (!user) {
        console.log("No user logged in, cannot save score.");
        return;
    }
    const userId = user.uid;
    const scoreData = {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        wpm: wpm,
        cpm: cpm,
        accuracy: accuracy,
    };
    console.log("Saving score data:", scoreData);

    db.collection("users").doc(userId).collection("scores").add(scoreData)
        .then((docRef) => {
            console.log("Score saved with ID:", docRef.id);
            const timeElapsed = Date.now() - animationStartTime;
            man.style.animation = "none";
            alert("✅ Score saved successfully!");
            scoreSaved = true;
        })
        .catch((error) => {
            console.error("Error saving score:", error);
            const timeElapsed = Date.now() - animationStartTime;
            man.style.animation = "none";
            alert("❌ Error saving score. Try again.");
            const remainingTime = animationDuration - timeElapsed;
            man.style.animation = `walk ${remainingTime}ms linear forwards`;
            animationStartTime = Date.now();
        });
}

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
updateCursor();


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

    if (!currentLetterEle || !currentWordEle) return;                   //<-------

    let expectedLetter = currentLetterEle.textContent;                      //<<<<<

    // BACKSPACE handling
    if (keyPressed === "Backspace") {
        event.preventDefault();

        if(currentLetterEle.classList.contains("correct")) correctChars--;
        if (currentLetterEle.classList.contains("correct") || currentLetterEle.classList.contains("incorrect")) {
            removeClass(currentLetterEle, "correct");
            removeClass(currentLetterEle, "incorrect");
            return;
        }

        let prevLetter = currentLetterEle.previousElementSibling;
        if (prevLetter && prevLetter.classList.contains("correct")) {
            correctChars--;
        }
        if (prevLetter) {
            removeClass(currentLetterEle, "current");
            addClass(prevLetter, "current");
            updateCursor();
            removeClass(prevLetter, "correct");
            removeClass(prevLetter, "incorrect");
        } else {
            const prevWord = currentWordEle.previousElementSibling;
            if(prevWord.lastChild.classList.contains("correct")) correctChars--;
            if (prevWord && prevWord.classList.contains("word")) {
                const prevLetters = prevWord.querySelectorAll(".letter");
                const lastLetter = prevLetters[prevLetters.length - 1];

                removeClass(currentLetterEle, "current");
                addClass(lastLetter, "current");

                removeClass(currentWordEle, "current");
                addClass(prevWord, "current");
                updateCursor();

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
                updateCursor();
            }

            // Check if the current word is fully typed
            const allLetters = currentWordEle.querySelectorAll(".letter");
            const isWordTyped = Array.from(allLetters).every(letter =>
                letter.classList.contains("correct") || letter.classList.contains("incorrect")
            );

            if (isWordTyped) {
                typedWords++;
            }

            // handling the scrollin of the para
            const wordRect = nextWord.getBoundingClientRect();
            const paraRect = para.getBoundingClientRect();
            const relToTop = wordRect.top - paraRect.top;
            console.log(relToTop);
            if (relToTop >= 120 + ShftParaMltpl * 100) {
                para.style.marginTop = `-${10 + 12 * ShftParaMltpl}rem`;
                ShftParaMltpl++;
            }
        }
        return;
    }

    // LETTER typing logic
    totalTypedChars++;
    if (keyPressed === expectedLetter) {
        if (!currentLetterEle.classList.contains('incorrect')) {
            addClass(currentLetterEle, "correct");
            correctChars++;
        }
    } else {
        if (mode === "suddenDeath") {
            addClass(currentLetterEle, "incorrect");
            updateStats();
            setTimeout(() => {
                endSuddenDeathMode();
            }, 100); // allow red flash before stop
            return;
        }

        if (!currentLetterEle.classList.contains('correct')) {
            addClass(currentLetterEle, "incorrect");
        }
    }

    // Move to next letter
    const nextLetter = currentLetterEle.nextElementSibling;
    if (nextLetter === null) {
        cursorDiv.classList.add("moveCursorSpc");
    }

    if (nextLetter && nextLetter.classList.contains("letter")) {
        removeClass(currentLetterEle, "current");
        addClass(nextLetter, "current");
        updateCursor();
    }


    updateStats();
})

//test button
document.querySelector(".test").addEventListener("click", () => {
  let input = prompt("Enter Five Characters For Custom Practice With space:");
  let charsToUse = input.split("");
  if (charsToUse.length != 9) {
    alert("Invalid Inputs");
    return;
  }
  let newTest = "";
  for (let i = 0; i < 400; i++) {
    let char = charsToUse[Math.floor(Math.random() * charsToUse.length)];

    // Avoid adding a space after a space
    if (char === " " && newTest.endsWith(" ")) {
      i--; // Don't count this iteration
      continue;
    }

    newTest += char;
  }
  words = newTest.split(" ");

  document.querySelector(".para").classList.remove("fade-out");
  document.querySelector("#WPM").classList.remove("centered");
  document.querySelector("#CPM").classList.remove("centered");
  document.querySelector("#accuracy").classList.remove("centered");
  document.querySelector("#timer").classList.remove("fade-out");

  insertpara();
  const firstWord = document.querySelector(".word");
  const firstLetter = firstWord.querySelector(".letter");
  firstLetter.classList.add("current");
  firstWord.classList.add("current");
  typingArea.focus();
});

// Restart Button
document.querySelector(".restart").addEventListener("click", () => {
    man.style.animation = "none";
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

    document.querySelector(".para").classList.remove("fade-out");
    document.querySelector("#WPM").classList.remove("centered");
    document.querySelector("#CPM").classList.remove("centered");
    document.querySelector("#accuracy").classList.remove("centered");
    document.querySelector("#timer").classList.remove("fade-out");

    // Reset the string and word list to the default

    insertpara();
    const firstWord = document.querySelector('.word');
    const firstLetter = firstWord.querySelector('.letter');
    firstLetter.classList.add("current");
    firstWord.classList.add("current");
    typingArea.focus();
});

document.querySelector(".save-scores").addEventListener("click", () => {
    if (scoreSaved) {
        alert("⚠ Score already saved.");
        return;
    }

    if (!timerExpired) {
        const confirmSave = confirm("⏱ The timer hasn't expired yet. Are you sure you want to save your current score?");
        if (!confirmSave) return;
    }

    const stats = getCurrentStats();
    saveScore(stats.wpm, stats.cpm, stats.accuracy);
});

// Modes selection

document.addEventListener("DOMContentLoaded", () => {
    const modeBtn = document.querySelector(".modes");
    const modeForm = document.getElementById("modeForm");
    const modeSelectionForm = document.getElementById("modeSelectionForm");

    const savedMode = localStorage.getItem("typingMode") || "normal";
    const radioToCheck = document.querySelector(`input[name="mode"][value="${savedMode}"]`);
    if (radioToCheck) radioToCheck.checked = true;

    modeBtn.addEventListener("click", () => {
        modeForm.classList.toggle("hidden");
    });

    modeSelectionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedMode = document.querySelector('input[name="mode"]:checked').value;
        localStorage.setItem("typingMode", selectedMode);
        window.location.href = "landingPage.html";
    });
});


const mode = localStorage.getItem("typingMode") || "normal";

var flagSprint=false;
if (mode === "suddenDeath") {
    console.log("Sudden Death mode selected");
} else if (mode === "sprint") {
    console.log("Sprint mode selected");
    timeLeft = 20;
    flagSprint=true;
    animationDuration = 20000;
} else {
    console.log("Normal mode selected");
}
timerDisplay.textContent = `00:${timeLeft < 10 ? "0" : ""}${timeLeft} `;


// Sudden Death Mode

const modeForm = document.getElementById("modeSelectionForm");

modeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedMode = document.querySelector('input[name="mode"]:checked').value;
    mode = selectedMode;
    location.reload();
});

function endSuddenDeathMode() {
    typingArea.blur();
    clearInterval(timerInterval);
    timerExpired = true;

    para.classList.add("fade-out");
    wpmDisplay.classList.add("centered");
    cpmDisplay.classList.add("centered");
    accuracyDisplay.classList.add("centered");
    timerDisplay.classList.add("fade-out");

    updateStats();
    man.style.animation = "none";
    alert("Game Over! You made a mistake in Sudden Death Mode.");
}
