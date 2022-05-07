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
// This program sets the session object to see if the user has seen the tutorial
/************************/

/***** Major data structures *****/
// Session objects
/*********************************/

/***** Sources Used *****/
// For slide show: https://www.sitepoint.com/community/t/having-trouble-with-multiple-slideshows-on-one-page/293076
// For slide show: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_slideshow_multiple
// For slide show: https://www.w3schools.com/howto/howto_js_slideshow.asp
/*********************************/


/* IT SHOULD BE NOTED THAT THIS WON'T WORK FOR EVERY BROWSER DUE TO COOKIE RESTRICTIONS */
function setTutorialAsSeen() {
    sessionStorage.setItem("tutorial", "hasSeen");
}

/* Slideshow */
let slideIndex = [1, 1, 1, 1, 1, 1, 1, 1];
let slideId = ["threePtProcess", "eightPtProcess", "threePt", "fourPt", "fivePt", "sixPt", "sevenPt", "eightPt"];

function plusSlides(n, no) {
    showSlides(slideIndex[no] += n, no);
}

// Thumbnail image controls
function currentSlide(n, no) {
    showSlides(slideIndex[no] = n, no);
}

// Show the slide
function showSlides(n, no) {
    let i;
    let x = document.getElementsByClassName(slideId[no]);
    let dots = document.getElementsByClassName("dot" + no.toString());
    if (n > x.length) {slideIndex[no] = 1}
    if (n < 1) {slideIndex[no] = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    x[slideIndex[no]-1].style.display = "block";
    dots[slideIndex[no]-1].className += " active";
}

// Initial setup for tutorial
function tutorialOnLoad() {
    setTutorialAsSeen();
    showSlides(1, 0);
    showSlides(1, 1);
    showSlides(1, 2);
    showSlides(1, 3);
    showSlides(1, 4);
    showSlides(1, 5);
    showSlides(1, 6);
    showSlides(1, 7);

}