const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');



const quote = require('./quotes');
let quotes = quote.quotes;

const topselfhelpbooks = [];
const topproductivebooks = [];
const topbiographybooks = [];
const topsciencebooks = [];


// tops books array for home page

const topbook_20 = [
    "Think and Grow Rich",
    "Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future",
    "Think like a Monk",
    "The Power of your subconscious mind",
    "The ONE Thing: The Surprisingly Simple Truth Behind Extraordinary Results",
    "The Alchemist",
    "The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness",
    "The 7 Habits of Highly Effective People: Powerful Lessons in Personal Change",
    "The 4-Hour Workweek: Escape 9-5, Live Anywhere, and Join the New Rich",
    "The Subtle Art of Not Giving a F*ck"
];



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
    genre: {
        type: String,
        require: true
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
    genre: "self help",
    about: "Jay Shetty is a #1 New York Times bestselling author, award-winning storyteller, podcast host, and former monk, on a mission to make wisdom go viral. In 2019, he was AdWeek’s Young Influentials cover star, described as “an emanation of spiritual force.” In 2017, Forbes named him to their 30 Under 30 List for his game-changing impact in media. His viral videos have been viewed more than 8 billion times and he is followed by over 40 million people across social media. Jay created On Purpose, now the world’s #1 Health and Wellness podcast, in 2019. He’s been a keynote speaker around the world, from Google to Microsoft to Netflix to HSBC, and has developed corporate training programs for many clients. His Online School has been attended by over 2 million students and his Genius Coaching community provides weekly programming on the principles and practices for health and wellness to thousands of members in over 100 countries.",
    readurl: "https://book-drive.com/think-like-a-monk-by-jay-shetty/",
    buyurl: "https://www.amazon.in/Think-Like-Monk-Jay-Shetty/dp/0008386595"
});

// creating substrings for every genre top 3 books for the top route.

    // =========== self help top books =================
Book.find({$and : [{"rating" : {$gt: 4.5}}, {"genre" : "self help"}]}, function(err, books) {
    if (err) {
        console.log(err);
    } else {
        books.forEach(function(book) {
            topselfhelpbooks.push(book);
        });
    }
}).sort({"rating" : -1}).limit(3);


// =========== productive top books =================
Book.find({$and : [{"rating" : {$gt: 4.5}}, {"genre" : "productive"}]}, function(err, books) {
    if (err) {
        console.log(err);
    } else {
        books.forEach(function(book) {
            topproductivebooks.push(book);
        });
    }
}).sort({"rating" : -1}).limit(3);


// =========== biography top books =================
Book.find({$and : [{"rating" : {$gt: 4.5}}, {"genre" : "biography"}]}, function(err, books) {
    if (err) {
        console.log(err);
    } else {
        books.forEach(function(book) {
            topbiographybooks.push(book);
        });
    }
}).sort({"rating" : -1}).limit(3);


// =========== science top books =================
Book.find({$and : [{"rating" : {$gt: 4.5}}, {"genre" : "productive"}]}, function(err, books) {
    if (err) {
        console.log(err);
    } else {
        books.forEach(function(book) {
            topsciencebooks.push(book);
        });
    }
}).sort({"rating" : -1}).limit(3);




// ============= home route ===============

app.get('/', (req, res) => {

    // generating the random number.
    const num = Math.floor((Math.random() * 9) + 1);

    // accessing the data from data base.
    Book.find({"title" : {$in: topbook_20}}, function(err, books) {
        if (books.length === 0) {
            // saving the first book if the database empty.
            // book_1.save();
            console.log('successfully saved!')

            res.redirect('/');
        } else {
            // putting the random quote on the page.
            res.render('index', {books: books, quote: quotes[num].quote});
        }
    }).sort({"rating" : -1});
    
});


//  ================== post route ===============

app.get('/post', (req, res) => {
    res.render('post')
});

app.post('/post', (req, res) => {

    const newBook = new Book ({
        title: req.body.title,
        author: req.body.author,
        rating: req.body.rating,
        genre: req.body.genre,
        about: req.body.about,
        readurl: req.body.readurl,
        buyurl: req.body.buyurl
    });

    newBook.save();
    
    res.redirect('/');
});


// ================= self-help books route ==============
app.get('/self-help', (req, res) => {

    // generating the random number.
    const num = Math.floor((Math.random() * 9) + 1);

    // accessing the data from data base.
    Book.find({"genre" : "self help"}, function(err, books) {
        if (books.length === 0) {
            // saving the first book if the database empty.
            book_1.save();
            console.log('successfully saved!')

            res.redirect('/self-help');
        } else {
            // putting the random quote on the page.
            res.render('self-help', {books: books, quote: quotes[num].quote});
        }
    }).sort({"rating" : -1});
    
});


//  ======================== biography books route ============

app.get('/biography', function(req, res) {

    // generating the random number.
    const num = Math.floor((Math.random() * 9) + 1);
    
    Book.find({"genre" : "biography"}, function(err, books) {
        res.render('biography', {books: books, quote: quotes[num].quote})
    });
});


//  ====================== science  books route ============

app.get('/science', function(req, res) {

    // generating the random number.
    const num = Math.floor((Math.random() * 9) + 1);
    
    Book.find({"genre" : "science"}, function(err, books) {
        res.render('science', {books: books, quote: quotes[num].quote})
    });
});


// =================== how route =====================

app.get('/how', (req, res) => {
    res.render('how');
});

// =================== genres route =====================

app.get('/productivity', (req, res) => {

    // generating the random number.
    const num = Math.floor((Math.random() * 9) + 1);
    
    // accessing the data from data base.
    Book.find({"genre" : "productive"}, function(err, books) {
        if (books.length === 0) {
            // saving the first book if the database empty.
            probook_1.save();
            console.log('successfully saved!')

            res.redirect('/productivity');
        } else {
            // putting the random quote on the page.
            res.render('productivity', {probooks: books, quote: quotes[num].quote});
        }
    }).sort({"rating" : -1});
});


// ===================== bookblog route ===================

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



// =================== Top Books routing ==============


app.get('/top', (req, res) => {

    

    // generating the random number.
    const num = Math.floor((Math.random() * 9) + 1);

    res.render('top', {
        topselfhelpbooks : topselfhelpbooks,
        topproductivebooks: topproductivebooks,
        topbiographybooks: topbiographybooks,
        topsciencebooks: topsciencebooks,
        quote: quotes[num].quote
    });

});


app.listen(3000, function() {
    console.log('server running on port 3000.');
});
