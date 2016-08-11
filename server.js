var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var allData = require('./allData');
//var jsonQuery = require('json-query')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/namsResData', function (req, res, next) {
    
    setTimeout(function(){
    	var data = {
    		staticData: allData.staticData
    	}
    res.json(data);
    },10000);

});

app.get('/namsResData/:id', function (req, res, next) {
    
    //setTimeout(function(){
        var data = {
            id:req.params.id,
        	staticData:allData.staticData,
        	reqData:allData.reqData
        };
        res.json(data);
    //},10000);
    

});

// app.post('/namsResData',function(req, res, next){
//     console.log('namsResData posted');
//     res.json({});
// });

app.post('/namsResData',function(req, res, next){
    var isDraft = req.body.isDraft;
    if(isDraft){
        if(isDraft === true){
            console.log('namsResData posted for later use');
        } else{
            console.log('namsResData saved');
        }
    } else{
        console.log('namsResData saved');
    }
    
    res.json({});
});

app.put('/namsResData',function(req, res, next){
    console.log('namsresData put request done.')
    res.json({});
});

app.get('/author/:name', function (req, res, next) {
    var query = req.params.name.toLowerCase();
    var data = {
        authors:
        [
            { loginName:'WCooler', name: 'Wrench Cooler', address: '5322 Otter Lane', termsOfUse: true, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'SMart', name: 'Shakia Mart', address: 'PSC 450 Box 297', termsOfUse: false, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'OLindell', name: 'Olene Lindell', address: '1807 Glenwood St. NE', termsOfUse: true, csiEligibility: true, dtccDataPolicy: false },
            { loginName:'SDiehl', name: 'Shelton Diehl', address: 'P.O. Box 1230 Georgetown', termsOfUse: false, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'CBickham', name: 'Calandra Bickham', address: 'Dhahran 31311', termsOfUse: false, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'AVoyles', name: 'Asa Voyles', address: '6762 33 Ave N', termsOfUse: true, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'AGallion', name: 'Alonzo Gallion', address: 'Middle of JiangNan Road', termsOfUse: true, csiEligibility: true, dtccDataPolicy: true },
            { loginName:'RDona', name: 'Reda Dona', address: '74 Green Street', termsOfUse: false, csiEligibility: true, dtccDataPolicy: false },
            { loginName:'SHanneman', name: 'SFlorencio Hanneman', address: '42-1 Motohakone Hakonemaci', termsOfUse: true, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'XPlourde', name: 'Xochitl Plourde', address: 'HQ USAREUR & 7A, CMR 420 Box 676', termsOfUse: false, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'CSneed', name: 'Christen Sneed', address: '1807 Glenwood St NE', termsOfUse: false, csiEligibility: true, dtccDataPolicy: false },
            { loginName:'KBales', name: 'Kenyetta Bales', address: 'PO Box 1230', termsOfUse: true, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'BYann', name: 'Burma Yann', address: 'CAYMAN ISLANDS - UK', termsOfUse: false, csiEligibility: true, dtccDataPolicy: false },
            { loginName:'KCayton', name: 'Khalilah Cayton', address: 'St Petersburg FL 33710', termsOfUse: false, csiEligibility: true, dtccDataPolicy: true },
            { loginName:'JCeja', name: 'Jimmy Ceja', address: '226 E Fee Ave', termsOfUse: true, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'DTignor', name: 'Delora Tignor', address: 'Middle of JiangNan Rd', termsOfUse: true, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'DNyquist', name: 'Dean Nyquist', address: '42 1 Motohakone Hakonemaci', termsOfUse: true, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'APickell', name: 'Aleen Pickell', address: 'CMR 420 Box 676', termsOfUse: true, csiEligibility: true, dtccDataPolicy: false },
            { loginName:'EHaymaker', name: 'Elva Haymaker', address: '5322 Otter Ln', termsOfUse: false, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'CMizer', name: 'Celia Mizer', address: '1807 Glenwood St NE', termsOfUse: true, csiEligibility: true, dtccDataPolicy: false }
        ]
    };
    var results = data.authors.filter(function (item) {
        if (item.name.toLowerCase().indexOf(query) != -1) {
            return (item);
        }
    });
    res.json(results);
});

app.get('/analyst/:name', function (req, res, next) {
    var query = req.params.name.toLowerCase();
    var data = {
        authors:
        [
            { loginName:'NHensley', name: 'Noah Hensley', address: '5322 Otter Lane', termsOfUse: true, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'DRoberson', name: 'Damon Roberson', address: 'PSC 450 Box 297', termsOfUse: false, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'VShaffer', name: 'Vladimir Shaffer', address: '1807 Glenwood St. NE', termsOfUse: true, csiEligibility: true, dtccDataPolicy: true },
            { loginName:'PCruz', name: 'Phillip Cruz', address: 'P.O. Box 1230 Georgetown', termsOfUse: false, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'TFernandez', name: 'Thor Fernandez', address: 'Dhahran 31311', termsOfUse: false, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'IRichmond', name: 'Ivor Richmond', address: '6762 33 Ave N', termsOfUse: true, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'FCollins', name: 'Fuller Collins', address: 'Middle of JiangNan Road', termsOfUse: true, csiEligibility: true, dtccDataPolicy: false },
            { loginName:'DBush', name: 'Demetrius Bush', address: '74 Green Street', termsOfUse: false, csiEligibility: true, dtccDataPolicy: true },
            { loginName:'VMarquez', name: 'Vance Marquez', address: '42-1 Motohakone Hakonemaci', termsOfUse: true, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'RMcleod', name: 'Raja Mcleod', address: 'HQ USAREUR & 7A, CMR 420 Box 676', termsOfUse: false, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'RThompson', name: 'Reese Thompson', address: '1807 Glenwood St NE', termsOfUse: false, csiEligibility: true, dtccDataPolicy: false },
            { loginName:'KBales', name: 'Kenyetta Bales', address: 'PO Box 1230', termsOfUse: true, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'RLevy', name: 'Russell Levy', address: 'CAYMAN ISLANDS - UK', termsOfUse: false, csiEligibility: true, dtccDataPolicy: true },
            { loginName:'AThomas', name: 'Adrian Thomas', address: 'St Petersburg FL 33710', termsOfUse: false, csiEligibility: true, dtccDataPolicy: true },
            { loginName:'SAnthony', name: 'Sebastian Anthony', address: '226 E Fee Ave', termsOfUse: true, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'ARoberts', name: 'Abel Roberts', address: 'Middle of JiangNan Rd', termsOfUse: true, csiEligibility: false, dtccDataPolicy: true },
            { loginName:'AGibbs', name: 'Arden Gibbs', address: '42 1 Motohakone Hakonemaci', termsOfUse: true, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'SBauer', name: 'Sean Bauer', address: 'CMR 420 Box 676', termsOfUse: true, csiEligibility: true, dtccDataPolicy: true },
            { loginName:'OBlevins', name: 'Owen Blevins', address: '5322 Otter Ln', termsOfUse: false, csiEligibility: false, dtccDataPolicy: false },
            { loginName:'DRichmond', name: 'Dean Richmond', address: '1807 Glenwood St NE', termsOfUse: true, csiEligibility: true, dtccDataPolicy: true }
        ]
    };
    var results = data.authors.filter(function (item) {
        if (item.name.toLowerCase().indexOf(query) != -1) {
            return (item);
        }
    });
    res.json(results);
});

app.get('/frsAnalyst', function (req, res, next) {
    var frsAnalysts = [
        {
            name: 'Rosina Leedom',
            termsOfUse: 'SoundCloud Cookies Policy',
            csiEligibility: true
        }
        , {
            name: 'Allyn Griego',
            termsOfUse: 'EULA',
            csiEligibility: false
        }
        , {
            name: 'Jimmy Santillo',
            termsOfUse: 'browsewrap',
            csiEligibility: true
        }, {
            name: 'Francene Swafford',
            termsOfUse: 'clickwrap',
            csiEligibility: true
        }
    ];
    res.json(frsAnalysts);
});

app.get('/nonFrsCoAuthor', function (req, res, next) {
    var nonFrsCoAuthors = [
        {
            name: 'Christian Sloane',
            affiliation: true,
            email: 'ChristianSloane@frs.com'
        }
        , {
            name: 'Cindi Cathey',
            affiliation: false,
            email: 'CindiCathey@frs.com'
        }
        , {
            name: 'Tena Furlong',
            affiliation: true,
            email: 'TenaFurlong@gmail.com'

        }, {
            name: 'Bart Umfleet',
            affiliation: true,
            email: 'BartUmfleet@frs.com'
        }
    ];
    res.json(nonFrsCoAuthors);
});

//additional setup to allow CORS requests
var allowCrossDomain = function (req, response, next) {
    response.header('Access-Control-Allow-Origin', "http://localhost");
    response.header('Access-Control-Allow-Methods', 'OPTIONS, GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    if ('OPTIONS' == req.method) {
        response.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);
var server = app.listen(8080, () => {
    console.log("Server listening at port 8080");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log('Development Error');
        if (!res.finished) {
            res.status(err.status || 500);
            res.json(err);
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log('Production Error');
    if (err.message) { delete err.message; }
    if (err.custom) { delete err.custom; }
    if (!res.finished) {
        res.status(err.status || 500);
        res.json(err);
    }
});