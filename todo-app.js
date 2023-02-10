let todoArr = [];
let userName;

// создание заголовка
function createAppTitle(title) {
	let appTitle = document.createElement('h2');
	appTitle.innerHTML = title;
	return appTitle;
}

// создание формы
function createTodoItemForm() {
	let form = document.createElement('form');
	let input = document.createElement('input');
	let btnWrapper = document.createElement('div');
	let btn = document.createElement('button');

	form.classList.add('input-group', 'mb-3');
	input.classList.add('form-control', 'mr-3');
	input.placeholder = 'Введите название нового дела';
	btn.classList.add('btn', 'btn-primary');
	btn.textContent = 'Добавить дело';
	btn.disabled = true;

	btnWrapper.append(btn);
	form.append(input);
	form.append(btnWrapper);

	input.addEventListener('input', function () {
		if (input.value.trim().length > 0) {
			btn.disabled = false;
		} else {
			btn.disabled = true;
		}
	});

	return {
		form,
		input,
		btn,
	};
}

// создание списка
function createTodoList() {
	let list = document.createElement('ul');
	list.classList.add('list-group');
	return list;
}

// создание элементов списка
function createTodoItem(todo) {
	let item = document.createElement('li');
	let btnGroup = document.createElement('div');
	let doneBtn = document.createElement('button');
	let deleteBtn = document.createElement('button');

	item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
	item.textContent = todo.name;

	btnGroup.classList.add('btn-group', 'btn-group-sm');
	doneBtn.classList.add('btn', 'btn-success');
	doneBtn.innerHTML = '&#10003;';
	deleteBtn.classList.add('btn', 'btn-danger');
	deleteBtn.innerHTML = '&times;';

	if (todo.done) {
		item.classList.add('list-group-item-success');
	}

	// обработчик на кнопку "готово"
	doneBtn.addEventListener('click', function () {
		item.classList.toggle('list-group-item-success');
		todo.done = !todo.done;
		saveStorage(todoArr, userName);
	});

	// обработчик на удаление дела
	deleteBtn.addEventListener('click', function () {
		if (confirm('Вы уверены?')) {
			item.remove();
			todoArr = todoArr.filter(function (obj) {
				return obj.id !== todo.id;
			});
			saveStorage(todoArr, userName);
		}
	});

	btnGroup.append(doneBtn);
	btnGroup.append(deleteBtn);
	item.append(btnGroup);

	return {
		item,
		doneBtn,
		deleteBtn,
	};
}

// создание уникальных id
function generateId() {
	const array = new Uint32Array(1);
	window.crypto.getRandomValues(array);
	return array[0];
}

// сохранение данных в localStorage
function saveStorage(arr, listName) {
	localStorage.setItem(listName, JSON.stringify(arr));
}

// создание функции для работы приложения
function createTodoApp(container, title, listName) {

	let todoAppTitle = createAppTitle(title);
	let todoItemForm = createTodoItemForm();
	let todoList = createTodoList();
	userName = listName;

	// Проверка данные в localStorage
	if (localStorage.getItem(listName)) {
		todoArr = JSON.parse(localStorage.getItem(listName));
		todoArr.forEach(function (todo) {
			let todoItem = createTodoItem(todo);
			todoList.append(todoItem.item);
		});
	}

	container.append(todoAppTitle);
	container.append(todoItemForm.form);
	container.append(todoList)

	// обработчик на добавления дела
	todoItemForm.form.addEventListener('submit', function (e) {
		e.preventDefault();

		if (!todoItemForm.input.value) {
			return;
		}

		// объект дела
		let todoObj = {
			id: generateId(),
			name: todoItemForm.input.value,
			done: false,
		}

		todoArr.push(todoObj);
		saveStorage(todoArr, listName);

		let todoItem = createTodoItem(todoObj);

		todoList.append(todoItem.item);
		todoItemForm.btn.disabled = true;
		todoItemForm.input.value = '';
	});
}

window.createTodoApp = createTodoApp; // сохранение свойства в глобальный объект