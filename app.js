// BUDGET CONTROLLER 
var budgetController = (function() {

	// Create Expense and Income function constructors

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function() {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	/*
	  The budget constructor keeps track of all the incomes and expenses and also 
	  of the budget and percentages. And we need a good data structure for that.
	  For example if the user will input 15 incomes, we need to create 15 income
	  objects, and we can store these 15 incomes into an array.
	*/

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totalItems: {
			exp: 0,
			inc: 0
		}
	};


})();


// UI CONTROLLER
var UIController = (function() {

	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,  // Will be either inc or exp
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value
			};
		},
		getDOMStrings: function() {
			return DOMStrings;
		}
	};

})();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event) {

			if (event.keyCode === 13 || event.which === 13) {	// event.which is for older browsers

				ctrlAddItem();
			}
		});
	}

	var ctrlAddItem = function() {

		// 1. Get the field input data
		var input = UICtrl.getInput();

		// 2. Add the item to the budget controller

		// 3. Add the item to the UI

		// 4. Calculate the budget

		// 5. Display the budget on the UI

	};

	return {
		init: function() {
			console.log('Application has started.');
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();