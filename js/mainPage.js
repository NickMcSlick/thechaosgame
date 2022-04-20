/***** Title *****/
// CS4500, Group Project
// The Chaos Game
// The Web Devs
// Latest Revision: 4/13/22
/*****************/

/****** Description *****/
// This holds functions used for the header and the main page
/************************/

/***** Major data structures *****/
// DOM elements
/*********************************/

function homeButton()
{
    location.assign("../index.html")
}

function gameButton()
{
    location.assign("../html/game.html")
}

function tutorialButton()
{
    location.assign("../html/tutorial.html")
}

function indexHomeButton()
{
    location.assign("index.html")
}

function indexPlayButton()
{
    location.assign("./html/game.html")
}

function indexTutorialButton()
{
    location.assign("./html/tutorial.html")
}

/* IF THE TUTORIAL SESSION OBJECT HAS NOT BEEN CREATED, DISPLAY THE TUTORIAL MESSAGE */
// Check if the user has seen the tutorial
function updateTutorialMessageVisibility() {
    let tutorial = sessionStorage.getItem("tutorial");
    let tutorialMessage = document.getElementById("tutorial_warning");

    if (!tutorialMessage) {
        console.log("Tutorial message does not exist!");
        console.log(tutorialMessage);
    }

    // If the tutorial has been seen, hide the warning message
    if (tutorial && tutorialMessage) {
        tutorialMessage.remove()

    } else if (tutorialMessage) {
        tutorialMessage.style.visibility = "visible";
    }
}
