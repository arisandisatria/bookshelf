const storageKey = "BOOKSHELF_STORAGE_KEY";
const addBook = document.getElementById("inputBook");
const submitButton = document.getElementById("bookSubmit");
const searchBook = document.getElementById("searchBook");

const checkForStorage = () => {
  return typeof Storage != "undefined";
};

const getBookList = () => {
  return checkForStorage() ? JSON.parse(localStorage.getItem(storageKey)) : [];
};

addBook.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const id =
    JSON.parse(localStorage.getItem(storageKey)) === null
      ? +new Date()
      : JSON.parse(localStorage.getItem(storageKey)).length + +new Date();

  if (submitButton.value == "") {
    const newBook = {
      id,
      title,
      author,
      year,
      isComplete,
    };

    insertBook(newBook);
  } else {
    const book = getBookList().filter((b) => b.id != submitButton.value);

    localStorage.setItem(storageKey, JSON.stringify(book));

    const updateBook = {
      id: submitButton.value,
      title,
      author,
      year,
      isComplete,
    };
    insertBook(updateBook);
  }

  resetForm();

  const bookData = getBookList();
  renderBookList(bookData);
});

const insertBook = (book) => {
  if (checkForStorage()) {
    let newBook = [];

    if (localStorage.getItem(storageKey) != null) {
      newBook = JSON.parse(localStorage.getItem(storageKey));
    }

    newBook.push(book);
    localStorage.setItem(storageKey, JSON.stringify(newBook));
  }
};

const renderBookList = (books) => {
  if (books === null) {
    return;
  }

  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (let book of books) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = `<h3 name="${title}" id="${id}">${title}</h3>`;
    bookItem.innerHTML += `<p>Penulis: ${author}</p>`;
    bookItem.innerHTML += `<p>Tahun: ${year}</p>`;

    let button = document.createElement("div");
    button.classList.add("action");

    const doneButton = doneReadButton(book, (e) => {
      isCompleteHandler(e.target.parentElement.parentElement);
      const bookData = getBookList();
      resetForm();
      renderBookList(bookData);
    });

    const deleteButton = deleteBookButton((e) => {
      deleteBook(e.target.parentElement.parentElement);
      const bookData = getBookList();
      resetForm();
      renderBookList(bookData);
    });

    button.append(doneButton, deleteButton);
    bookItem.append(button);

    if (isComplete === false) {
      incompleteBookshelfList.append(bookItem);
      bookItem.addEventListener("click", (e) => {
        updateBook(id);
      });
      continue;
    }

    completeBookshelfList.append(bookItem);

    bookItem.addEventListener("click", (e) => {
      if (!e.target.classList.contains("green")) {
        updateBook(id);
      }
    });
    resetForm();
  }
};

const deleteBook = (book) => {
  const books = getBookList();
  if (books.length === 0) {
    return;
  }

  const id = book.childNodes[0].getAttribute("id");
  for (let i = 0; i < books.length; i++) {
    if (books[i].id == id) {
      books.splice(i, 1);
      break;
    }
  }

  const confirmAlert = confirm("Yakin ingin menghapus?");

  if (confirmAlert) {
    localStorage.setItem(storageKey, JSON.stringify(books));
  }
};

const doneReadButton = (book, eventListener) => {
  const isReaded = book.isComplete ? "Belum selesai" : "Selesai";

  const doneButton = document.createElement("button");
  doneButton.classList.add("green");
  doneButton.innerText = isReaded + " di Baca";
  doneButton.addEventListener("click", eventListener);
  return doneButton;
};

const deleteBookButton = (eventListener) => {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus buku";
  deleteButton.addEventListener("click", (e) => {
    eventListener(e);
  });
  return deleteButton;
};

const isCompleteHandler = (book) => {
  const books = getBookList();
  if (books.length === 0) {
    return;
  }

  const title = book.childNodes[0].innerText;
  const id = book.childNodes[0].getAttribute("id");

  for (let i = 0; i < books.length; i++) {
    if (books[i].title === title && books[i].id == id) {
      books[i].isComplete = !books[i].isComplete;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(books));
};

searchBook.addEventListener("submit", (e) => {
  e.preventDefault();
  const books = getBookList();
  if (books.length === 0) {
    return;
  }

  let title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    renderBookList(books);
    return;
  }
  const bookList = searchBooks(title);
  renderBookList(bookList);
  resetForm();
});

const searchBooks = (title) => {
  const books = getBookList();
  if (books.length === 0) {
    return;
  }

  const bookList = [];

  for (let i = 0; i < books.length; i++) {
    const tempTitle = books[i].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (books[i].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(books[i]);
    }
  }
  return bookList;
};

const updateBook = (id, resetTitle) => {
  const books = getBookList();
  if (books.length === 0) {
    return;
  }

  const book = books.filter((b) => b.id == id);

  document
    .querySelector(".input_section.modal")
    .querySelector("h2").textContent = "Edit Buku";
  document.getElementById("inputBookTitle").value = book[0].title;
  document.getElementById("inputBookAuthor").value = book[0].author;
  document.getElementById("inputBookYear").value = book[0].year;
  document.getElementById("inputBookIsComplete").checked = book[0].isComplete;
  document
    .querySelector(".input_section.modal")
    .querySelector("button").textContent = "Update Buku";

  submitButton.value = book[0].id;
};

const resetForm = () => {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
  document.getElementById("searchBookTitle").value = "";
};

window.addEventListener("load", function () {
  if (checkForStorage) {
    if (localStorage.getItem(storageKey) != null) {
      const books = getBookList();
      renderBookList(books);
    }
  } else {
    alert(
      "Browser yang Anda gunakan tidak mendukung Web Storage! Gunakan browser lain!"
    );
  }
});
