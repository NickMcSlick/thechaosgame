/***** Title *****/
// CS4500, Group Project
// The Chaos Game
// The Web Devs
// Latest Revision: 4/13/22
/*****************/

/****** Description *****/
// This program sets the session object to see if the user has seen the tutorial
/************************/

/***** Major data structures *****/
// Session objects
/*********************************/

/* IT SHOULD BE NOTED THAT THIS WON'T WORK FOR EVERY BROWSER DUE TO COOKIE RESTRICTIONS */
function setTutorialAsSeen() {
    sessionStorage.setItem("tutorial", "hasSeen");
}