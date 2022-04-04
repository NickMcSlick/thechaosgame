// Run the point selection
function selectMain() {
  let pointSelectionDiv = document.getElementById("pointSelection");
  let gameDiv = document.getElementById("mainGameWrapper");
  let three = document.getElementById("three");
  let four = document.getElementById("four");
  let five = document.getElementById("five");
  let six = document.getElementById("six");
  let seven = document.getElementById("seven");
  let eight = document.getElementById("eight");

  gameDiv.hidden = true;
  let current = three;
  let prev = three;
  updateSpecialFactor(3);
  selected(three);

  three.onmouseover = function() {
    prev = current;
    current = three;
    deSelected(prev);
    selected(current);
    updateSpecialFactor(3);
    three.onclick = function () {
      pointSelectionDiv.hidden = true;
      gameDiv.hidden = false;
      main(3);
    }
  }

  four.onmouseover = function() {
    prev = current;
    current = four;
    deSelected(prev);
    selected(current);
    updateSpecialFactor(4);
    four.onclick = function() {
      pointSelectionDiv.hidden = true;
      gameDiv.hidden = false;
      main(4);
    }
  }

  five.onmouseover = function() {
    prev = current;
    current = five;
    deSelected(prev);
    selected(current);
    updateSpecialFactor(5);
    five.onclick = function() {
      pointSelectionDiv.hidden = true;
      gameDiv.hidden = false;
      main(5);
    }
  }

  six.onmouseover = function() {
    prev = current;
    current = six;
    deSelected(prev);
    selected(current);
    updateSpecialFactor(6);
    six.onclick = function() {
      pointSelectionDiv.hidden = true;
      gameDiv.hidden = false;
      main(6);
    }
  }

  seven.onmouseover = function() {
    prev = current;
    current = seven;
    deSelected(prev);
    selected(current);
    updateSpecialFactor(7);
    seven.onclick = function() {
      pointSelectionDiv.hidden = true;
      gameDiv.hidden = false;
      main(7);
    }
  }

  eight.onmouseover = function() {
    prev = current;
    current = eight;
    deSelected(prev);
    selected(current);
    updateSpecialFactor(8);
    eight.onclick = function() {
      pointSelectionDiv.hidden = true;
      gameDiv.hidden = false;
      main(8);
    }
  }
}


// Select an option
function selected(domElement) {
  domElement.innerHTML = "&gt; " + domElement.innerHTML + " &lt;";
  domElement.style.color = "blue";
}

// De-select an option
function deSelected(domElement) {
  // This could be combined into one regex
  domElement.innerHTML = domElement.innerHTML.replace("&gt;", "");
  domElement.innerHTML = domElement.innerHTML.replace("&lt;", "");
  domElement.innerHTML = domElement.innerHTML.replace(" ", "");
  domElement.style.color = "aqua";
}

// Update the special factor
function updateSpecialFactor(value) {
  let specialFactorElement = document.getElementById("selectPointsFactor");
  specialFactorElement.innerHTML = "Special factor needed to get a fractal pattern: " + determineSpecialFactor(value);
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
  }
}