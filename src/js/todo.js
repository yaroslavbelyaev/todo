import { createTaskData } from './data.js';
import { renderTask } from './task.js';
import { getCount } from './counter.js';
import { saveLocal } from './local.js';
import { initFilters } from './filter.js';

const input = document.querySelector('.todo__new');
const todoList = document.querySelector('.todo__list');
const buttonClearCompleted = document.querySelector('.filters__button');
const buttonStrelka = document.querySelector('.todo__button');
let todos = JSON.parse(localStorage.getItem('todos')) || [];

const showButton = () => {
  const element = document.querySelectorAll('.todo__item');
  const hasEventSome = todos.some((task) => task.completed === true);
  buttonClearCompleted.style.display = 'none';
  element.forEach(() => {
    if(hasEventSome) {
      buttonClearCompleted.style.display = 'block';
    } else {
      buttonClearCompleted.style.display = 'none';
    }
  });
};

const completedTask = (evt) => {
  if (!evt.target.classList.contains('todo__item-input')) {
    return;
  }
  const parenNode = evt.target.closest('.todo__item');
  const parenNodeId = Number(parenNode.dataset.id);
  const taskElement = todos.find((it) => it.id === parenNodeId);

  taskElement.completed = !taskElement.completed;
  parenNode.classList.toggle('todo__item--completed');
  getCount();
  saveLocal();
  showButton();
};

const deleteTask = (evt) => {
  if (!evt.target.classList.contains('todo__item-close')) {
    return;
  }

  const parenNode = evt.target.closest('.todo__item');
  const parenNodeId = Number(parenNode.dataset.id);
  todos = todos.filter((it) => it.id !== parenNodeId);
  parenNode.remove();
  getCount();
  saveLocal();
};

const clearCompleted = () => {
  buttonClearCompleted.addEventListener('click', () => {
    const element = document.querySelectorAll('.todo__item');
    element.forEach((item) => {
      if(!item.classList.contains('todo__item--completed')) {
        return;
      }
      item.remove();
      todos = todos.filter((task) => task.completed !== true);
      saveLocal();
    });
    showButton();
  });
};

const onButtonClickStrelka = () => {
  let isTodosLocked = false;
  buttonStrelka.addEventListener('change', () => {
    todos.forEach((item) => {
      const element = document.querySelector(`.todo__item[data-id="${item.id}"]`);
      if(isTodosLocked) {
        item.completed = false;
        element.classList.remove('todo__item--completed');
        element.querySelector('.todo__item-input').checked = false;
      } else {
        item.completed = true;
        element.classList.add('todo__item--completed');
        element.querySelector('.todo__item-input').checked = true;
      }
    });
    isTodosLocked = !isTodosLocked;
    saveLocal();
    getCount();
    showButton();
  });
};

const getTodoData = (id) => todos.find((task) => task.id === Number(id));

const editOfTask = (evt) => {
  if(!evt.target.classList.contains('todo__text')) {
    return;
  }
  const parenNode = evt.target.closest('.todo__item');
  const parenNodeId = Number(parenNode.dataset.id);
  const parenText = parenNode.querySelector('.todo__text');
  parenNode.classList.add('edit');
  parenText.setAttribute('contenteditable', true);
  parenNode.focus();
  parenText.addEventListener('keyup', () => {
    const todo = getTodoData(parenNodeId);
    todo.title = parenText.textContent;
    saveLocal();
  });

  // eslint-disable-next-line no-shadow
  parenText.addEventListener('keydown', (evt) => {
    if (parenText.innerHTML === '' && evt.key === 'Enter') {
      todos = todos.filter((task) => task.id !== parenNodeId);
      parenNode.remove();
    }

    if(evt.key === 'Enter') {
      parenText.setAttribute('contenteditable', false);
    }
    saveLocal();
    getCount();
  });

  showButton();
};

const init = () => {
  input.addEventListener('keydown', (evt) => {
    if (input.value === '') {
      return;
    }

    if (evt.key === 'Enter') {
      const newTodo = createTaskData();
      renderTask(newTodo);
      todos.push(newTodo);
      saveLocal();
      getCount();
      initFilters();
      input.value = '';
    }
  });
  clearCompleted();
  onButtonClickStrelka();

  todoList.addEventListener('change', completedTask);
  todoList.addEventListener('click', deleteTask);
  todoList.addEventListener('dblclick', editOfTask);
};


export { init, todos, showButton };
