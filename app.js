import { ExpenseModel } from './ExpenseModel.js';
import { ExpenseView } from './ExpenseView.js';
import { ExpensePresenter } from './ExpensePresenter.js';
import { mockExpenses } from './mock.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        const model = new ExpenseModel();
        const view = new ExpenseView();
        const presenter = new ExpensePresenter(model, view);

        mockExpenses.forEach(expense => {
            model.addExpense(expense);
        });

        presenter.updateView();

        console.log('Приложение учета расходов успешно запущено с моковыми данными');

    } catch (error) {
        console.error('Ошибка при запуске приложения:', error);
        alert('Произошла ошибка при загрузке приложения. Пожалуйста, обновите страницу.');
    }
});