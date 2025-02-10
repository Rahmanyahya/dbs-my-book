// Default Books
let defaultBooks = [
    {
      id: '1',
      title: 'Alexander Great',
      author: 'Jeje',
      year: 1935,
      isComplete: true
    },
    {
      id: '2',
      title: 'Anonymous',
      author: 'Hackers',
      year: 1980,
      isComplete: true
    },
    {
      id: '3',
      title: 'John The Ripper',
      author: 'Salinger',
      year: 1961,
      isComplete: false
    },
    {
      id: '4',
      title: 'WW II',
      author: 'Orwell',
      year: 1949,
      isComplete: false
    }
  ];


// Generate random id 4 digit
function generateId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
// Local Storage methods
let books = JSON.parse(localStorage.getItem('books')) || defaultBooks;
localStorage.setItem('books', JSON.stringify(books));
  
  // DOM Elements
  const bookForm = document.getElementById('bookForm');
  const searchForm = document.getElementById('searchBook');
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');
  const isCompleteCheckbox = document.getElementById('bookFormIsComplete');
  const submitSpan = document.querySelector('#bookFormSubmit span');

  // Update buku base checkboc
  isCompleteCheckbox.addEventListener('change', (e) => {
    submitSpan.textContent = e.target.checked ? 'Finished' : 'Unfinished';
  });

  // Submision Form Handler
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const book = {
      id: generateId(),
      title: e.target.bookFormTitle.value,
      author: e.target.bookFormAuthor.value,
      year: parseInt(e.target.bookFormYear.value),
      isComplete: e.target.bookFormIsComplete.checked
    };
    
    books.push(book);
    saveBooks();
    renderBooks();
    e.target.reset();
  });

  // Search handler
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = e.target.searchBookTitle.value.toLowerCase();
    
    const filteredBooks = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm)
    );
    
    renderBooks(filteredBooks);
  });

  // Add New Book handler
  function createBookElement(book) {
    const div = document.createElement('div');
    div.setAttribute('data-bookid', book.id);
    div.setAttribute('data-testid', 'bookItem');
    div.className = 'book-item';
    
    div.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Author: ${book.author}</p>
      <p data-testid="bookItemYear">Year: ${book.year}</p>
      <div class="button-group">
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? 'Belum Selesai' : 'Selesai'}
        </button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;
    
    // Add Event Listener Group
    const toggleButton = div.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const deleteButton = div.querySelector('[data-testid="bookItemDeleteButton"]');
    const editButton = div.querySelector('[data-testid="bookItemEditButton"]');
    
    toggleButton.addEventListener('click', () => toggleBookStatus(book.id));
    deleteButton.addEventListener('click', () => deleteBook(book.id));
    editButton.addEventListener('click', () => editBook(book.id));
    
    return div;
  }

  // Book Status
  function toggleBookStatus(id) {
    const book = books.find(b => b.id === id);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    }
  }

  // Destroy book
  function deleteBook(id) {
      books = books.filter(b => b.id !== id);
      defaultBooks = defaultBooks.filter(b => b.id !== id);
      saveBooks();
      renderBooks();
  }

  // Audit book
  function editBook(id) {
    const book = books.find(b => b.id === id);
    if (book) {
      document.getElementById('bookFormTitle').value = book.title;
      document.getElementById('bookFormAuthor').value = book.author;
      document.getElementById('bookFormYear').value = book.year;
      document.getElementById('bookFormIsComplete').checked = book.isComplete;
      
      books = books.filter(b => b.id !== id);
      saveBooks();
      renderBooks();
      
      document.querySelector('.form-add').scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Save books 
  function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
  }

  // Render books from local storage
  function renderBooks(booksToRender = books) {
    incompleteList.innerHTML = '';
    completeList.innerHTML = '';
    
    booksToRender.forEach(book => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeList.appendChild(bookElement);
      } else {
        incompleteList.appendChild(bookElement);
      }
    });
  }

  // Fetcher to Render books
  renderBooks();