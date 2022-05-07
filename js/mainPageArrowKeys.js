/***** Title *****/
// CS4500, Group Project
// The Chaos Game
// The Web Devs
// Bryce Paubel (Team Leader)
// Kathlyn Olson
// Michael Schall
// Preston Smith
// John Walthall
// Latest Revision: 4/13/22
/*****************/

/***** Licensing *****/
// Licensed under GNU GPL 3
// This file is part of The Chaos Game.
// The Chaos Game is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
// The Chaos Game is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
// warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License along with The Chaos Game. If not, see https://www.gnu.org/licenses/.
/*********************/

/****** Description *****/
// This program sets events for the main page and for the main page options
/************************/

/***** Major data structures *****/
// DOM Elements
/*********************************/

var tutorialSelected = true;
var playSelected = false;


function presetTutorialText()
{
    var tutorial = document.getElementById('indexTutorialText')
    tutorial.textContent = "> "+tutorial.innerText+" <"
}

document.addEventListener('keyup', (event) =>
{
    var text
    if((event.code==='ArrowDown' || event.code === 'ArrowUp' || event.code === 'ArrowLeft' || event.code === 'ArrowRight') && tutorialSelected === false && playSelected===true)
    {
        document.getElementById('indexPlayText').classList.remove('highlightedText');
        document.getElementById('indexTutorialText').classList.add('highlightedText');
        text = document.getElementById('indexPlayText');
        text.textContent = "Play";
        text = document.getElementById('indexTutorialText');
        text.textContent = "> "+text.innerText+" <";
        tutorialSelected = true;
        playSelected = false;
    }
    else if((event.code==='ArrowDown' || event.code === 'ArrowUp' || event.code === 'ArrowLeft' || event.code === 'ArrowRight') && tutorialSelected === true && playSelected===false)
    {
        document.getElementById('indexTutorialText').classList.remove('highlightedText');
        document.getElementById('indexPlayText').classList.add('highlightedText');
        text = document.getElementById('indexTutorialText');
        text.textContent = "Tutorial";
        text = document.getElementById('indexPlayText');
        text.textContent = "> "+text.innerText+" <";
        playSelected = true;
        tutorialSelected = false;
    }
    else if(event.code==='ArrowDown' || event.code === 'ArrowUp' || event.code === 'ArrowLeft' || event.code === 'ArrowRight')
    {
        document.getElementById('indexTutorialText').classList.add('highlightedText');
        document.getElementById('indexPlayText').classList.remove('highlightedText');
        text = document.getElementById('indexPlayText');
        text.textContent = "Play";
        text = document.getElementById('indexTutorialText');
        text.textContent = "> "+text.innerText+" <";
        tutorialSelected = true;
        playSelected = false;
    }
    
    if((event.code==='Enter') && tutorialSelected === false && playSelected===true)
    {
        indexPlayButton();
    }
    else if((event.code==='Enter') && tutorialSelected === true && playSelected===false)
    {
        indexTutorialButton();
    }
})

// Assign the events for the mouse selection
function selectIndex() {
    let indexTutorialText = document.getElementById('indexTutorialText');
    let indexPlayText = document.getElementById('indexPlayText');

    let tableArray = [indexTutorialText, indexPlayText];

    // Loop through table elements to assign the mouse events
    for (let i = 0; i < tableArray.length; i++) {
        tableArray[i].onmouseover = tableArray[i].onmousemove = tableArray[i].onmousedown = function()
        {

            if (i === 0) { // open tutorial
                playSelected = false;
                tutorialSelected = true;
                deSelected((tableArray[0]));
                selected(tableArray[0]);
                deSelected((tableArray[1]));
            }
            else { // open play
                playSelected = true;
                tutorialSelected = false;
                deSelected((tableArray[1]));
                selected(tableArray[1]);
                deSelected((tableArray[0]));
            }
        }
    }
};

// Select an option
function selected(domElement) {
    domElement.classList.add('highlightedText');
    domElement.innerHTML = "&gt; " + domElement.innerHTML + " &lt;";
}

// De-select an option
function deSelected(domElement) {
    domElement.classList.remove('highlightedText');
    domElement.innerHTML = domElement.innerHTML.replaceAll("&gt;", "");
    domElement.innerHTML = domElement.innerHTML.replaceAll("&lt;", "");
    domElement.innerHTML = domElement.innerHTML.trim();
}

