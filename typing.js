let timerStarted = false;
let timerExpired = false;
let timeLeft;
let timerInterval;
var ShftParaMltpl = 0;
let animationDuration;
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

let inactivityTimer;
let paused = false;

// Mode handling
const mode = localStorage.getItem("typingMode") || "normal";

// Initialize based on mode
if (mode === "suddenDeath") {
    console.log("Sudden Death mode selected");
    timeLeft = 10;
    animationDuration = 10000;
    document.body.classList.add("sudden-death-mode");
} else if (mode === "sprint") {
    console.log("Sprint mode selected");
    timeLeft = 20;
    animationDuration = 20000;
    document.body.classList.add("sprint-mode");
} else {
    console.log("Normal mode selected");
    timeLeft = 60;
    animationDuration = 60000;
    document.body.classList.add("normal-mode");
}
timerDisplay.textContent = `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;

function startTimer() {
    animationStartTime = Date.now();
    
    // Reset animation before starting
    man.style.animation = "none";
    void man.offsetWidth; // Trigger reflow
    man.style.animation = `moveRight ${animationDuration/1000}s linear forwards`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            timerExpired = true;
            typingArea.blur();
            updateStats();
            showFinalStats();
            
            const stats = getCurrentStats();
            saveScore(stats.wpm, stats.cpm, stats.accuracy);
        }
    }, 1000);
}

function showFinalStats() {
    man.style.animationPlayState = "paused";
    para.classList.add("fade-out");
    wpmDisplay.classList.add("centered");
    cpmDisplay.classList.add("centered");
    accuracyDisplay.classList.add("centered");
    timerDisplay.classList.add("fade-out");
}

function updateStats() {
    const stats = getCurrentStats();
    wpmDisplay.textContent = `${stats.wpm} WPM`;
    cpmDisplay.textContent = `${stats.cpm} CPM`;
    accuracyDisplay.textContent = `${stats.accuracy}%`;
}

function getCurrentStats() {
    let maxTime;
    switch(mode) {
        case "sprint": maxTime = 20; break;
        case "suddenDeath": maxTime = 10; break;
        default: maxTime = 60;
    }
    
    const timeElapsed = maxTime - timeLeft;
    const minutes = timeElapsed / 60;
    const wpm = Math.round((correctChars / 5) / Math.max(minutes, 0.0167)); // Prevent division by 0
    const cpm = Math.round(totalTypedChars / Math.max(minutes, 0.0167));
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
        mode: mode
    };

    db.collection("users").doc(userId).collection("scores").add(scoreData)
        .then(() => {
            console.log("Score saved successfully");
            man.style.animation = "none";
            scoreSaved = true;
        })
        .catch((error) => {
            console.error("Error saving score:", error);
            alert("❌ Error saving score. Try again.");
        });
}

function formatletter(word) {
    return word.split('').map(char => `<span class="letter">${char}</span>`).join('');
}

function randomWord() {
    const word = words[Math.floor(Math.random() * words.length)];
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

function addClass(el, className) {
    if (el) el.classList.add(className);
}

function removeClass(el, className) {
    if (el) el.classList.remove(className);
}

// Initialize first word and letter
let firstWord = document.querySelector('.word');
let firstLetter = document.querySelector('.letter');
firstLetter.classList.add("current");
firstWord.classList.add("current");
updateCursor();

function pauseTest() {
    if (timerExpired || !timerStarted) return;
    
    paused = true;
    clearInterval(timerInterval);
    man.style.animationPlayState = "paused";
    typingArea.blur();
    console.log("Paused due to inactivity");
}

function resumeTest() {
    if (timerExpired) return;
    
    paused = false;
    const elapsed = Date.now() - animationStartTime;
    const remaining = animationDuration - elapsed;
    
    // Reset animation with remaining time
    man.style.animation = "none";
    void man.offsetWidth; // Trigger reflow
    man.style.animation = `moveRight ${remaining/1000}s linear forwards`;
    man.style.animationPlayState = "running";
    
    // Restart timer
    startTimer();
    console.log("Resumed after pause");
}

// Inactivity monitoring
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(pauseTest, 10000); // 10 seconds
}

window.addEventListener("keydown", (event) => {
    if (paused) {
        resumeTest();
    }
    resetInactivityTimer();

    if (timerExpired) {
        event.preventDefault();
        return;
    }

    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    const keyPressed = event.key;
    const currentLetterEle = document.querySelector('.letter.current');
    const currentWordEle = document.querySelector('.word.current');

    if (!currentLetterEle || !currentWordEle) return;

    const expectedLetter = currentLetterEle.textContent;

    // BACKSPACE handling
    if (keyPressed === "Backspace") {
        event.preventDefault();

        if (currentLetterEle.classList.contains("correct")) correctChars--;
        if (currentLetterEle.classList.contains("correct") || currentLetterEle.classList.contains("incorrect")) {
            removeClass(currentLetterEle, "correct");
            removeClass(currentLetterEle, "incorrect");
            return;
        }

        const prevLetter = currentLetterEle.previousElementSibling;
        if (prevLetter) {
            removeClass(currentLetterEle, "current");
            addClass(prevLetter, "current");
            updateCursor();
            removeClass(prevLetter, "correct");
            removeClass(prevLetter, "incorrect");
        } else {
            const prevWord = currentWordEle.previousElementSibling;
            if (prevWord?.classList.contains("word")) {
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

    // Ignore modifier keys
    if (keyPressed.length !== 1 && keyPressed !== " ") return;

    // SPACEBAR handling
    if (keyPressed === " ") {
        event.preventDefault();

        const nextWord = currentWordEle.nextElementSibling;
        if (nextWord?.classList.contains("word")) {
            // Check if current word is complete
            const allLetters = currentWordEle.querySelectorAll(".letter");
            const isWordComplete = Array.from(allLetters).every(letter => 
                letter.classList.contains("correct") || letter.classList.contains("incorrect")
            );
            if (isWordComplete) typedWords++;

            // Move to next word
            removeClass(currentWordEle, "current");
            addClass(nextWord, "current");
            
            const firstLetter = nextWord.querySelector(".letter");
            if (firstLetter) {
                removeClass(currentLetterEle, "current");
                addClass(firstLetter, "current");
                updateCursor();
            }

            // Handle paragraph scrolling
            const wordRect = nextWord.getBoundingClientRect();
            const paraRect = para.getBoundingClientRect();
            if (wordRect.top - paraRect.top >= 120 + ShftParaMltpl * 100) {
                para.style.marginTop = `-${10 + 12 * ShftParaMltpl}rem`;
                ShftParaMltpl++;
            }
        }
        return;
    }

    // LETTER typing
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
            setTimeout(endSuddenDeathMode, 100);
            return;
        }
        addClass(currentLetterEle, "incorrect");
    }

    // Move to next letter
    const nextLetter = currentLetterEle.nextElementSibling;
    if (nextLetter?.classList.contains("letter")) {
        removeClass(currentLetterEle, "current");
        addClass(nextLetter, "current");
        updateCursor();
    } else {
        cursorDiv.classList.add("moveCursorSpc");
    }

    updateStats();
});

// Test Button (Generate New Text)
document.querySelector(".test").addEventListener("click", () => {
    const input = prompt("Enter characters for custom practice (separated by space):");
    if (!input) return;
    
    const charsToUse = input.split(' ');
    if (charsToUse.length < 2) {
        alert("Please enter at least 2 characters separated by space");
        return;
    }
    
    words = charsToUse;
    resetTest();
});

// Restart Button
document.querySelector(".restart").addEventListener("click", resetTest);

function resetTest() {
    // Reset animation
    man.style.animation = "none";
    void man.offsetWidth; // Trigger reflow
    
    clearInterval(timerInterval);
    timerStarted = false;
    timerExpired = false;
    paused = false;
    
    // Reset based on current mode
    if (mode === "sprint") {
        timeLeft = 20;
        animationDuration = 20000;
    } else if (mode === "suddenDeath") {
        timeLeft = 10;
        animationDuration = 10000;
    } else {
        timeLeft = 60;
        animationDuration = 60000;
    }
    
    timerDisplay.textContent = `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;
    ShftParaMltpl = 0;
    para.style.marginTop = "0";

    totalTypedChars = 0;
    correctChars = 0;
    typedWords = 0;
    wpmDisplay.textContent = "0 WPM";
    cpmDisplay.textContent = "0 CPM";
    accuracyDisplay.textContent = "0%";

    document.querySelector(".para").classList.remove("fade-out");
    document.querySelector("#WPM").classList.remove("centered");
    document.querySelector("#CPM").classList.remove("centered");
    document.querySelector("#accuracy").classList.remove("centered");
    document.querySelector("#timer").classList.remove("fade-out");

    insertpara();
    const firstWord = document.querySelector('.word');
    const firstLetter = firstWord.querySelector('.letter');
    firstLetter.classList.add("current");
    firstWord.classList.add("current");
    typingArea.focus();
}

document.querySelector(".save-scores").addEventListener("click", () => {
    if (scoreSaved) {
        alert("⚠ Score already saved.");
        return;
    }

    if (!timerExpired) {
        const confirmSave = confirm("⏱ The timer hasn't expired yet. Save current score?");
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
    document.querySelector(`input[name="mode"][value="${savedMode}"]`).checked = true;

    modeBtn.addEventListener("click", () => modeForm.classList.toggle("hidden"));
    modeSelectionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedMode = document.querySelector('input[name="mode"]:checked').value;
        localStorage.setItem("typingMode", selectedMode);
        location.reload();
    });
});

function endSuddenDeathMode() {
    typingArea.blur();
    clearInterval(timerInterval);
    timerExpired = true;
    man.style.animation = "none";
    showFinalStats();
    alert("Game Over! You made a mistake in Sudden Death Mode.");
}
