var express = require('express');
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

var {MongoClient} = require('mongodb');
var url = 'mongodb://127.0.0.1:27017'
var client = new MongoClient(url, function (err, client) {
    if (err) throw err;
});
var db = client.db('MyDB');

app.get('/', function (req, res) {
    res.render('login')
});
app.get('/home', function (req, res) {
    res.render('home')

});
app.get('/islands', function (req, res) {
    res.render('islands')

});
app.get('/cities', function (req, res) {
    res.render('cities')

});
app.get('/hiking', function (req, res) {
    res.render('hiking')

});
app.get('/registration', function (req, res) {
    res.render('registration')

});
app.get('/searchresults', function (req, res) {
    res.render('searchresults')

});
app.get('/paris', function (req, res) {
    res.render('paris')

});
app.get('/rome', function (req, res) {
    res.render('rome')

});
app.get('/inca', function (req, res) {
    res.render('inca')

});
app.get('/bali', function (req, res) {
    res.render('bali')

});
app.get('/wanttogo', function (req, res) {
    res.render('wanttogo')

});
app.get('/santorini', function (req, res) {
    res.render('santorini')

});
app.get('/annapurna', function (req, res) {
    res.render('annapurna')

});


app.post('/', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    login(username, password, res);
});
app.post('/home', function (req, res) {
    const id = req.body.id;
    switch (id) {
        case "wanttogo":
            res.redirect('wanttogo')
            break;
        case "islands":
            res.redirect('islands')
            break;
        case "cities":
            res.redirect('cities')
            break;
        case "hiking":
            res.redirect('hiking')
            break;
    }

});
app.post('/islands', function (req, res) {
    const id = req.body.id;
    switch (id) {
        case "bali":
            res.redirect('bali')
            break;
        case "santorini":
            res.redirect('santorini')
            break;
    }

});
app.post('/cities', function (req, res) {

    const id = req.body.id;
    switch (id) {
        case "paris":
            res.redirect('paris')
            break;
        case "rome":
            res.redirect('rome')
            break;
    }
});
app.post('/hiking', function (req, res) {
    const id = req.body.id;
    switch (id) {
        case "inca":
            res.redirect('inca')
            break;
        case "annapurna":
            res.redirect('annapurna')
            break;
    }

});
app.post('/registration', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var type = req.body.value;
    // something wrong here
    if (type.equals("Register")) {
        registration(username, password);
    }
});
app.get('/register', function (req, res) {
    //issue here
   res.render('login')
});
app.post('/register', function (req, res) {
    //issue here
    var username = req.body.username;
    var password = req.body.password;
    registration(username, password);
});
app.post('/searchresults', function (req, res) {


});
app.post('/paris', function (req, res) {


});
app.post('/rome', function (req, res) {


});
app.post('/inca', function (req, res) {


});
app.post('/bali', function (req, res) {


});
app.post('/wanttogo', function (req, res) {


});
app.post('/santorini', function (req, res) {


});

function login(username, password, res) {
    // alert issue
    db.collection('DB').find({username: username, password: password}, {
        $exists: true
    }).toArray(function (error, result) {
        if (result.length == 0) {
            console.log("Username or password is incorrect!");
            res.render('login');
        } else {
            res.render('home');
        }
    });

}

function registration(username, password, res) {
    // alert issue
    db.collection('DB').find({username: username}).toArray(function (error, result) {
        if (result.length != 0) {
            console.log("Username is already used!")
            res.render('registration');
        } else if (username == "" || password == "") {
            console.log("Username and Password can not be empty!");
            res.redirect('registration');
        } else {
            db.collection('DB').insertOne({username: username,password:password});
            console.log("Registration was successful!");
            res.redirect('/');
        }
    });

}

app.listen(3000);

