class ExpenseView {
    constructor() {
        this.app = document.getElementById('app');
        this.categoryLabels = {
            'Food': 'Еда',
            'Transport': 'Транспорт',
            'Entertainment': 'Развлечения',
            'Other': 'Другое'
        };

        this.renderBaseLayout();
        this.initializeElements();
    }

    renderBaseLayout() {
        this.app.innerHTML = `
            <div class="container">
                <h1>Учет расходов</h1>

                <div class="expense-form">
                    <h2>Добавить расходы</h2>
                    <form id="expense-form">
                        <div class="form-group">
                            <label for="expense-name">Наименование расхода:</label>
                            <input type="text" id="expense-name" placeholder="Например, еда" required />
                        </div>
                        
                        <div class="form-group">
                            <label for="expense-amount">Стоимость:</label>
                            <input type="number" id="expense-amount" placeholder="Сумма в рублях" required />
                        </div>
                        
                        <fieldset>
                            <legend>Категория:</legend>
                            <div class="radio-group">
                                <label><input type="radio" name="expense-category" value="Food" required /> Еда</label>
                                <label><input type="radio" name="expense-category" value="Transport" required /> Транспорт</label>
                                <label><input type="radio" name="expense-category" value="Entertainment" required /> Развлечения</label>
                                <label><input type="radio" name="expense-category" value="Other" required /> Другое</label>
                            </div>
                        </fieldset>

                        <button type="submit">Добавить расходы</button>
                    </form>
                </div>

                <div class="expense-filter">
                    <h2>Фильтрация</h2>
                    <div class="filter-controls">
                        <div class="form-group">
                            <label for="category-filter">Фильтр по категориям:</label>
                            <select id="category-filter">
                                <option value="all">Все категории</option>
                                <option value="Food">Еда</option>
                                <option value="Transport">Транспорт</option>
                                <option value="Entertainment">Развлечения</option>
                                <option value="Other">Другое</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="expense-list">
                    <h2>Список расходов</h2>
                    <div class="expense-stats" id="expense-stats">
                        <!-- Статистика будет здесь -->
                    </div>
                    <ul id="expense-list">
                        <!-- Список расходов будет здесь -->
                    </ul>
                </div>
            </div>
        `;
    }

    initializeElements() {
        this.form = document.getElementById('expense-form');
        this.list = document.getElementById('expense-list');
        this.filter = document.getElementById('category-filter');
        this.nameInput = document.getElementById('expense-name');
        this.amountInput = document.getElementById('expense-amount');
        this.categoryRadios = document.querySelectorAll('input[name="expense-category"]');
        this.statsContainer = document.getElementById('expense-stats');
    }

    getFormData() {
        const name = this.nameInput.value.trim();
        const amount = this.amountInput.value;
        const category = Array.from(this.categoryRadios).find(radio => radio.checked)?.value;
        return { name, amount, category };
    }

    resetForm() {
        this.form.reset();
    }

    displayExpenses(expenses) {
        this.list.innerHTML = '';

        if (expenses.length === 0) {
            this.list.innerHTML = `
                <li class="empty-state">
                    <p>😊 Нет расходов для отображения</p>
                    <p>Добавьте первый расход с помощью формы выше</p>
                </li>
            `;
            return;
        }

        expenses.forEach(expense => {
            const li = this.createExpenseElement(expense);
            this.list.appendChild(li);
        });

        this.updateStats(expenses);
    }

    createExpenseElement(expense) {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <div class="expense-info">
                <div class="expense-main">
                    <strong class="expense-name">${expense.name}</strong>
                    <span class="expense-amount">${expense.amount} руб.</span>
                </div>
                <div class="expense-meta">
                    <span class="category-badge category-${expense.category.toLowerCase()}">
                        ${this.getCategoryLabel(expense.category)}
                    </span>
                    <small class="expense-date">${expense.date || new Date().toLocaleDateString()}</small>
                </div>
            </div>
            <div class="expense-actions">
                <button class="btn btn-edit" data-id="${expense.id}">
                    ✏️ Редактировать
                </button>
                <button class="btn btn-delete" data-id="${expense.id}">
                    ❌ Удалить
                </button>
            </div>
        `;
        return li;
    }

    updateStats(expenses) {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const categories = {};

        expenses.forEach(expense => {
            categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        });

        this.statsContainer.innerHTML = `
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-label">Всего расходов:</span>
                    <span class="stat-value">${expenses.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Общая сумма:</span>
                    <span class="stat-value">${total} руб.</span>
                </div>
                ${Object.entries(categories).map(([category, amount]) => `
                    <div class="stat-item">
                        <span class="stat-label">${this.getCategoryLabel(category)}:</span>
                        <span class="stat-value">${amount} руб.</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showEditForm(expense, saveHandler, cancelHandler) {
        const expenseElement = this.list.querySelector(`[data-id="${expense.id}"]`).closest('li');
        expenseElement.innerHTML = `
            <form class="edit-form">
                <h3>Редактирование расхода</h3>
                <div class="form-group">
                    <label>Название:</label>
                    <input type="text" value="${expense.name}" class="edit-name" required>
                </div>
                <div class="form-group">
                    <label>Сумма (руб.):</label>
                    <input type="number" value="${expense.amount}" class="edit-amount" required min="0">
                </div>
                <div class="form-group">
                    <label>Категория:</label>
                    <select class="edit-category">
                        ${this.getCategoryOptions(expense.category)}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-save">💾 Сохранить</button>
                    <button type="button" class="btn btn-cancel">🚫 Отмена</button>
                </div>
            </form>
        `;

        const editForm = expenseElement.querySelector('.edit-form');
        const cancelBtn = expenseElement.querySelector('.btn-cancel');

        editForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const updatedData = {
                name: editForm.querySelector('.edit-name').value,
                amount: parseFloat(editForm.querySelector('.edit-amount').value),
                category: editForm.querySelector('.edit-category').value
            };
            saveHandler(expense.id, updatedData);
        });

        cancelBtn.addEventListener('click', () => {
            cancelHandler();
        });
    }

    getCategoryLabel(category) {
        return this.categoryLabels[category] || category;
    }

    getCategoryOptions(selectedCategory) {
        return Object.entries(this.categoryLabels)
            .map(([value, label]) =>
                `<option value="${value}" ${value === selectedCategory ? 'selected' : ''}>${label}</option>`
            )
            .join('');
    }

    bindAddExpense(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            handler(this.getFormData());
        });
    }

    bindDeleteExpense(handler) {
        this.list.addEventListener('click', event => {
            if (event.target.classList.contains('btn-delete') ||
                event.target.closest('.btn-delete')) {
                const btn = event.target.classList.contains('btn-delete') ?
                    event.target : event.target.closest('.btn-delete');
                const id = parseInt(btn.dataset.id);
                handler(id);
            }
        });
    }

    bindEditExpense(handler) {
        this.list.addEventListener('click', event => {
            if (event.target.classList.contains('btn-edit') ||
                event.target.closest('.btn-edit')) {
                const btn = event.target.classList.contains('btn-edit') ?
                    event.target : event.target.closest('.btn-edit');
                const id = parseInt(btn.dataset.id);
                handler(id);
            }
        });
    }

    bindFilterExpenses(handler) {
        this.filter.addEventListener('change', event => {
            handler(event.target.value);
        });
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {

        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.className = `notification notification-${type} show`;


        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpenseView;
} else {
    window.ExpenseView = ExpenseView;
}