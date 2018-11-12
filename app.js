// BUDGET CONTROLLER 
var budgetController = (function() {

	// Create Expense function constructor
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100); 
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
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
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	/*
	  We've set the percentage to -1 because -1 is actually a value that we use 
	  to say that something is nonexistent. So if there are no budget values and 
	  no total expenses and incomes, then there cannot be a percentage.
	*/

	var calculateTotal = function(type) {
		var sum = 0;

		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			//[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
			// ID = last ID + 1

			console.log('length is: ' + data.allItems[type].length);

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

		deleteItem: function(type, id) {
			var ids, index;

			// id = 6
			// data.allItems[type][id] isn't a solution
			// ids = [1 2 4 6 8]
			// index = 3

			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			console.log('index is: ' + index + '<-> id is: ' + id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
			
		},

		calculateBudget: function() {
			// Calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// Calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// Calculate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
			} else {
				data.percentage = -1;
			}
		},

		calculatePercentages: function() {
			/*
			  Expenses:
			  a = 20
			  b = 10
			  c = 40
			  Total income: 100
			  Percentages:
			  a = 20/100 = 20%
			  b = 10/100 = 10%
			  c = 40/100 = 40%
			*/

			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},

		/*
		  This time we don't want just loop over an array and do something, we also
		  want to return something. We want to store it somewhere. And that's what
		  the map method is for. So instead of forEach, we will use map because map
		  returns something and stores it in a variable while forEach does not. 
		*/

		getPercentages: function() {
			var allPercentages = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPercentages;
		},

		/*
		  We're creating this getBudget method only for returning something from this
		   data structure or from the module to understand this philosophy of having 
		  functions that only retrieve data, or functions that only set data.
		*/

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
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
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage'
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,  // Will be either inc or exp
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {
			var html, element, newHtml;

			// Create HTML string with placeholder text
			if (type === 'inc') {
				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMStrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

		deleteListItem: function(itemID) {
			var el = document.getElementById(itemID);
			el.parentNode.removeChild(el);
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

		displayBudget: function(obj) {
			document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
		},

		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
			/*
			  This will return a list and acltually is called a NodeList, not just
			  list and that is because in the DOM tree, where all of the html 
			  elements of our page are stored, each element is called a node. And 
			  now we need to loop over all of these elements in our selection, all 
			  of these nodes and then change the text content property for all of 
			  them. The NodeList doesn't have the forEach method, it is for array.
			  And we can convert the NodeList into an array using slice method. But 
			  instead we can create our own forEach function but for NodeLists instead 
			  of arrays.
			*/

			var nodeListForEach = function(list, callback) {
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i);
				}
			};

			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
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
		 
		// Setting up the delete event listener using event delegation. 
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};

	var updateBudget = function() {

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget); 
	};

	var updatePercentages = function() {
		// 1. Calculate percentages
		budgetCtrl.calculatePercentages();

		// 2. Read percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();

		// 3. Update the UI with the new percentages
		UICtrl.displayPercentages(percentages);
	}

	var ctrlAddItem = function() {
		var input, newItem;

		// 1. Get the field input data
		input = UICtrl.getInput();

		if ((input.description !== "") && !isNaN(input.value) && (input.value > 0)) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type); 

			// 4. Clear the fields
			UICtrl.clearFields();

			// 5. Calculate and update budget
			updateBudget();

			// 6. Calculate and update percentages
			updatePercentages();
		}
	};

	/*
	  We're using the event parameter because we want access to the event object. 
	  And the reason why we need this event here is because we want to know what 
	  the target element is. In event delegation, an event bubbles up and then 
	  we can know where it came from, so where it was first fired, by looking at 
	  the target property of the event. 
	*/

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		/*
		  If we click somewhere else on the we get nothing in the console and 
		  that's because there are no other ids in the whole HTML document. And 
		  we will use this fact to say that we only want stuff to happen later
		  if the id is actually defined. 
		*/

		if (itemID) {
			/*
			  JavaScript automatically puts a wrapper around the String and 
			  convert it from a primitive to an object. And then this object
			  has access to a lot of string methods. 
			*/
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
			console.log(ID);

			// 1. Delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);

			// 2. Delete the item from the UI
			UICtrl.deleteListItem(itemID);

			// 3. Update and show the new budget
			updateBudget();

			// 4. Calculate and update percentages
			updatePercentages();
		}
	};

	return {
		init: function() {
			console.log('Application has started.');
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();