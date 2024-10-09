// This is the game state.

var gameState;

gameState = {
	year : 0,
	starved : 0,
	newcomers : 0,
	population : 0,
	acres : 0,
	bushels : 0,
	harvest : 0,
	rats : 0,
	price : 0,
	internalAcres : 0,
	internalBushels : 0,
	totalStarved: 0
};

/* Returns the minimum of the three input values. */

function minimum(firstValue, secondValue, thirdValue) {
	if (firstValue <= secondValue) {
		if (firstValue <= thirdValue) {
			return firstValue;
		} else {
			return thirdValue;
		}
	} else if (secondValue <= thirdValue) {
		return secondValue;
	} else {
		return thirdValue;
	}
}

/* Returns the slider which has the id sliderId. */

function getSlider(sliderId) {
	return document.getElementById(sliderId);
}

/* Outputs the value of the slider with the id sliderId
   to the element with the id outputElementId. */

function updateSliderValueOutput(sliderId, outputElementId) {
	document.getElementById(outputElementId).innerHTML = document.getElementById(sliderId).value;
}

/* Helper function. 

function helperFunction(sliderId, outputElementId) {
	var slider = document.getElementById(sliderId);
	outputElement = document.getElementById(outputElementId);
	outputElement.innerHTML = " " + slider.min + " " + slider.max + " " + slider.step;
}*/

/* Outputs the momentary game state. */

function writeGameState() {
	document.getElementById("year").innerHTML = "Rapport för år: " + gameState.year;
	document.getElementById("starved").innerHTML = "Ihjälsvultna: " + gameState.starved;
	document.getElementById("newcomers").innerHTML = "Inflyttade: " + gameState.newcomers;
	document.getElementById("population").innerHTML = "Befolkning: " + gameState.population;
	document.getElementById("acres").innerHTML = "Tunnland: " + gameState.acres;
	document.getElementById("bushels").innerHTML = "Skäppor: " + gameState.bushels;
	document.getElementById("harvest").innerHTML = "Skörd: " + gameState.harvest;
	document.getElementById("rats").innerHTML = "Råttor: " + gameState.rats;
	document.getElementById("price").innerHTML = "Pris: " + gameState.price;

	updateSliderValueOutput("sliderAcrestosellbuy", "outputAcrestosellbuy");
	updateSliderValueOutput("sliderFeedpeople", "outputFeedpeople");
	updateSliderValueOutput("sliderPlantwithseed", "outputPlantwithseed");
}

/* Sets and outputs the initial game state. */

function gameStart() {
	gameState.year = 1;
	gameState.starved = 0;
	gameState.newcomers = 5;
	gameState.population = 100;
	gameState.acres = 1000;
	gameState.bushels = 2800;
	gameState.harvest = 3;
	gameState.rats = 200;
	gameState.price = randomNumber(10) + 16;
	gameState.internalAcres = gameState.acres;
	gameState.internalBushels = gameState.bushels;
	gameState.totalStarved = 0;

	/* We have to set value after we set min and max,
           because if min and max are set after value has
           been set the Google Chrome browser changes value
           again which leads to a bug in the game.

           We could not figure out the concrete operation
           of the Google Chrome browser which leads to this
           behaviour, despite extensive search on the internet. 

           Issue found out: 12/15/2011 */

	var acresSlider = getSlider("sliderAcrestosellbuy");
	acresSlider.min = -gameState.acres;
	acresSlider.max = Math.floor(gameState.internalBushels / gameState.price);
	acresSlider.value = 0;
	acresSlider.step = 1;

	var feedSlider = getSlider("sliderFeedpeople");
	feedSlider.min = 0;
	feedSlider.max = gameState.internalBushels;
	feedSlider.value = 0;
	feedSlider.step = 1;

	var plantSlider = getSlider("sliderPlantwithseed");
	plantSlider.min = 0;
	plantSlider.max = minimum(gameState.internalAcres, 10 * gameState.population, gameState.internalBushels);
	plantSlider.value = 0;
	plantSlider.step = 1;

	writeGameState();
}

/* Takes the value of the slider for acres to sell or buy
   and adds it to the acres value. The result is stored
   in internal acres. */

function updateInternalAcres() {
	gameState.internalAcres = gameState.acres + parseInt(getSlider("sliderAcrestosellbuy").value);
}

/* Takes the values of the sliders for acres to sell or buy,
   feed people and plant with seed, subtracts them from
   bushels and stores the result in internal bushels. */

function updateInternalBushels() {
	var acresToSellOrBuy = parseInt(getSlider("sliderAcrestosellbuy").value);
	var bushelsForFeeding = parseInt(getSlider("sliderFeedpeople").value);
	var bushelsForPlanting = parseInt(getSlider("sliderPlantwithseed").value);
	gameState.internalBushels = gameState.bushels - acresToSellOrBuy * gameState.price - bushelsForFeeding - bushelsForPlanting;
}

/* Updates the max property of the acres to buy or sell slider. */

function updateMaximumAcresToSellBuy() {
	var acresSlider = getSlider("sliderAcrestosellbuy");
	acresSlider.max = Math.floor(gameState.internalBushels / gameState.price) + parseInt(acresSlider.value);
}

/* Updates the max property of the feed people slider. */

function updateMaximumFeedPeople() {
	var feedSlider = getSlider("sliderFeedpeople");
	feedSlider.max = gameState.internalBushels + parseInt(feedSlider.value);
}

/* Updates the max property of the plant with seed slider. */

function updateMaximumPlantWithSeed() {
	var plantSlider = getSlider("sliderPlantwithseed");
	plantSlider.max = minimum(gameState.internalAcres, 10 * gameState.population, gameState.internalBushels + parseInt(plantSlider.value));
}

/* This function gets called when the value of the slider
   which determines how much acres will be bought or sold
   is changed.

   It changes the value of the internal acres as following:

   - minus button: decrement the internal acres by 1
   - plus button: increment the internal acres by 1
   - slider: add the new value to internal acres

   The values of the internal bushels, the maximum of
   feed people and plant with seed are also changed. */

function onChangeAcres(elementId) {
	if (elementId === "minusbuttonAcrestosellbuy") {
		getSlider("sliderAcrestosellbuy").value = parseInt(getSlider("sliderAcrestosellbuy").value) - 1;
	} else if (elementId === "plusbuttonAcrestosellbuy") {
		getSlider("sliderAcrestosellbuy").value = parseInt(getSlider("sliderAcrestosellbuy").value) + 1;
	}
	updateSliderValueOutput("sliderAcrestosellbuy", "outputAcrestosellbuy");
	updateInternalAcres();
	updateInternalBushels();
	updateMaximumFeedPeople();
	updateMaximumPlantWithSeed();
}

/* This function gets called when the value of the slider
   which determines how much bushels will be used for feeding
   is changed.

   The values of the internal bushels, the maximum of
   acres to sell or buy and plant with seed are changed. */

function onChangeFeeding(elementId) {
	if (elementId === "minusbuttonFeedpeople") {
		getSlider("sliderFeedpeople").value = parseInt(getSlider("sliderFeedpeople").value) - 1;
	} else if (elementId === "plusbuttonFeedpeople") {
		getSlider("sliderFeedpeople").value = parseInt(getSlider("sliderFeedpeople").value) + 1;
	}
	updateSliderValueOutput("sliderFeedpeople", "outputFeedpeople");
	updateInternalBushels();
	updateMaximumAcresToSellBuy();
	updateMaximumPlantWithSeed();
}

/* This function gets called when the value of the slider
   which determines how much bushels will be used for planting
   is changed.

   The values of the internal bushels, the maximum of
   acres to sell or buy and feed people are changed. */

function onChangePlanting(elementId) {
	if (elementId === "minusbuttonPlantwithseed") {
		getSlider("sliderPlantwithseed").value = parseInt(getSlider("sliderPlantwithseed").value) - 1;
	} else if (elementId === "plusbuttonPlantwithseed") {
		getSlider("sliderPlantwithseed").value = parseInt(getSlider("sliderPlantwithseed").value) + 1;
	}
	updateSliderValueOutput("sliderPlantwithseed", "outputPlantwithseed");
	updateInternalBushels();
	updateMaximumAcresToSellBuy();
	updateMaximumFeedPeople();
}

/* Returns a random number between 1 and maxValue. */

function randomNumber(maxValue) {
	var number = Math.floor(Math.random() * maxValue + 1);
	return number;
}

/* Returns 15% of the time the boolean value true
   and 85% of the time the boolean value false. */

function plague() {
	var plagueOccurs;
	if (randomNumber(100) <= 15) {
		plagueOccurs = true;
	} else {
		plagueOccurs = false;
	}
	return plagueOccurs;
}

/* Returns 40% of the time the boolean value true
   and 60% of the time the boolean value false. */

function ratsProblem() {
	var ratsProblemOccurs;
	if (randomNumber(10) <= 4) {
		ratsProblemOccurs = true;
	} else {
		ratsProblemOccurs = false;
	}
	return ratsProblemOccurs;
}

/* If there is a problem with rats, they eat 1/10, 2/10 or
   3/10 of the bushels. Otherwise they eat none. */

function bushelsEatenByRats() {
	var bushelsEaten;
	if (ratsProblem()) {
		bushelsEaten = Math.floor((randomNumber(3) / 10) * gameState.bushels);
	} else {
		bushelsEaten = 0;
	}
	return bushelsEaten; 
}

/* Returns a random number between 1 and 8. */

function harvestPerAcre() {
	var harvest = randomNumber(8);
	return harvest;
}

/* Calculates how many people starved, depending on
   the number of bushels which were used to feed
   people. */

function calculateStarvedPeople() {
	var numberPeopleStarved = gameState.population - Math.floor(parseInt(getSlider("sliderFeedpeople").value) / 20);
	if (numberPeopleStarved <= 0) {
		return 0;
	} else {
		return numberPeopleStarved;
	}
}

/* Calculates the number of newcomers, depending on
   the internal number of acres, internal number of
   bushels and the size of the population. 

   Formula:
   (20 * number of acres you have + amount of grain you have in storage) / (100 * population) + 1*/

function calculateNewcomers() {
	return Math.floor((20 * gameState.internalAcres + gameState.internalBushels) / (100 * gameState.population)) + 1;
}

/* The function returns true if more than 45% of the
   original population starved. Otherwise it returns
   false. */

function tooManyPeopleStarved() {
	var originalPopulation = gameState.population + gameState.starved - gameState.newcomers;
	if (Math.floor((gameState.starved / originalPopulation) * 100) > 45) {
		return true;
	} else {
		return false;
	}
}

/* If the maximum number of turns is not fulfilled yet and
   not too many people starved, the new game state is being
   calculated and outputted.
   If too many people starved the user is being informed
   that he is kicked out of office.
   Otherwise the end-page is shown which informs the user
   about his performance. */

function help() {
	alert("regler")
} 

function finishTurn() {
	if (plague()) {
		alert("En hemsk pest slår till!\n" + "Halva befolkningen dör.");
		gameState.population = Math.floor(gameState.population / 2);
	}
	gameState.starved = calculateStarvedPeople();
	gameState.totalStarved = gameState.totalStarved + gameState.starved;
	gameState.newcomers = calculateNewcomers();
	gameState.population = gameState.population - gameState.starved + gameState.newcomers;
	gameState.harvest = harvestPerAcre();
	gameState.bushels = gameState.internalBushels + gameState.harvest * parseInt(getSlider("sliderPlantwithseed").value);
	gameState.rats = bushelsEatenByRats();
	gameState.bushels = gameState.bushels - gameState.rats;
	gameState.internalBushels = gameState.bushels;
	gameState.price = randomNumber(10) + 16;
	gameState.acres = gameState.internalAcres;

	if (gameState.year < 10 && !tooManyPeopleStarved()) {
		gameState.year++;
		
		var acresSlider = getSlider("sliderAcrestosellbuy");
		acresSlider.min = -gameState.acres;
		acresSlider.max = Math.floor(gameState.internalBushels / gameState.price);
		acresSlider.value = 0;
		acresSlider.step = 1;

		var feedSlider = getSlider("sliderFeedpeople");
		feedSlider.min = 0;
		feedSlider.max = gameState.internalBushels;
		feedSlider.value = 0;
		feedSlider.step = 1;

		var plantSlider = getSlider("sliderPlantwithseed");
		plantSlider.min = 0;
		plantSlider.max = minimum(gameState.internalAcres, 10 * gameState.population, gameState.internalBushels);
		plantSlider.value = 0;
		plantSlider.step = 1;

		writeGameState();
	} else if (tooManyPeopleStarved()) {
		alert("Du har orsakat att 45% av befolkningen svultit ihjäl!\n" + "Du har avsatts.\n" + "Försök igen.");
		gameStart();
	} else {
		var averagePeopleStarved = Math.floor(gameState.totalStarved / 10);
		var acrePerPerson = Math.floor(gameState.acres / gameState.population);
		alert("Total prestation\n" + "Genomsnittligt antal ihjälsvultna per år: " + averagePeopleStarved + "\n" + "Befolkning: " + gameState.population + "\n" + "Tunnland per person: " + acrePerPerson);
		gameStart();
	}
}
