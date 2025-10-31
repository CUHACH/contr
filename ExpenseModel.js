export class ExpenseModel {
    constructor() {
        this.expenses = [];
        this.currentFilter = 'all';
        this.nextId = 1;
    }

    addExpense(expenseData) {
        const expense = {
            id: this.nextId++,
            name: expenseData.name,
            amount: parseFloat(expenseData.amount),
            category: expenseData.category,
            date: new Date().toLocaleDateString('ru-RU')
        };
        this.expenses.push(expense);
        return expense;
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
    }

    updateExpense(id, updatedData) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (expense) {
            Object.assign(expense, updatedData);
            expense.date = new Date().toLocaleDateString('ru-RU');
        }
        return expense;
    }

    getExpenseById(id) {
        return this.expenses.find(expense => expense.id === id);
    }

    setFilter(category) {
        this.currentFilter = category;
    }

    getFilteredExpenses() {
        if (this.currentFilter === 'all') {
            return this.expenses;
        }
        return this.expenses.filter(expense => expense.category === this.currentFilter);
    }

    getAllExpenses() {
        return this.expenses;
    }

    getCategories() {
        return ['Food', 'Transport', 'Entertainment', 'Other'];
    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpenseModel;
} else {
    window.ExpenseModel = ExpenseModel;
}