
document.addEventListener('DOMContentLoaded', () => {
    try {

        const model = new ExpenseModel();
        const view = new ExpenseView();
        const presenter = new ExpensePresenter(model, view);

        console.log('Приложение учета расходов успешно запущено');


        setTimeout(() => {
            model.addExpense({ name: "Продукты", amount: 1500, category: "Food" });
            model.addExpense({ name: "Такси", amount: 500, category: "Transport" });
            model.addExpense({ name: "Кино", amount: 700, category: "Entertainment" });
            presenter.updateView();
        }, 100);

    } catch (error) {
        console.error('Ошибка при запуске приложения:', error);
        alert('Произошла ошибка при загрузке приложения. Пожалуйста, обновите страницу.');
    }
});