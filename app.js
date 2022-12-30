let express = require('express');
let path = require('path');
let alert = require("alert");
const session = require('express-session');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
}));
app.get('/', function (req, res) {
    res.render('login')
});
app.get('/annapurna', function (req, res) {
    res.render('annapurna')
});
app.get('/bali', function (req, res) {
    res.render('bali')
});
app.get('/cities', function (req, res) {
    res.render('cities')
});
app.get('/hiking', function (req, res) {
    res.render('hiking')
});
app.get('/home', function (req, res) {
    res.render('home')
});
app.get('/inca', function (req, res) {
    res.render('inca')
});
app.get('/islands', function (req, res) {
    res.render('islands')
});
app.get('/paris', function (req, res) {
    res.render('paris')
});
app.get('/registration', function (req, res) {
    res.render('registration')
});
app.get('/rome', function (req, res) {
    res.render('rome')
});
app.get('/santorini', function (req, res) {
    res.render('santorini')
});
app.get('/searchresults', function (req, res) {
    res.render('searchresults')
});
app.get('/wanttogo', function (req, res) {
    res.render('wanttogo')
});

app.post('/', function (req, res) {
    let x = req.body.username;
    let y = req.body.password;
    req.session.username = x;
    MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
        let db = client.db('MyDB');
        let collection = db.collection('FirstCollection');
        collection.find({username: x} && {password: y}, {$exists: true}).toArray(function (err, items) //find if a value exists
        {
            if (items.length == 0) {

                alert('user not found');
                res.render('login');
            } else if (x.length == 0 || y.length == 0) {
                alert('please enter all the fields');
            } else {
                return res.redirect('home');
            }
        })
    })
});
app.post('/login', function (req, res) {
    let x = req.body.username;
    let y = req.body.password;
    req.session.username = x;
    MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
        let db = client.db('MyDB');
        let collection = db.collection('FirstCollection');
        collection.find({username: x} && {password: y}, {$exists: true}).toArray(function (err, items) //find if a value exists
        {
            if (items.length == 0) {

                alert('user not found');
                res.render('login');
            } else if (x.length == 0 || y.length == 0) {
                alert('please enter all the fields');
            } else {
                return res.redirect('home');
            }
        })
    })
});


let MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    if (err) throw err;
});

app.post('home', function (req, res) {
});
app.post('/register', function (req, res) {

    MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {

        let db = client.db('MyDB');
        let collection = db.collection('FirstCollection');
        let z = req.body.username;

        let m = req.body.password;
        collection.find({username: z} && {password: m}, {$exists: true}).toArray(function (err, items) //find if a value exists
        {

            if (items.length == 0 && z.length != 0 && m.length != 0) {
                db.collection('FirstCollection').insertOne({username: z, password: m, list: []});
                alert('Successfully registered');
                return res.redirect('/');
            } else {
                alert('username that you have entered either taken or empty, please try another one!');
            }
        });


    });
});
app.post('searchresults', function (req, res) {
});
app.post('hiking', function (req, res) {
});
app.post('islands', function (req, res) {
});
app.post('cities', function (req, res) {
});
app.post('/annapurna', function (req, res) {
    addToList(req,res,"annapurna");
});
app.post('/paris', function (req, res) {
    addToList(req,res,"paris");
});
app.post('/inca', function (req, res) {
    addToList(req,res,"inca");
});
app.post('/rome', function (req, res) {

    addToList(req,res,"rome");
});
app.post('/santorini', function (req, res) {
    addToList(req,res,"santorini");
});
app.post('/bali', function (req, res) {
    addToList(req,res,"bali");
});
app.post('wanttogo', function (req, res) {

});
function addToList(req, res, destination) {
    MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
        let db = client.db('MyDB').collection('FirstCollection');
        let username = req.session.username;
        db.findOne({username: username},function(err,res){ const list = res.list;
            let found = false;

            for (let i = 0; i < list.length; i++) {
                if (list[i] == destination) {
                    found = true;
                }
            }
            if (found) {
                alert("already on your want to go list!");
            } else {
                alert("added successfully");
                list.push(destination);
                db.updateOne({username: username}, {$set: {list: list}}, function (err, res) {
                    if (err) throw err;
                });
            }
        });});
}


app.listen(3000);