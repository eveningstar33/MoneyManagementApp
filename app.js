// BUDGET CONTROLLER 
var budgetController = (function() {

	// Create Expense function constructor
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	// Create Income function constructor
	var Income = function(id, description, value) {
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

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			//[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
			// ID = last ID + 1

			// Create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID =0;
			}

			// Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			// Push it into our data structure
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},
		testing: function() {
			console.log(data);
		}
	};


})();


// UI CONTROLLER
var UIController = (function() {

	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list'
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,  // Will be either inc or exp
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value
			};
		},
		addListItem: function(obj, type) {
			var html, element, newHtml;

			// Create HTML string with placeholder text
			if (type === 'inc') {
				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMStrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

			/*
			  Using the 'beforeend' keyword all the html code will be inserted 
			  as a child of the 'element' variable that is '.income__list' or 
			  '.expenses__list', but as a last child. So as the last element 
			  in the list.
			*/

		},
		clearFields: function() {
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + 
				DOMStrings.inputValue);

			/*
			The querySelectorAll method returns a static NodeList, which is a 
			collection of nodes. Now, the fields variable does not contain an array. 
			It actually contains a list that holds the two DOM objects inputDescription 
			and inputValue. We can use the call method to pass this list into the slice 
			method of the Array prototype, and it will return the list as an array.
			*/

			/*
			Then we can use the array forEach method to loop through the list and 
			change the value  property of each object to an empty string.
			*/

			fieldsArr = Array.prototype.slice.call(fields); 
			fieldsArr.forEach(function(current) {
				current.value = "";
			});

			fieldsArr[0].focus();
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
		var input, newItem;

		// 1. Get the field input data
		input = UICtrl.getInput();

		// 2. Add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// 3. Add the item to the UI
		UICtrl.addListItem(newItem, input.type); 

		// 4. Clear the fields
		UICtrl.clearFields();

		// 5. Calculate the budget

		// 6. Display the budget on the UI

	};

	return {
		init: function() {
			console.log('Application has started.');
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();