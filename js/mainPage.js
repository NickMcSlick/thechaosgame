// Music made available by "https://mixkit.co/free-sound-effects/" and "https://patrickdearteaga.com/arcade-music/".
// 
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
//BackGround Music(Removed for testing audio tracks)
//var music = new Audio("../Audio/Interplanetary Odyssey.ogg");
//music.volume = 0.2;
//music.play();

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
