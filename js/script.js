const STORAGE_LABEL_LIMIT = 'LIMIT';
const STORAGE_LABEL_EXPENSES = 'expenses';
const CURRENCY = 'руб.';
const STATUS_IN_LIMIT = 'Лимит в порядке';
const STATUS_OUT_LIMIT = 'Лимит превышен';
const STATUS_OUT_LIMIT_CLASSNAME = 'statistics__status-value--red';
const POPUP_OPEN_CLASSNAME = 'popup-change--open';

let LIMIT = 10000;

const inputNode = document.getElementById('expenses-input');
const buttonNode = document.getElementById('expenses-button');
const buttonResetNode = document.getElementById('buttonResetExpenses');
const historyListNode = document.getElementById('expensesHistoryList');
const totalExpensesNode = document.getElementById('totalExpensesValue');
const limitNode = document.getElementById('limit-value');
const statusNode = document.getElementById('status-value');
const selectCategoryNode = document.getElementById('selectCategory');
const changeLimitNode = document.getElementById('changeLimit');
const popupChangeNode = document.getElementById('popupChange');
const popupCloseNode = document.getElementById('closePopup');
const inputChangeNode = document.getElementById('inputChange');
const buttonChangeNode = document.getElementById('buttonChange');
const popupChangeTextValidationNode = document.getElementById(
	'popupChangeTextValidation'
);

let expenses = [];

init();

initStorageLimit();

function initStorageLimit() {
	const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT));

	if (!limitFromStorage) {
		return;
	}

	LIMIT = limitFromStorage;

	limitNode.innerText = LIMIT;
}

const expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
const expensesFromStorage = JSON.parse(expensesFromStorageString);
if (Array.isArray(expensesFromStorage)) {
	expenses = expensesFromStorage;
}

render(expenses);

buttonNode.addEventListener('click', function () {
	const newCost = getExpenseFromUser();

	if (!newCost) {
		return;
	}

	render(expenses);
});

function init() {
	limitNode.innerText = LIMIT;
	statusNode.innerText = STATUS_IN_LIMIT;
	totalExpensesNode.innerText = calcSumExpenses(expenses);
}

function getExpenseFromUser() {
	const expense = parseInt(inputNode.value);
	const checkExpense = Math.sign(expense);

	if (!expense || checkExpense < 1) {
		alert(`Введите положительную сумму больше "0"`);
		return null;
	}

	const category = selectCategoryNode.value;

	if (category === 'Категория') {
		alert(`Выберете "Категорию расходов"`);
		return;
	}

	const newCost = { expense, category };

	trackExpens(newCost);

	clearInput(inputNode);

	return newCost;
}

function trackExpens(newCost) {
	expenses.push(newCost);

	const expensesString = JSON.stringify(expenses);

	localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
}

function clearInput(input) {
	input.value = '';
}

function calcSumExpenses(expenses) {
	let sumExpenses = 0;

	expenses.forEach(element => {
		sumExpenses += element.expense;
	});

	return sumExpenses;
}

function render(expenses) {
	const sumExpenses = calcSumExpenses(expenses);

	renderHistory(expenses);
	renderSumExpenses(sumExpenses);
	renderStatus(sumExpenses);
}

function renderHistory(expenses) {
	let expensesListHTML = '';

	expenses.forEach((element, index) => {
		let serialNumber = ++index;

		expensesListHTML += `<li>${serialNumber}: ${element.expense} ${CURRENCY} - ${element.category} </li>`;
	});

	historyListNode.innerHTML = expensesListHTML;
}

function renderSumExpenses(sumExpenses) {
	totalExpensesNode.innerText = sumExpenses;
}

function renderStatus(sumExpenses) {
	if (sumExpenses <= LIMIT) {
		statusNode.innerText = STATUS_IN_LIMIT;
		statusNode.classList.remove(STATUS_OUT_LIMIT_CLASSNAME);
	} else {
		statusNode.innerText = `${STATUS_OUT_LIMIT} (${
			LIMIT - sumExpenses
		} ${CURRENCY})`;
		statusNode.classList.add(STATUS_OUT_LIMIT_CLASSNAME);
	}
}

buttonResetNode.addEventListener('click', () => {
	expenses = [];
	localStorage.removeItem(STORAGE_LABEL_EXPENSES);
	render(expenses);
});

changeLimitNode.addEventListener('click', function () {
	popupChangeNode.classList.add(POPUP_OPEN_CLASSNAME);
});

popupCloseNode.addEventListener('click', function () {
	popupChangeNode.classList.remove(POPUP_OPEN_CLASSNAME);
});

buttonChangeNode.addEventListener('click', function () {
	const newLimit = parseInt(inputChangeNode.value);
	const checkNewLimit = Math.sign(newLimit);

	if (checkNewLimit >= 1) {
		popupChangeTextValidationNode.classList.add('none');
	} else {
		popupChangeTextValidationNode.classList.remove('none');
		return;
	}

	localStorage.setItem(STORAGE_LABEL_LIMIT, newLimit);

	LIMIT = newLimit;

	init();

	render(expenses);

	clearInput(inputChangeNode);

	popupChangeNode.classList.remove(POPUP_OPEN_CLASSNAME);
});
