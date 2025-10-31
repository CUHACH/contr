class ExpensePresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.init();
    }

    init() {

        this.view.bindAddExpense(this.handleAddExpense.bind(this));
        this.view.bindDeleteExpense(this.handleDeleteExpense.bind(this));
        this.view.bindEditExpense(this.handleEditExpense.bind(this));
        this.view.bindFilterExpenses(this.handleFilterExpenses.bind(this));


        this.updateView();
    }

    handleAddExpense(expenseData) {
        if (!this.validateExpenseData(expenseData)) {
            this.view.showError('Пожалуйста, заполните все поля корректно');
            return;
        }

        try {
            this.model.addExpense(expenseData);
            this.view.resetForm();
            this.view.showSuccess('Расход успешно добавлен');
            this.updateView();
        } catch (error) {
            this.view.showError('Ошибка при добавлении расхода: ' + error.message);
        }
    }

    handleDeleteExpense(id) {
        if (confirm('Вы уверены, что хотите удалить этот расход?')) {
            this.model.deleteExpense(id);
            this.view.showSuccess('Расход успешно удален');
            this.updateView();
        }
    }

    handleEditExpense(id) {
        const expense = this.model.getExpenseById(id);
        if (expense) {
            this.view.showEditForm(
                expense,
                this.handleSaveExpense.bind(this),
                this.updateView.bind(this)
            );
        }
    }

    handleSaveExpense(id, updatedData) {
        if (!this.validateExpenseData(updatedData)) {
            this.view.showError('Пожалуйста, заполните все поля корректно');
            return;
        }

        try {
            this.model.updateExpense(id, updatedData);
            this.view.showSuccess('Расход успешно обновлен');
            this.updateView();
        } catch (error) {
            this.view.showError('Ошибка при обновлении расхода: ' + error.message);
        }
    }

    handleFilterExpenses(category) {
        this.model.setFilter(category);
        this.updateView();
    }

    validateExpenseData(expenseData) {
        return expenseData.name &&
            expenseData.amount &&
            expenseData.amount > 0 &&
            expenseData.category;
    }

    updateView() {
        const expenses = this.model.getFilteredExpenses();
        this.view.displayExpenses(expenses);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpensePresenter;
} else {
    window.ExpensePresenter = ExpensePresenter;
}