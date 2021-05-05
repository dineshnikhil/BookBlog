const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');


const quote = require('./quotes');
let quotes = quote.quotes;


const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));


// connecting to the database mongodb.

mongoose.connect("mongodb://localhost:27017/booksDB", {useNewUrlParser: true, useUnifiedTopology: true});
// the book Schema code.
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true,
        min: 1,
        max: 5
    },
    about: {
        type: String,
        require: true
    },
    readurl: {
        type: String
    },
    buyurl: {
        type: String,
        require: true
    },

});

// creating the book model for the book schema.

const Book = mongoose.model("book", bookSchema);


// creating the observation using book mobel.

const book_1 = new Book({
    title: "Think like a Monk",
    author: "Jay Shetty",
    rating: 4.8,
    about: "Jay Shetty is a #1 New York Times bestselling author, award-winning storyteller, podcast host, and former monk, on a mission to make wisdom go viral. In 2019, he was AdWeek’s Young Influentials cover star, described as “an emanation of spiritual force.” In 2017, Forbes named him to their 30 Under 30 List for his game-changing impact in media. His viral videos have been viewed more than 8 billion times and he is followed by over 40 million people across social media. Jay created On Purpose, now the world’s #1 Health and Wellness podcast, in 2019. He’s been a keynote speaker around the world, from Google to Microsoft to Netflix to HSBC, and has developed corporate training programs for many clients. His Online School has been attended by over 2 million students and his Genius Coaching community provides weekly programming on the principles and practices for health and wellness to thousands of members in over 100 countries.",
    readurl: "https://book-drive.com/think-like-a-monk-by-jay-shetty/",
    buyurl: "https://www.amazon.in/Think-Like-Monk-Jay-Shetty/dp/0008386595"
});

// here we are saving the observation in the database.

// book_1.save();

app.get('/', (req, res) => {

    // generating the random number.
    const num = Math.floor((Math.random() * 9) + 1);

    // accessing the data from data base.
    Book.find(function(err, books) {
        if (books.length === 0) {
            // saving the first book if the database empty.
            book_1.save();
            console.log('successfully saved!')

            res.redirect('/');
        } else {
            // putting the random quote on the page.
            res.render('index', {books: books, quote: quotes[num].quote});
        }
    });
    
});


app.get('/post', (req, res) => {
    res.render('post')
});

app.post('/post', (req, res) => {

    const newBook = new Book ({
        title: req.body.title,
        author: req.body.author,
        rating: req.body.rating,
        about: req.body.about,
        readurl: req.body.readurl,
        buyurl: req.body.buyurl
    });

    newBook.save();
    
    res.redirect('/');
});

app.get('/how', (req, res) => {
    res.render('how');
});

app.get('/genres', (req, res) => {
    res.render('genres');
});


app.get('/bookblog/:title', (req, res) => {

    Book.find(function(err, books) {
        books.forEach(function(book) {
            if (_.lowerCase(book.title) === _.lowerCase(req.params.title)) {
                res.render('bookblog', {title: book.title,
                                        author: book.author,
                                        rating: book.rating,
                                        about: book.about,
                                        readurl: book.readurl,
                                        buyurl: book.buyurl
                                        });
            }
        });
    });
    
});


app.listen(3000, function() {
    console.log('server running on port 3000.');
});
