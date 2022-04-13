
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

function indexGameButton()
{
    location.assign("./html/game.html")
}

function indexTutorialButton()
{
    location.assign("./html/tutorial.html")
}

function indexTutorialText()
{
    location.assign("./html/tutorial.html")
}

function indexPlayText()
{
    location.assign("./html/game.html")
}

var tutorialSelected = true
var playSelected = false

document.addEventListener('keyup', (event) =>
{
    var text
    if((event.code==='ArrowDown' || event.code === 'ArrowUp') && tutorialSelected === false && playSelected===true)
    {
        document.getElementById('indexPlayText').classList.remove('highlightedText')
        document.getElementById('indexTutorialText').classList.add('highlightedText')
        text = document.getElementById('indexPlayText')
        text.textContent = "Play"
        text = document.getElementById('indexTutorialText')
        text.textContent = "> "+text.innerText+" <"
        tutorialSelected = true
        playSelected = false
    }
    else if((event.code==='ArrowDown' || event.code === 'ArrowUp') && tutorialSelected === true && playSelected===false)
    {
        document.getElementById('indexTutorialText').classList.remove('highlightedText')
        document.getElementById('indexPlayText').classList.add('highlightedText')
        text = document.getElementById('indexTutorialText')
        text.textContent = "Tutorial"
        text = document.getElementById('indexPlayText')
        text.textContent = "> "+text.innerText+" <"
        playSelected = true
        tutorialSelected = false
    }
    else if(event.code==='ArrowDown' || event.code === 'ArrowUp')
    {
        document.getElementById('indexTutorialText').classList.add('highlightedText')
        document.getElementById('indexPlayText').classList.remove('highlightedText')
        text = document.getElementById('indexPlayText')
        text.textContent = "Play"
        text = document.getElementById('indexTutorialText')
        text.textContent = "> "+text.innerText+" <"
        tutorialSelected = true
        playSelected = false
    }
    
    if((event.code==='Enter') && tutorialSelected === false && playSelected===true)
    {
        indexPlayText()
    }
    else if((event.code==='Enter') && tutorialSelected === true && playSelected===false)
    {
        indexTutorialText()
    }
})

/* IF THE TUTORIAL SESSION OBJECT HAS NOT BEEN CREATED, DISPLAY THE TUTORIAL MESSAGE */
/* IT SHOULD BE NOTED THAT THIS WON'T WORK FOR EVERY BROWSER DUE TO COOKIE RESTRICTIONS */
function updateTutorialMessageVisibility() {
    let tutorial = sessionStorage.getItem("tutorial");
    let tutorialMessage = document.getElementById("tutorial_warning");

    if (!tutorialMessage) {
        console.log("Tutorial message does not exist!");
        console.log(tutorialMessage);
    }

    // If the tutorial has been seen, hide the warning message
    if (tutorial && tutorialMessage) {
        tutorialMessage.style.visibility = "hidden";
    } else if (tutorialMessage) {
        tutorialMessage.style.visibility = "visible";
    }
}
