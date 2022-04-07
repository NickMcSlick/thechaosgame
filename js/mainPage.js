
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

var tutorialSelected = false
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