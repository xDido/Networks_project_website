let express = require('express');
let path = require('path');
const {render} = require('ejs');
const {isBuffer} = require('util');
let alert = require("alert");
const {allowedNodeEnvironmentFlags} = require('process');
const {IncomingMessage} = require('http');
let session = require('express-session');
const {truncate} = require('fs/promises');
let MongoDBSession = require('connect-mongodb-session')(session);

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true,


}));

app.get('/', function (req, res) {
    if (req.session.user)

        delete req.session.user;
    res.render('login.ejs');
});
app.get('/annapurna', function (req, res) {
    if (req.session.user)
        res.render('annapurna.ejs')
    else res.redirect('/');

});
app.get('/bali', function (req, res) {
    if (req.session.user)
        res.render('bali.ejs')
    else res.redirect('/');

});
app.get('/cities', function (req, res) {

    if (req.session.user)
        res.render('cities.ejs')
    else res.redirect('/');

});
app.get('/hiking', function (req, res) {
    if (req.session.user)
        res.render('hiking.ejs')
    else res.redirect('/');

});
app.get('/home', function (req, res) {
    if (req.session.user)
        res.render('home.ejs')
    else res.redirect('/');


});
app.get('/inca', function (req, res) {
    if (req.session.user)
        res.render('inca.ejs')
    else res.redirect('/');

});
app.get('/islands', function (req, res) {
    if (req.session.user)
        res.render('islands.ejs')
    else res.redirect('/');

});
app.get('/paris', function (req, res) {
    if (req.session.user)
        res.render('paris.ejs')
    else res.redirect('/');

});
app.get('/registration', function (req, res) {
    if (req.session.user)
        delete req.session.user;
    res.render('registration.ejs')
});
app.get('/rome', function (req, res) {
    if (req.session.user)
        res.render('rome.ejs')
    else res.redirect('/');

});
app.get('/santorini', function (req, res) {
    if (req.session.user)
        res.render('santorini.ejs')
    else res.redirect('/');

});
app.get('/search', function (req, res) {
    if (req.session.user)
        res.render('searchresults.ejs')
    else res.redirect('/');
});
app.get('/wanttogo', function (req, res) {
    if (req.session.user)
        res.render('wanttogo', {iwanttogo: req.session.user.wanttogolist});
    else res.redirect('/');

});

app.post('/', function (req, res) {

    let x = req.body.username;
    let y = req.body.password;
    req.session.user = req.body.username;
    if (x === 'admin' && y === 'admin') {
        res.render('home.ejs');
    } else {
        MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
            if (err) throw err;
            let db = client.db('myDB');
            let collection = db.collection('myCollection');

            collection.find({username: x} && {password: y}, {$exists: true}).toArray(function (err, items) //find if a value exists
            {
                if (err) throw err;


                if (items.length === 0) {

                    alert('user not found');
                    res.render('login.ejs');
                } else if (x.length === 0 || y.length === 0) {
                    alert('please enter all the fields');
                } else {
                    req.session.user = items[0];

                    return res.redirect('/home');

                }
            })
        })
    }
});


let MongoClient = require('mongodb').MongoClient;


app.post('home', function (req, res) {

});
app.post('/register', function (req, res) {
    let z = req.body.username;
    let m = req.body.password;
    MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
        if (err) throw err;
        let db = client.db('myDB');
        let collection = db.collection('myCollection');
        if (req.body.username === '') {
            alert("please enter username ");
        } else if (req.body.password === '') {
            alert("please enter password");
        } else {
            collection.find({username: z} && {password: m}, {$exists: true}).toArray(function (err, items) //find if a value exists
            {
                if (err) throw err;

                if (items.length === 0) {
                    db.collection('myCollection').insertOne({username: z, password: m, wanttogolist: []});
                    alert('Successfully logged in');
                    return res.redirect('/');
                } else {
                    alert('username already existed');
                }
            });
        }
    });
});
let allPlaces = ['annapurna', 'bali', 'inca', 'paris', 'rome', 'santorini'];
app.post('/search', function (req, res) {
    const z = req.body.Search;
        let searchresult = [];
        for (let j = 0; j < allPlaces.length; j++) {
            if (allPlaces[j].includes(z.toLowerCase())) {
                searchresult.push(allPlaces[j]);
            }
        }
        if (searchresult.length === 0) {
            alert("Can't find what you are looking for");
        }
        res.render('searchresults', {place: searchresult});
});
app.post('/hiking', function (req, res) {
});
app.post('/islands', function (req, res) {
});
app.post('/inca', function (req, res) {
    addtomywanttogolist(req, res, 'inca');
    res.redirect('/inca');
});
app.post('/bali', function (req, res) {
    addtomywanttogolist(req, res, 'bali');
    res.redirect('/bali');
});
app.post('/cities', function (req, res) {
});
app.post('/annapurna', function (req, res) {
    addtomywanttogolist(req, res, 'annapurna');
    res.redirect('/annapurna');
});
app.post('/paris', function (req, res) {
    addtomywanttogolist(req, res, 'paris');
    res.redirect('/paris');
});
app.post('/rome', function (req, res) {

    addtomywanttogolist(req, res, 'rome');
    res.redirect('/rome');
});
app.post('/santorini', function (req, res) {
    addtomywanttogolist(req, res, 'santorini');
    res.redirect('/santorini');
});


function addtomywanttogolist(req, res, place) {
    MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
        if (err) throw err;
        let db = client.db('myDB');
        let collection = db.collection('myCollection');
        if (!req.session.user.wanttogolist.includes(place)) {
            req.session.user.wanttogolist.push(place);
            req.session.save();
            collection.updateOne(
                {username: req.session.user.username},
                {$set: {wanttogolist: req.session.user.wanttogolist}}
            );
            collection.findOne({username: req.session.user.username}, (err, data) => {
                req.session.user = data;
                req.session.save();
            });
            alert('Destination has been added!');
        } else {
            alert('place already exists in your wanttogolist');
        }
    });
}

if (process.env.PORT) {
    app.listen(process.env.PORT, function () {
        console.log("server started");
    });
} else {
    app.listen(3000, function () {
        console.log("server started on port 3000");
    });
}