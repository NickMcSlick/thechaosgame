/***** Title *****/
// CS4500, Group Project
// The Chaos Game
// The Web Devs
// Latest Revision: 4/13/22
/*****************/

/****** Description *****/
// This program sets events for the main page and for the main page options
/************************/

/***** Major data structures *****/
// DOM Elements
/*********************************/

var tutorialSelected = true
var playSelected = false

function presetTutorialText()
{
    var tutorial = document.getElementById('indexTutorialText')
    tutorial.textContent = "> "+tutorial.innerText+" <"
}

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
        indexPlayButton()
    }
    else if((event.code==='Enter') && tutorialSelected === true && playSelected===false)
    {
        indexTutorialButton()
    }
})