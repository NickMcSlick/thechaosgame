var start = document.getElementById('start');
start.focus();
start.style.backgroundColor = 'aqua';
start.style.color = 'white';

function dotheneedful(sibling) {
  if (sibling != null) {
    start.focus();
    start.style.backgroundColor = '';
    start.style.color = '';
    sibling.focus();
    sibling.style.backgroundColor = 'aqua';
    sibling.style.color = 'white';
    start = sibling;
  }
}

document.onkeydown = checkKey;
let x = 3;
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    // up arrow
    var idx = start.cellIndex;
    var nextrow = start.parentElement.previousElementSibling;
    if (nextrow != null) {
      var sibling = nextrow.cells[idx];
      dotheneedful(sibling);
    }
  } else if (e.keyCode == '40') {
    // down arrow
    var idx = start.cellIndex;
    var nextrow = start.parentElement.nextElementSibling;
    if (nextrow != null) {
      var sibling = nextrow.cells[idx];
      dotheneedful(sibling);
    }
  } else if (e.keyCode == '37') {
    // left arrow
    
    var sibling = start.previousElementSibling;
    dotheneedful(sibling);
    
    if (x>3){x--;}
  } else if (e.keyCode == '39') {
    // right arrow
    
    var sibling = start.nextElementSibling;
    dotheneedful(sibling);
    if (x<8) {x++;}
  } else if (e.keyCode =='13'){
        
      window.alert(x);
      
      window.alert(x/(x+3));

      let NUM_x = (x/(x+3));

      document.getElementById("NUM_x").innerHTML = NUM_x;

      swap();

      
      //enter key
     
  }
}



function swap() {
  let n=0;
  setTimeout(function(){
    window.location = "../html/game.html";
    
  }, 2000);
  
  
  
}

