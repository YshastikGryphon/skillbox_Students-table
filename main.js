(() => {
  const appTittle = 'StudentsTable';
  let globalID = 0;
  let sortName = 'none';
  let sortAscending = true;

  // Формы ввода
  const inputAll = document.querySelectorAll('.form-input');
  const inputName = document.getElementById('name');
  const inputBirthday = document.getElementById('birthday');
  const inputEnroll = document.getElementById('enroll');
  const inputFaculty = document.getElementById('faculty');
  const inputSubmit = document.getElementById('submit');
  // Строки ошибок
  const errorName = document.getElementById('error-name');
  const errorBirthday = document.getElementById('error-birthday');
  const errorEnroll = document.getElementById('error-enroll');
  const errorFaculty = document.getElementById('error-faculty');
  // Фильтры
  const filterForm = document.getElementById('filter-form');
  const filterName = document.getElementById('filter-name');
  const filterGraduate = document.getElementById('filter-graduate');
  const filterEnroll = document.getElementById('filter-enroll');
  const filterFaculty = document.getElementById('filter-faculty');
  // Сортировка
  const sortAll = document.querySelectorAll('.sort');
  const sortByName = document.getElementById('sortByName');
  const sortByBirthday = document.getElementById('sortByBirhday');
  const sortByAge = document.getElementById('sortByAge');
  const sortByEnroll = document.getElementById('sortByEnroll');
  const sortByCourse = document.getElementById('sortByCourse');
  const sortByFaculty = document.getElementById('sortByFaculty');
  // Таблица
  const tableStudent = document.getElementById('table-body');
  // Особое
  const rngButton = document.getElementById('rng');

  // Глобальный идентификатор
  for (let i = 0; i < localStorage.length; i++) {
    // Найти наибольший ID
    const checkID = Number(localStorage.key(i));
    if (!isNaN(checkID)) {
      globalID = Math.max(globalID, checkID);
    }
  }

  function createStudent() {
    globalID++;
    let name = inputName.value;
    name = name.trim();
    name = name.replace(/\s+/g, ' ');
    const fio = name.split(' ');
    const info = {
      appTittle: appTittle,
      id: globalID,
      name: fio[0],
      surname: fio[1],
      patronymic: fio[2],
      birthday: inputBirthday.value,
      enroll: inputEnroll.value,
      faculty: inputFaculty.value,
    };
    localStorage.setItem(globalID, JSON.stringify(info));
    renderStudentsTable();
  }

  // Взять запись из LocalStorage
  function getStorageItem(seekID, seekTitle) {
    const array = JSON.parse(localStorage.getItem(seekID));
    if (array.appTittle === seekTitle) {
      return array;
    }
    return null;
  }

  // Взять массив Всех записей из LocalStorage
  function takeArrayFromStorage() {
    let returnArray = [];
    for (let localStorageKey in localStorage) {
      if (!localStorage.hasOwnProperty(localStorageKey)) {
        continue;
      }
      let array = getStorageItem(localStorageKey, appTittle);
      if (array !== null) {
        returnArray.push(array);
      }
    }
    return returnArray;
  }

  function sortArray(array) {
    // Функции сортировки
    function asc(a, b) {
      return a[sortName] - b[sortName];
    }

    function ascDate(a, b) {
      return new Date(b[sortName]) - new Date(a[sortName]);
    }

    function desDate(a, b) {
      return new Date(a[sortName]) - new Date(b[sortName]);
    }
    function ascStr(a, b) {
      const nameA = a[sortName].toUpperCase();
      const nameB = b[sortName].toUpperCase();
      // сравнить
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    }

    function desStr(a, b) {
      const nameA = a[sortName].toUpperCase();
      const nameB = b[sortName].toUpperCase();
      // сравнить
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
      return 0;
    }

    // Сортирвать по запросу
    let newArray = [];
    switch (sortName) {
      case ('name'):
        if (sortAscending === true) {
          newArray = array.sort(ascStr);
        } else {
          newArray = array.sort(desStr);
        }
        break;
      case ('birthday'):
        if (sortAscending === true) {
          newArray = array.sort(ascDate);
        } else {
          newArray = array.sort(desDate);
        }
        break;
      case ('enroll'):
        if (sortAscending === true) {
          newArray = array.sort(ascDate);
        } else {
          newArray = array.sort(desDate);
        }
        break;
      case ('faculty'):
        if (sortAscending === true) {
          newArray = array.sort(ascStr);
        } else {
          newArray = array.sort(desStr);
        }
        break;
      case ('none'):
      default:
        newArray = array.sort(asc);
        break;
    }
    return newArray;
  }

  function diffArrayDateToday(dateArr) {
    const today = new Date();
    const dateArrSplit = dateArr.split('-');
    let years = (today.getFullYear() - Number(dateArrSplit[0]));
    if (((today.getDate() < Number(dateArrSplit[2])) && ((today.getMonth() + 1) === Number(dateArrSplit[1]))) || (today.getMonth() + 1) < Number(dateArrSplit[1])) {
      years--;
    }
    return years;
  }

  function isCourseOver(year) {
    const today = new Date();
    let years = (today.getFullYear() - Number(year) + 1);
    if (((today.getDate() < 1) && (today.getMonth() === 8)) || (today.getMonth() < 8)) {
      years--;
    }
    if (years === 0) {
      return '<span title="Поступил в этом году.">Зачислен<span>';
    }
    if (years > 4) {
      const graduate = Number(year) + 4;
      return ('<span title="Окончил обучение.">Выпускник<span>');
    }
    return years;
  }

  // Рендер строки
  function renderStudentRow(array) {
    const row = document.createElement('tr');
    const fio = document.createElement('td');
    const bday = document.createElement('td');
    const age = document.createElement('td');
    const enroll = document.createElement('td');
    const course = document.createElement('td');
    const faculty = document.createElement('td');
    const deleteBtn = document.createElement('button');
    fio.textContent = `${array.name} ${array.surname} ${array.patronymic}`;
    row.append(fio);
    bday.textContent = array.birthday;
    row.append(bday);
    age.textContent = diffArrayDateToday(array.birthday);
    row.append(age);
    enroll.textContent = `${array.enroll}-${Number(array.enroll) + 4}`;
    row.append(enroll);
    course.innerHTML = isCourseOver(array.enroll);
    row.append(course);
    faculty.textContent = array.faculty;
    row.append(faculty);
    deleteBtn.textContent = 'Удалить';
    deleteBtn.classList.add('btn', 'btn-outline-primary');
    deleteBtn.setAttribute('id', array.id);
    deleteBtn.addEventListener('click', () => {
      if (!confirm('Удалить?')) {
        return;
      }
      localStorage.removeItem(deleteBtn.id);
      renderStudentsTable();
    });
    row.append(deleteBtn);
    tableStudent.append(row);
  }

  // Рендер раблицы во всеми значениями
  function renderStudentsTable() {
    // Взять все значения
    const array = takeArrayFromStorage();
    // Очистить
    tableStudent.innerHTML = '';
    // Фильтровать
    const renderArray = sortArray(array);
    // Создать
    for (let i = 0; i < renderArray.length; i++) {
      renderStudentRow(renderArray[i]);
    }
  }

  // Рендер раблицы во всеми значениями
  function renderStudentsTableCustom(array) {
    // Очистить
    tableStudent.innerHTML = '';
    // Фильтровать
    const renderArray = sortArray(array);
    // Создать
    for (let i = 0; i < renderArray.length; i++) {
      renderStudentRow(renderArray[i]);
    }
  }

  function checkErrors() {
    let errors = false;
    const today = new Date();
    if (!inputName.value) {
      errorName.innerText = 'Пустое поле';
      errors = true;
    } else {
      let name = inputName.value;
      name = name.trim();
      name = name.replace(/\s+/g, ' ');
      const nameLength = name.split(' ').length;
      switch (true) {
        case (nameLength < 3):
          errorName.innerText = 'Недостаточно значений';
          errors = true;
          break;
        case (nameLength > 3):
          errorName.innerText = 'Лишние значения!';
          errors = true;
          break;
        default:
          errorName.innerText = '';
          break;
      }
    }
    if (!inputBirthday.value) {
      errorBirthday.innerText = 'Неверное значение';
      errors = true;
    } else {
      let checkDate = new Date(inputBirthday.value);
      switch (true) {
        case (Number(checkDate.getFullYear()) < 1900):
          errorBirthday.innerText = 'Не ранее 1900 года';
          errors = true;
          break;
        case ((checkDate.getFullYear() > today.getFullYear()) || (checkDate.getFullYear() === today.getFullYear() && (checkDate.getMonth() > today.getMonth())) || (checkDate.getFullYear() === today.getFullYear() && checkDate.getMonth() === today.getMonth() && checkDate.getDate() > today.getDate())):
          errorBirthday.innerText = 'Значение в будущем';
          errors = true;
          break;
        default:
          errorBirthday.innerText = '';
          break;
      }
    }
    if (!inputEnroll.value) {
      errorEnroll.innerText = 'Неверное значение';
      errors = true;
    } else {
      switch (true) {
        case (inputEnroll.value < 1900):
          errorEnroll.innerText = 'Не ранее 1900 года';
          errors = true;
          break;
        case (inputEnroll.value > Number(today.getFullYear())):
          errorEnroll.innerText = 'Значение в будущем';
          errors = true;
          break;
        default:
          errorEnroll.innerText = '';
          break;
      }
    }
    if (!inputFaculty.value) {
      errorFaculty.innerText = 'Вы пропустили';
      errors = true;
    } else {
      errorFaculty.innerText = '';
    }
    return errors;
  }

  // Фильтрация
  function filterTable(array) {
    let filteredArray = array;
    // Фильтрация имя
    if (filterName.value !== '') {
      let savedArray = [];
      for (let i = 0; i < filteredArray.length; i++) {
        const name = String(filteredArray[i].name).toUpperCase();
        const surname = String(filteredArray[i].surname).toUpperCase();
        const patronymic = String(filteredArray[i].patronymic).toUpperCase();
        const check = name + surname + patronymic;
        if (check.includes(filterName.value.toUpperCase())) {
          savedArray.push(filteredArray[i]);
        }
      }
      filteredArray = savedArray;
    }
    // Фильтрация год поступления
    if (filterEnroll.value !== '') {
      let savedArray = [];
      for (let i = 0; i < filteredArray.length; i++) {
        const year = filteredArray[i].enroll;
        if (year === filterEnroll.value) {
          savedArray.push(filteredArray[i]);
        }
      }
      filteredArray = savedArray;
    }

    // Фильтрация год окончания
    if (filterGraduate.value !== '') {
      let savedArray = [];
      for (let i = 0; i < filteredArray.length; i++) {
        const year = Number(filteredArray[i].enroll) + 4;
        if (year === Number(filterGraduate.value)) {
          savedArray.push(filteredArray[i]);
        }
      }
      filteredArray = savedArray;
    }

    // Фильтрация факультет
    if (filterFaculty.value !== '') {
      let savedArray = [];
      for (let i = 0; i < filteredArray.length; i++) {
        const name = String(filteredArray[i].faculty).toUpperCase();
        if (name.includes(filterFaculty.value.toUpperCase())) {
          savedArray.push(filteredArray[i]);
        }
      }
      filteredArray = savedArray;
    }

    return filteredArray;
  }

  function randomStudent() {
    function getRandom(max) {
      return Math.floor(Math.random() * max);
    }
    globalID++;
    const rngNames = ['Виктор', 'Аня', 'Андрей', 'Оля', 'Олег', 'Тамара'];
    const rngSurnames = ['Грозов', 'Мирный', 'Стрелец', 'Любов', 'Иванов'];
    const rngPatronymics = ['Вячеславович', 'Петрович', 'Юрьевич', 'Анатольевич'];
    const rngDates = ['1990-05-30', '1994-07-20', '2000-03-14', '1995-12-12', '1993-08-25', '1998-02-02', '1994-05-30', '1998-09-21'];
    const rngEnroll = ['2016', '2020', '2022', '2021', '2019'];
    const rngFaculty = ['Слизерин', 'Гриффиндор', 'Когтевран', 'Пуффендуй'];
    const info = {
      appTittle: appTittle,
      id: globalID,
      name: rngNames[getRandom(6)],
      surname: rngSurnames[getRandom(5)],
      patronymic: rngPatronymics[getRandom(4)],
      birthday: rngDates[getRandom(8)],
      enroll: rngEnroll[getRandom(5)],
      faculty: rngFaculty[getRandom(4)],
    };
    localStorage.setItem(globalID, JSON.stringify(info));
    renderStudentsTable();
  }

  // Разместить скрипты
  function placeScripts() {
    inputSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const errors = checkErrors();
      if (errors === true) {
        return;
      }
      createStudent();
      inputAll.forEach((elem) => {
        elem.value = '';
      });
    });

    sortByName.addEventListener('click', () => {
      sortAll.forEach((e) => {
        if (e === sortByName) {
          return;
        }
        e.classList.remove('sort--ascend');
        e.classList.remove('sort--descend');
      });
      switch (true) {
        case (sortByName.classList.contains('sort--descend')):
          sortByName.classList.remove('sort--ascend');
          sortByName.classList.remove('sort--descend');
          sortName = 'none';
          sortAscending = true;
          break;
        case (sortByName.classList.contains('sort--ascend')):
          sortByName.classList.remove('sort--ascend');
          sortByName.classList.add('sort--descend');
          sortName = 'name';
          sortAscending = false;
          break;
        default:
          sortByName.classList.add('sort--ascend');
          sortByName.classList.remove('sort--descend');
          sortName = 'name';
          sortAscending = true;
          break;
      }
      renderStudentsTable();
    });

    sortByBirthday.addEventListener('click', () => {
      sortAll.forEach((e) => {
        if (e === sortByBirthday) {
          return;
        }
        e.classList.remove('sort--ascend');
        e.classList.remove('sort--descend');
      });
      switch (true) {
        case (sortByBirthday.classList.contains('sort--descend')):
          sortByBirthday.classList.remove('sort--ascend');
          sortByBirthday.classList.remove('sort--descend');
          sortName = 'birthday';
          sortAscending = true;
          break;
        case (sortByBirthday.classList.contains('sort--ascend')):
          sortByBirthday.classList.remove('sort--ascend');
          sortByBirthday.classList.add('sort--descend');
          sortName = 'birthday';
          sortAscending = false;
          break;
        default:
          sortByBirthday.classList.add('sort--ascend');
          sortByBirthday.classList.remove('sort--descend');
          sortName = 'birthday';
          sortAscending = true;
          break;
      }
      renderStudentsTable();
    });

    sortByAge.addEventListener('click', () => {
      sortAll.forEach((e) => {
        if (e === sortByAge) {
          return;
        }
        e.classList.remove('sort--ascend');
        e.classList.remove('sort--descend');
      });
      switch (true) {
        case (sortByAge.classList.contains('sort--descend')):
          sortByAge.classList.remove('sort--ascend');
          sortByAge.classList.remove('sort--descend');
          sortName = 'birthday';
          sortAscending = true;
          break;
        case (sortByAge.classList.contains('sort--ascend')):
          sortByAge.classList.remove('sort--ascend');
          sortByAge.classList.add('sort--descend');
          sortName = 'birthday';
          sortAscending = false;
          break;
        default:
          sortByAge.classList.add('sort--ascend');
          sortByAge.classList.remove('sort--descend');
          sortName = 'birthday';
          sortAscending = true;
          break;
      }
      renderStudentsTable();
    });

    sortByEnroll.addEventListener('click', () => {
      sortAll.forEach((e) => {
        if (e === sortByEnroll) {
          return;
        }
        e.classList.remove('sort--ascend');
        e.classList.remove('sort--descend');
      });
      switch (true) {
        case (sortByEnroll.classList.contains('sort--descend')):
          sortByEnroll.classList.remove('sort--ascend');
          sortByEnroll.classList.remove('sort--descend');
          sortName = 'none';
          sortAscending = true;
          break;
        case (sortByEnroll.classList.contains('sort--ascend')):
          sortByEnroll.classList.remove('sort--ascend');
          sortByEnroll.classList.add('sort--descend');
          sortName = 'enroll';
          sortAscending = false;
          break;
        default:
          sortByEnroll.classList.add('sort--ascend');
          sortByEnroll.classList.remove('sort--descend');
          sortName = 'enroll';
          sortAscending = true;
          break;
      }
      renderStudentsTable();
    });

    sortByCourse.addEventListener('click', () => {
      sortAll.forEach((e) => {
        if (e === sortByCourse) {
          return;
        }
        e.classList.remove('sort--ascend');
        e.classList.remove('sort--descend');
      });
      switch (true) {
        case (sortByCourse.classList.contains('sort--descend')):
          sortByCourse.classList.remove('sort--ascend');
          sortByCourse.classList.remove('sort--descend');
          sortName = 'none';
          sortAscending = true;
          break;
        case (sortByCourse.classList.contains('sort--ascend')):
          sortByCourse.classList.remove('sort--ascend');
          sortByCourse.classList.add('sort--descend');
          sortName = 'enroll';
          sortAscending = false;
          break;
        default:
          sortByCourse.classList.add('sort--ascend');
          sortByCourse.classList.remove('sort--descend');
          sortName = 'enroll';
          sortAscending = true;
          break;
      }
      renderStudentsTable();
    });

    sortByFaculty.addEventListener('click', () => {
      sortAll.forEach((e) => {
        if (e === sortByFaculty) {
          return;
        }
        e.classList.remove('sort--ascend');
        e.classList.remove('sort--descend');
      });
      switch (true) {
        case (sortByFaculty.classList.contains('sort--descend')):
          sortByFaculty.classList.remove('sort--ascend');
          sortByFaculty.classList.remove('sort--descend');
          sortName = 'faculty';
          sortAscending = true;
          break;
        case (sortByFaculty.classList.contains('sort--ascend')):
          sortByFaculty.classList.remove('sort--ascend');
          sortByFaculty.classList.add('sort--descend');
          sortName = 'faculty';
          sortAscending = false;
          break;
        default:
          sortByFaculty.classList.add('sort--ascend');
          sortByFaculty.classList.remove('sort--descend');
          sortName = 'faculty';
          sortAscending = true;
          break;
      }
      renderStudentsTable();
    });

    filterForm.addEventListener('change', () => {
      const renderArray = filterTable(takeArrayFromStorage());
      renderStudentsTableCustom(renderArray);
    });

    rngButton.addEventListener('click', () => {
      randomStudent();
    });
  }

  // Инициализировать
  function initializeStudents() {
    placeScripts();
    renderStudentsTable();
  }

  // Передача функции для использования
  window.createGamePari = initializeStudents();
})();
