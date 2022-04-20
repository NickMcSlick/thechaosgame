/***** Title *****/
// CS4500, Group Project
// The Chaos Game
// The Web Devs
// Latest Revision: 4/13/22
/*****************/

/****** Description *****/
// This program plays a song at the end of the game
/************************/

/***** Major data structures *****/
// playAudio():
/*********************************/

/***** Sources *****/
//https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics/*********************************/

/***** Attribution *****/
// Track: A World of Color, SE
// Music by https://www.fiftysounds.com
/*********************************/

let celebrationMusic =  function () {

        if (window.canPlayType('audio/mpeg')) {
            let audio = new Audio('../audio/Correct Answer.mp3');
            audio.play();
        }

    celebrationMusic();

}

