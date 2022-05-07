/***** Title *****/
// CS4500, Group Project
// The Chaos Game
// The Web Devs
// Bryce Paubel (Team Leader)
// Kathlyn Olson
// Michael Schall
// Preston Smith
// John Walthall
// Latest Revision: 4/11/22
/*****************/

/****** Description *****/
// This program takes in the user input for point number selection
// and spawns an instance of the game using main(n) - it also handles
// the background music
/************************/

/***** Major data structures *****/
// Defined within selectMain():
// DOM elements, and an array of DOM elements
// Audio elements
/*********************************/

// Main point selection script
function selectMain() {

  let pointSelectionDiv = document.getElementById("pointSelection");
  let gameDiv = document.getElementById("mainGameWrapper");
  let specialFactorElement = document.getElementById("selectPointsFactor");

  // Check that these elements exits
  if (!pointSelectionDiv) {
    console.log("Point selection div does not exist!");
    return;
  } else if (!gameDiv) {
    console.log("Main game wrapper does not exist!");
  } else if(!specialFactorElement) {
    console.log("Special factor element display does not exist!");
  }

  let three = document.getElementById("three");
  let four = document.getElementById("four");
  let five = document.getElementById("five");
  let six = document.getElementById("six");
  let seven = document.getElementById("seven");
  let eight = document.getElementById("eight");

  let tableArray = [three, four, five, six, seven, eight];

  // Give each DOM element in the table its corresponding value
  for (let i = 0; i < tableArray.length; i++) {
    tableArray[i].associatedValue = i + 3;
  }

  // Check that these elements exist
  tableArray.forEach(object => function () {
        if (!object) {
          console.log(object.associatedValue + " element does not exist!");
          return;
        }
      }
  )

  // Initialize the values
  gameDiv.hidden = true;
  let current = three;
  let prev = three;
  updateSpecialFactor(3, specialFactorElement);
  selected(three);

  // Set events for using arrow navigation
  window.onkeydown = function(e) {
    // left or down
    if (e.keyCode === 37 || e.keyCode === 40) {
      prev = current;
      if (current.associatedValue === 3) {
        current = getTableElement(tableArray, 8);
      } else {
        current = getTableElement(tableArray, current.associatedValue - 1);
      }
      updateSpecialFactor(current.associatedValue, specialFactorElement);
      selected(current);
      deSelected(prev);

    // right or up
    } else if (e.keyCode === 39 || e.keyCode === 38) {
      prev = current;
      if (current.associatedValue === 8) {
        current = getTableElement(tableArray, 3);
      } else {
        current = getTableElement(tableArray, current.associatedValue + 1);
      }
      updateSpecialFactor(current.associatedValue, specialFactorElement);
      selected(current);
      deSelected(prev);

    // Enter
    } else if (e.keyCode === 13) {
      pointSelectionDiv.hidden = true;
      gameDiv.hidden = false;
      main(current.associatedValue);
    }

  }

  // Loop through table elements to assign the mouse events
  for (let i = 0; i < tableArray.length; i++) {
    tableArray[i].onmouseover = tableArray[i].onmousemove = tableArray[i].onmousedown = function() {
      prev = current;
      current = tableArray[i];
      deSelected(prev);
      selected(current);
      updateSpecialFactor(tableArray[i].associatedValue, specialFactorElement);
      tableArray[i].onclick = function () {
        pointSelectionDiv.hidden = true;
        gameDiv.hidden = false;
        main(tableArray[i].associatedValue);
      }
    }
  }
}


// Select an option
function selected(domElement) {
  domElement.innerHTML = "&gt; " + domElement.innerHTML + " &lt;";
  domElement.style.color = "darkcyan";
}

// De-select an option
function deSelected(domElement) {
  // This could be combined into one regex
  domElement.innerHTML = domElement.innerHTML.replaceAll("&gt;", "");
  domElement.innerHTML = domElement.innerHTML.replaceAll("&lt;", "");
  domElement.innerHTML = domElement.innerHTML.trim();
  domElement.style.color = "aqua";
}

// Update the special factor
function updateSpecialFactor(value, domElement) {
  domElement.innerHTML = "Special factor needed to get a fractal pattern: " + determineSpecialFactor(value);
}

// Find special factor
function determineSpecialFactor(value) {
  switch(value) {
    case 3: return "1/2";
    case 4: return "4/7";
    case 5: return "5/8";
    case 6: return "2/3";
    case 7: return "7/10";
    case 8: return "8/11";
    default: return "-1";
  }
}

// Get a table element
function getTableElement(array, value) {
  for (let i = 0; i < array.length; i++) {
    if (value === array[i].associatedValue) {
      return array[i];
    }
  }
  return null;
}
