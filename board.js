"use strict";
const BODY = document.getElementById("body");
const BOARD = document.getElementById("board");

// Check if any unopened cards remain on board.
export function allCardsOpened() {
    let allCards = document.querySelectorAll(".card");
    for (let card of allCards) {
        if (!card.classList.contains("opened"))
        {
            return false;
        }
    }

    return true;
}

// Display "Game Over" screen.
function displayGameOver(message) { 
    const gameOverDiv = document.createElement("div");
    gameOverDiv.id = 'gameOverDiv';
    gameOverDiv.classList.add('fill-screen');
    gameOverDiv.innerHTML = `<h1 class="animateFadeIn">${message}</h1>`;
    gameOverDiv.addEventListener('click', () => gameOverDiv.remove());
    BODY.prepend(gameOverDiv);
}

function infoToHTML(info, points) {
    const {question, answer, imgPath, endnote, revealPath} = info;

    let infoHTML = 
    `<h1>${points} points</h1>
    <h2>${question}</h2>`;

    if (imgPath)
    {
        infoHTML += `<img src="/public/images/${imgPath}"`;
        if (revealPath) {
            infoHTML += ` revealPath="/public/images/${revealPath}"`;
        }
        infoHTML += `>`;
    }

    infoHTML += `<div><h2>Answer: <span class="cloaked">${answer}</span></h2>`;

    if (endnote)
    {
        infoHTML += `<h3 class="endnote cloaked">(${endnote})</h3>`;
    }

    infoHTML += `</div>
    <button type="button" id="revealButton">Reveal Answer</button>
    <button type="button" id="closeButton">Close</button>`;

    return infoHTML;
}

// Reveal "cloaked" elements
function reveal() {
    for (let elem of document.querySelectorAll(".cloaked")) {
        elem.classList.remove("cloaked");
    }

    const img = document.querySelector('img');
    if (img) {
        const revealPath = img.getAttribute("revealPath");
        if (revealPath) {
            img.src = revealPath;
        }
    }
}

// Sets up trivia board with info from provided Trivia object.
export function setUpBoard(Trivia, gameOverMessage) {
    for (let catIndex = 0; catIndex < Trivia.categories.length; catIndex++) {
        const category = Trivia.categories[catIndex];

        const columnElem = document.createElement("div");
        columnElem.classList.add("column");

        const titleElem = document.createElement("div");
        titleElem.classList.add("titlecard");
        titleElem.innerHTML = `<h2>${category.name}</h2>`;

        columnElem.append(titleElem);

        for (let questIndex = 0, points = 200; questIndex < category.questions.length; questIndex++, points += 200) {
            const cardElem = document.createElement("div");
            cardElem.classList.add("card");
            /*/ *** DELETE
            if (catIndex != 0 || questIndex != 0) { cardElem.classList.add('opened')}
            /*/ //*** DELETE
            cardElem.innerHTML = `<h2>${points}</h2>`;
            cardElem.dataset.points = points;
            cardElem.dataset.catIndex = catIndex;
            cardElem.dataset.questIndex = questIndex;
            cardElem.addEventListener("click", displayPopUp);
            columnElem.append(cardElem);
        }

        BOARD.append(columnElem);
    }

    // Adds popup to document which displays trivia for the selected card.
    function displayPopUp(event) {
        const target = event.target.hasAttribute('data-cat-index') ? event.target : event.target.closest(".card");
        const previouslyOpened = target.classList.contains('opened');
        const catIndex = target.getAttribute('data-cat-index');
        const questIndex = target.getAttribute('data-quest-index');
        const points = target.getAttribute('data-points');
        const info = Trivia.categories[catIndex].questions[questIndex];
        let timerId; // For timer interval

        const popUpElem = document.createElement("div");
        popUpElem.id = "popup";
        popUpElem.classList.add("animateFadeIn");

        const infoDiv = document.createElement("div");
        infoDiv.id = "infoDiv";
        infoDiv.innerHTML = infoToHTML(info, points);
        popUpElem.append(infoDiv);

        const timerDiv = createTimerDiv();
        popUpElem.append(timerDiv);

        BODY.append(popUpElem);

        document.getElementById("closeButton").addEventListener("click", () => {
            clearInterval(timerId); // In case timer was started and didn't finish
            document.getElementById("popup").remove();
            if (!previouslyOpened && allCardsOpened()) {
                displayGameOver(gameOverMessage);
            }
        });
        document.getElementById("revealButton").addEventListener("click", (event) => {
            reveal();
            event.target.remove();
        });
        document.getElementById("timerButton").addEventListener("click", (event) => {
            timerId = setInterval(() => {
                const timeSpan = document.getElementById("timeSpan");
                let seconds = Number(timeSpan.innerText);
                seconds--;
                if (seconds <= 0) {
                    document.getElementById("timerDiv").innerHTML = `<p>Time's Up!</p>`;
                    clearInterval(timerId);
                }
                else {
                    timeSpan.innerText = `${seconds}`;
                }
            }, 1000);
            event.target.remove();
        });

        target.classList.add("opened"); // Change style of selected card by adding ".opened" class
    }
}

// Creates an interactive timer div to coincide with the infoDiv in the popUp element
export function createTimerDiv(seconds = 30) {
    const timerDiv = document.createElement("div");
    timerDiv.id = "timerDiv";
    timerDiv.innerHTML = `<p><span id="timeSpan">${seconds}</span> s</p>`;
    timerDiv.innerHTML += `<button id="timerButton">Start Timer</button>`;

    return timerDiv;
}

// Removes splashScreen element to reveal board after set amount of time
export function removeSplashScreenTimer(timeInMs = 4600) {
    setTimeout(() => document.getElementById("splashScreen").remove(), timeInMs);
}