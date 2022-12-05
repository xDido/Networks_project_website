var express = require('express');
var path = require('path');
var app = express();
let alert = require('alert');
const session = require('express-session');
const bodyParser = require('body-parser');
const req = require('express/lib/request');

var { MongoClient } = require('mongodb');
var uri = "mongodb+srv://admin:admin@cluster0.9mj9q.mongodb.net/firstdb?retryWrites=true&w=majority"
var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: false,
    resave: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function auth(req, res, next) {
    if ("username" in req.session) {
        next()

    } else {
        res.redirect('/')
    }
}
//GET requests
app.get('/', function (req, res) {
    res.render('login')
});

app.get('/registration', function (req, res) {
    res.render('registration')
});

app.get('/home', auth, function (req, res) {
    res.render('home')
});

app.get('/books', auth, function (req, res) {
    res.render('books')
});

app.get('/boxing', auth, function (req, res) {
    res.render('boxing')
});

app.get('/cart', auth, function (req, res) {
    res.render('cart')
});

app.get('/galaxy', auth, function (req, res) {
    res.render('galaxy')
});

app.get('/iphone', auth, function (req, res) {
    res.render('iphone')
});

app.get('/leaves', auth, function (req, res) {
    res.render('leaves')
});

app.get('/phones', auth, function (req, res) {
    res.render('phones')
});

app.get('/searchresults', auth, function (req, res) {
    res.render('searchresults', {})
});

app.get('/sports', auth, function (req, res) {
    res.render('sports')
});

app.get('/sun', auth, function (req, res) {
    res.render('sun')
});

app.get('/tennis', auth, function (req, res) {
    res.render('tennis')
});
//POST requests
app.post('/addgalaxy', function (req, res) {
    addToCart(req, res, "galaxy");
});
app.post('/addiphone', function (req, res) {
    addToCart(req, res, "iphone");
});
app.post('/addleaves', function (req, res) {
    addToCart(req, res, "leaves");
});
app.post('/addsun', function (req, res) {
    addToCart(req, res, "sun");
});
app.post('/addtennis', function (req, res) {
    addToCart(req, res, "tennis");
});
app.post('/addboxing', function (req, res) {
    addToCart(req, res, "boxing");
});

async function addToCart(req, res, product) {
    await client.connect();
    var username = { username: req.session.username };
    var user = await client.db('firstdb').collection('firstcollection').findOne(username);
    var cart = user.cart;
    var found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i] == product) {
            found = true;
        }
    }
    if (found) {
        alert("Product is already in your cart!");
    }
    else {
        alert("Product is added successfully!")
        cart.push(product);
        var newcart = { $set: { cart: cart } };
        await client.db('firstdb').collection('firstcollection').updateOne(username, newcart, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
        });
    }
    res.render(product)
    //client.close();
}
app.post('/cart', auth, function (req, res) {
    showCart(req, res).catch(console.error);
});
//showcart
async function showCart(req, res) {
    await client.connect();
    var username = { username: req.session.username };
    var user = await client.db('firstdb').collection('firstcollection').findOne(username);
    var cart = user.cart;
    res.render('cart', { product: cart });
    //client.close();
}
//registration
app.post('/register', function (req, res) {
    var x = req.body.username;
    var y = req.body.password;
    var user = { username: x, password: y, cart: [] };
    registration(user, res).catch(console.error);
});
//login
app.post('/', function (req, res) {
    var x = req.body.username;
    var y = req.body.password;
    req.session.username = x;
    var user = { username: x, password: y };
    login(user, res).catch(console.error);
});
//search
app.post('/search', function (req, res) {
    var x = req.body.Search;
    search(x, res).catch(console.error);
});
//search
async function search(x, res) {
    await client.connect();
    var result = []
    var resultPages = []
    var out = ["Boxing Bag", "Galaxy S21 Ultra", "iPhone 13 Pro", "Leaves of Grass", "The Sun and Her Flowers", "Tennis Racket"];
    var outPages = ["boxing", "galaxy", "iphone", "leaves", "sun", "tennis"]

    for (let i = 0; i < out.length; i++) {
        if (out[i].toLowerCase().includes(x.toLowerCase())) {
            result.push(out[i]);
            resultPages.push(outPages[i]);
        }
    }
    if (result.length == 0 || x == "") {
        alert("Item not found")
        res.redirect('home');
    }
    else {
        res.render('searchresults', { product: result, pages: resultPages });
    }
    client.close();
}

async function registration(x, res) {
    await client.connect();
    var out = await client.db('firstdb').collection('firstcollection').find({ username: x.username }).toArray();
    if (out.length != 0) {
        alert("Username is already used!")
        res.render('registration');
    }
    else if (x.username == "" || x.password == "") {
        alert("Username and Password can not be empty!");
        res.redirect('registration');
    }
    else {
        await client.db('firstdb').collection('firstcollection').insertOne(x);
        alert("Registration was successful!");
        res.redirect('/');
    }
    client.close();
}

async function login(x, res) {
    await client.connect();
    var out = await client.db('firstdb').collection('firstcollection').find({ username: x.username, password: x.password }).toArray();
    if (out.length == 0) {
        alert("Username or password is incorrect!")
        res.render('login');
    }
    else {
        res.render('home');
    }
    client.close();
}

if (process.env.PORT) {
    app.listen(process.env.PORT, function () {
        console.log('server started');
    })
}
else {
    app.listen(3000, function () {
        console.log('server started on port 3000');
    })
}