const express = require('express');
const {books} = require('../data/books.json');
const {users} = require('../data/users.json');

const router = express.Router();

/**
 * Routes: /books
 * Method: GET
 * Description: Get all the books in the system
 * Access: Public
 * Parameters: None
 */

router.get('/', (req,res)=>{
    res.status(200).json({
        Success:true,
        data: books
    })
})

/**
 * Routes: /books/:id
 * Method: GET
 * Description: Get a book by it's ID
 * Access: Public
 * Parameters: id
 */

router.get('/:id', (req,res)=>{
    const {id} = req.params;    
    const book = books.find((each)=> each.id === id);
    if(!book){
        return res.status(404).json({
            Success:false,
            message: `Book with the id ${id} not found`
        });
    }
    
    res.status(200).json({
        Success:true,
        data: book
    })
});

/**
 * Routes: /books
 * Method: POST
 * Description: Add a new book to the system
 * Access: Public
 * Parameters: None
 */
router.post('/', (req,res)=>{
    // req.body should contain all the details of the book
    const {id, name, author, genre, price, publisher} = req.body;
    // check if all the required fields are present
    if(!id || !name || !author || !genre || !price || !publisher){
        return res.status(400).json({
            Success:false,
            mmessage: "Please provide all the required fields"
        });
    }

    // check if a book with the same id already exists
    const bookExists = books.find((each)=> each.id === id);
    if(bookExists){
        return res.status(409).json({
            Success:false,
            message: `Book with the id ${id} already exists`
        });
    }
    // create a new book object
    const newBook = {
        id,
        name,
        author,
        genre,
        price,
        publisher
    };
    // add the new book to the books array
    books.push(newBook);
    res.status(201).json({
        Success:true,
        message: "books created successfully",
        data: newBook
    });
});

/**
 * Routes: /books/:id
 * Method: PUT 
 * Description: Update a book by it's ID
 * Access: Public
 * Parameters: ID
 */
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    // check if the user exists !!
    const book = books.find((each)=> each.id === id);
    if(!book){
        return res.status(404).json({
            Success:false,
            message: `Book with the id ${id} not found`
        });
    }

    // update the user details
    // Method 1
    // Object.assign(book , data); 

    // Alternatively, you can update each field individually
    // const {name, author, genre, price, publisher} = data;

    //  one more method using spread operator
    const UpdatedBook = books.map((each) => {
        if(each.id === id){
            return {
                ...each,
                ...data
            }
        }
        return each
    })

    res.status(200).json({
        Success:true,
        data: UpdatedBook,
        message: "Book details updated successfully"
    })

});


/**
 * Routes: /books/:id
 * Method: DELETE 
 * Description: Delete a book by it's ID
 * Access: Public
 * Parameters: ID
 */
router.delete('/:id' , (req,res) => {
    const {id} = req.params;

    // check if the book is exists
    const book = books.find((each) => each.id === id)
    if(!book){
        return res.status(404).json({
            success : false,
            message : `Book with the id ${id} not found`
        })
    }
    //  Delete the book from the book array
    const deletedBook = books.filter((each) => each.id !== id)
    res.status(200).json({
        Success:true,
        message: "Book deleted successfully",
        data: deletedBook
    })
})

/**
 * Routes: /books/issued/for-users
 * Method: GET
 * Description: Get all the issued books
 * Access: Public
 * Parameters: id
 */
router.get('/issued/for-users', (req, res) => {
    
    const usersWithIssuedBooks = users.filter((each) => {
        if(each.issuedBook){
            return each
        }
    });

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);     

            book.issuedBy = each.name;
            book.issuedDate = each.issuedDate;
            book.returnDate = each.returnDate;
            
            issuedBooks.push(book);
    });


    if (!issuedBooks === 0) { 
        return res.status(404).json({
            success: false,
            message: "No Book issued Yet !!"
        });
    }

    res.status(200).json({
        success: true,
        data: issuedBooks
    });
});



module.exports = router;