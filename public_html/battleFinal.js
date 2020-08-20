
var view = {
    //view takes a string message and displays it in messsage display area
    displayMessage: function (msgParam) {
//        console.log("Display Message");  debugging
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msgParam;
    }

    , displayMiss: function (locationParam) {
        //location matches an id of a <td> element
        //if not null : locationParam return falsely

        //executes xTimes accourding to fire method, numOfShips loop

        if (locationParam) {
            var cell = document.getElementById(locationParam);
            cell.setAttribute("class", "miss");
        }
    }
    , displayHit: function (locationParams) {
        // console.log("Hit");
        var cell = document.getElementById(locationParams);
        cell.setAttribute("class", "hit");
    }
}



var model = {
    boardSize: 7   //size of the grid for the board.
    , numShips: 3   // the number of ships in a game.
            //an array of ship objects [3]
    , ships: [{locations: [0, 0, 0], hits: ["", "", ""]}
        , {locations: [0, 0, 0], hits: ["", "", ""]}
        , {locations: [0, 0, 0], hits: ["", "", ""]}
    ]
            //the ship location and hits
    , shipsSunk: 0
    , shipLength: 3               // the number of locations in each ship
    , myCounter: 0
    , fire: function (guessParam) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];

            var index = this.ships[i].locations.indexOf(guessParam);

            if (index < 0) {
                //missed fire
                view.displayMiss(guessParam);
                view.displayMessage("You missed."); //will show (numShips) Times
            } else if (ship.hits[index] === "hit") {
                view.displayMessage("Already Hit!");
                view.displayHit(guessParam);
                console.log(ship.hits[index]);
            }
            else {
                //we have a hit!
                ship.hits[index] = "hit";
                view.displayHit(guessParam);  //notify the view that we got a hit at the location guessed
                view.displayMessage("HIT!");  // ask view to display "HIT!"

                if (this.isSunk(ship)) {
                    view.displayMessage("You sunk my battleship! Arr...");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        return false;
    }
    , isSunk: function (shipParam) {
        for (var i = 0; i < this.shipLength; i++) {
            if (shipParam.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
        /*the for loop checked into all locations of shit[i].hit
         and found that all 'hit' locations of shipLength where 'hits'
         Therefore the ship is sunk.
         */
    }
    , generateShipLocations: function () {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    }
    , generateShip: function () {

        var direction = Math.floor(Math.random() * 2);
        var row, col;
        //create an emoty array to add ships one by one
        var newShipLocations = [];

        //starting location
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                //horizontal 
                row = Math.floor(Math.random() * this.boardSize);
                col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
                newShipLocations.push(row + "" + (col++));
            } else {
                //vertical
                row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
                col = Math.floor((Math.random() * this.boardSize));
                newShipLocations.push((row++) + "" + col);
            }
        }
        return newShipLocations;
    }
    , collision: function (locationsParam) {
        //ships
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];

            //locations
            for (var k = 0; k < this.shipLength; k++) {
                if (ship.locations.indexOf(locationsParam[k]) >= 0) {
                    //break by return
                    return true;
                }
            }
        }
        return false;
    }
};

//Controller 

// Get and process the player’s guess (like “A0” or “B1”).
// Keep track of the number of guesses.
// Ask the model to update itself based on the latest guess.
// Determine when the game is over (that is, when all ships have been sunk).

var controller = {
    guesses: 0

    , processGuess: function (guessParam) {
        var location = parseGuess(guessParam);

        if (location) {
            this.guesses++;
            var hit = model.fire(location);

            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You've sank my battleships, in " + this.guesses + " guesses");
            }
        }
    }
};

//check validity
function parseGuess(guessParam) {

    var alphabets = ["A", "B", "C", "D", "E", "F", "G"];

    if (guessParam === null || guessParam.length !== 2) {
        alert("Please enter a letter and number on the board :)");
    } else {
        var firstChar = guessParam.charAt(0);
        var row = alphabets.indexOf(firstChar);
        var column = guessParam.charAt(1);

        //test argument if is No a Number, : Boolean
        if (isNaN(row) || isNaN(column)) {
            alert("Please enter a letter and number on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board");
        } else {
            return row + column;
        }
    }
    return null;
}
;

//Events
function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

//when, Events handler
function handleFireButton() {
    //get value from the form   
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keysCode === 13) {
        fireButton.click; // trick as if fireButton actually clicked
        return false; // so the form does'nt try submit itself or anything else
    }
}

//Run init when page fully loaded
window.onload = init;

