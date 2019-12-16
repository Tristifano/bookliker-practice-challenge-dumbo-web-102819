let currentUser =  {}
document.addEventListener("DOMContentLoaded", function() {
    getBooks()
    getCurrentUser()
})



const getCurrentUser = () => {
    fetch('http://localhost:3000/users/1')
    .then(resp => resp.json())
    .then(user => currentUser = {...user} )
}
const getBooks = () => {
    fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then((books) => {
        books.forEach((book) => {
          let bookLi = document.createElement('li')
          bookLi.innerText = book.title 
          addBookLiListener(bookLi,book)
          document.getElementById('list').append(bookLi)
        })
    })
}

const addBookLiListener = (li,bookObj) => {
    li.addEventListener("click", () => {
        clearShowPanel()
        displayBook(bookObj)
    })
}

const clearShowPanel = () => {
    let showPanel = document.getElementById('show-panel')
    while(showPanel.firstChild) {
        showPanel.removeChild(showPanel.firstChild)
    }
}

const generateUserList = (book) => {

    book.users.forEach((user) => {
        let userLi = document.createElement('li')
        userLi.id  = user.id, userLi.innerHTML = `<strong>${user.username}</strong>`
        document.querySelector('#users-list').append(userLi)
    })
}

const displayBook = (book) => {
    let title = document.createElement('h1'),
        image = document.createElement('img'),
        summary = document.createElement('p'),
        usersList = document.createElement('ul'),
        readBtn = document.createElement('button');
    title.innerText = book.title, image.src = book.img_url, summary.innerText = book.description, readBtn.innerText = "Read Book!", usersList.id = "users-list", addReadListener(readBtn,book)
    document.getElementById('show-panel').append(title,image,summary,usersList,readBtn)
    generateUserList(book)
}

const addReadListener = (button, book) => {
    button.addEventListener("click", () => {
        let found = false
        let index = -1
        for(i=0;i < book.users.length; i++) {
            if(book.users[i].id === currentUser.id) {
                index = i
                found = true
            }
        }
        if(found) {
            deleteUser(book,index)
        } else {
            addUser(book)
        }
    })
}

const addUser = (book) => {
    
    book.users.push(currentUser)
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
            "content-type": "application/json",
            "accept":"application/json"
        },
        body: JSON.stringify({
            users: book.users
        })
    })
    .then(resp => resp.json())
    .then((newBook) => {
        console.log(newBook)
        clearShowPanel()
        displayBook(newBook)
    })
}

const deleteUser = (book,index) => {
    book.users.splice(index,1)
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
            "content-type": "application/json",
            "accept":"application/json"
        },
        body: JSON.stringify({
            users: book.users
        })
    })
    .then(resp => resp.json())
    .then((newBook) => {
        console.log(newBook)
        clearShowPanel()
        displayBook(newBook)
    })
}

