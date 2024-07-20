document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
  });

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      searchBook();
  });

  if (isStorageExist()) {
      loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
      id,
      title,
      author,
      year,
      isComplete
  }
}

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear =  parseInt(document.getElementById('inputBookYear').value);
  const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  
  const toast = document.getElementById('toast');
    toast.innerText = "Data buku berhasil disimpan.";
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show'); }, 2500); 
        
  {
    id= "string",
    title= "string",
    author= "string",
    year= "number",
    isComplete= "boolean"
  }
}

const isCompleteCheckbox = document.querySelector("#inputBookIsComplete");
      isCompleteCheckbox.addEventListener("change", function () {
          const bookSubmitButton = document.querySelector("#bookSubmit");
          const spanKeterangan = bookSubmitButton.querySelector(".Keterangan");

          if (isCompleteCheckbox.checked) {
              spanKeterangan.innerText = "Selesai dibaca";
          } else {
              spanKeterangan.innerText = "Belum selesai dibaca";
          }
      }
    )

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
          incompleteBookshelfList.append(bookElement);
      } else {
          completeBookshelfList.append(bookElement);
      }
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement('p');
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('book_item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green');
      undoButton.innerText = 'Belum selesai dibaca';

      undoButton.addEventListener('click', function () {
          undoBookFromCompleted(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus buku';

      trashButton.addEventListener('click', function () {
          removeBook(bookObject.id);
      });

      container.append(undoButton, trashButton);
  } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('green');
      checkButton.innerText = 'Selesai dibaca';

      checkButton.addEventListener('click', function () {
          addBookToCompleted(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus buku';

      trashButton.addEventListener('click', function () {
          removeBook(bookObject.id);
      });

      container.append(checkButton, trashButton);
  }

  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
      if (bookItem.id === bookId) {
          return bookItem;
      }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
      if (books[index].id === bookId) {
          return index;
      }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
      for (const book of data) {
          books.push(book);
      }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
  }
  return true;
}

function searchBook() {
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  for (const bookItem of books) {
      if (bookItem.title.toLowerCase().includes(searchTitle)) {
          const bookElement = makeBook(bookItem);
          if (!bookItem.isComplete) {
              incompleteBookshelfList.append(bookElement);
          } else {
              completeBookshelfList.append(bookElement);
          }
      }
  }
}