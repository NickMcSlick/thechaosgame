/***** Title *****/
// CS4500, Group Project
// The Chaos Game
// The Web Devs
// Bryce Paubel (Team Leader)
// Kathlyn Olson
// Michael Schall
// Preston Smith
// John Walthall
// Latest Revision: 5/7/22
/*****************/

/***** Copyright *****/
// Copyright 2022, Bryce Paubel, Kathlyn Olson, Michael Schall, Preston Smith, John Walthall
/*********************/

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
