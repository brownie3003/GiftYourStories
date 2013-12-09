var express = require('express'),
    stylus = require('stylus'),
    Parse = require('node-parse-api').Parse,
    nodemailer = require('nodemailer'),
    path = require('path'),
    templatesDir = path.resolve(__dirname, '/templates'),
    emailTemplates = require('email-templates');


var APP_ID = "ey1VPmwuX0y8XmhbwqmP1fMPGE8CZWmiQLpQBOpo";
var MASTER_KEY = "ZjPUYyvpN6MzHJH2QEsh8ENewsS1DTtEKtxnZUyQ";

var parseApp = new Parse(APP_ID, MASTER_KEY);

var app = express();

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
}

app.set('views', __dirname + '/views');

app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.logger('dev'));

app.use(stylus.middleware({
    src: __dirname + "/public", compile: compile
    })
);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', {title : 'Home'});
});

app.get('/signup', function (req, res) {
    res.render('signup');
});

app.post('/step2', function (req, res) {
  //var data = req.body;
  //console.log(data.theirName);
  res.render('signup2', {theirName: req.body.theirName});
});

app.post('/step3', function(req, res) {
  // upload the details and generate the unique email address here
  var theirName = req.body.theirName,
      yourName = req.body.yourName,
      yourEmail = req.body.yourEmail,
      customEmail = "for" + theirName.replace(/ /g, '') + "@giftyourstories.com";

  parseApp.insert('User', {"theirName": theirName, "originatorName": yourName, "originatorEmail": yourEmail, "customEmail": customEmail}, function(err, response) { 
    if(err) throw err; 
    console.log(response);
  });

  emailTemplates(templatesDir, function(err, template) {
    if(err) throw err;
    var smtpTransport = nodemailer.createTransport("SMTP", {
      service: "Zoho",
      auth: {
        user: "hello@weaveuk.com",
        pass: "weave2013"
      }
    });
    var locals = {};

    template('signup', locals, function(err, html, text) {
      var mailOptions = {
        from: "Gift Your Stories <hello@weaveuk.com>",
        to: yourEmail,
        bcc: "nicangeli@gmail.com",
        subject: "Thanks for joining Gift Your Stories",
        html: html,
        gererateTextFromHTML: true
      };

      if(err) throw err;

      smtpTransport.sendMail(mailOptions, function(error, responseStatus) {
        if(error)  throw err;
        console.log(responseStatus.message);
      })
    })

  });

  res.render('signup3', {theirName: theirName, yourName: yourName, yourEmail: yourEmail, customEmail: customEmail});


});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});