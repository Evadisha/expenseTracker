const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
  );
  
let transactions =
    localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
  
// To add new transaction
function addTransaction(e) {
    e.preventDefault();
  
    if (text.value.trim() === '' || amount.value.trim() === '') {
      alert('Please add a text and amount');
    } else {
      const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value
      };
  
      transactions.push(transaction);
  
      addTransactionDOM(transaction);
  
      updateValues();
  
      updateLocalStorage();
  
      text.value = '';
      amount.value = '';
    }
  }

// Generate an ID
function generateID() {
    return Math.floor(Math.random() * 10000000);
}

// Adding transactions to DOM list
function addTransactionDOM(transaction) {
    // Get Transaction
    const sign = transaction.amount < 0 ? '-' : '+';
    // Creating the list element
    const item = document.createElement('li');
    // Adding class based on the sign
    item.classList.add(transaction.amount > 0 ? 'plus' : 'minus');
    // Adding info to the list item
    item.innerHTML = `
            ${transaction.text}<span>${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                x
            </button>
    `
    // Appending 
    list.appendChild(item);

}

// Update income, expense and balance
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    // Calculating values of balance, income and expense
    const total = amounts.reduce((sum, item) => sum += item, 0).toFixed(2);
    const income = amounts
                    .filter(item => item > 0)
                    .reduce((sum, item) => (sum += item), 0)
                    .toFixed(2);
    const expense = (amounts
                    .filter(item => item < 0)
        .reduce((sum, item) => (sum += item), 0) * -1).toFixed(2);
    
    // Updating the innerHTML of the values
    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
    
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
  }
  
// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

// Init app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

// Event listeners
// 1. For submission of new transaction
form.addEventListener('submit', addTransaction);