'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const schedule = require('node-schedule');
require('dotenv').config();

const cookieParser = require('cookie-parser');
const session = require('express-session');

// firebase config
const firebase = require('firebase');

// var config = {
//     apiKey: process.env.APIKEY,
//     authDomain: process.env.AUTHDOMAIN,
//     databaseURL: process.env.DBURL,
//     projectId: process.env.PROJECTID,
//     storageBucket: process.env.STORAGEBCKT,
//     messagingSenderId: process.env.MSID
//   };

// var fbapp = firebase.initializeApp(config);
// var db = fbapp.database();
// var auth = fbapp.auth();


// keepalive ping hacks
function rememberMyServer(uri) {
 	https.get(uri, (resp) => {
 		console.log(uri + ' - alive!');
 	}).on('error', (err) => {
 		console.log(uri + ' - dead! emergency!');
 	});
}

var keepalive = schedule.scheduleJob('*/10 * * * *', function() {

	var allMyServers = [];
	for(var i = 0; i < allMyServers.length; i++) {
		rememberMyServer(allMyServers[i]);
	}
})

// app body-parser config
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.static(path.resolve(`${__dirname}/web/public`)));
console.log(`${__dirname}/web`);
app.use('*', (req, res, next) => {
  console.log(`URL: ${req.baseUrl}`);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,X-access-token');
  next();
});

app.use((err, req, res, next) => {
  if (err) {
    res.send(err);
  }
});

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/views/web/public'));

// app cookie-parser config
app.use(cookieParser());
app.use(session({secret: 'bookmarksarefun'}));

// APIs start here
// home page
app.get('/', (req, res) => {

	var headers = { 'cache-control': 'no-cache',
    'Connection': 'keep-alive',
    'Host': 'medium.com',
    'Postman-Token': '419b3b98-9929-4bc1-830f-94e094d5fdce,6e656b27-4b58-4b73-a2d6-2a93f8f2b28d',
    'Cache-Control': 'no-cache',
    'x-obvious-cid': 'web',
    'accept-encoding': 'gzip, deflate, br',
    'authority': 'medium.com',
    'referer': 'https://medium.com/',
    'accept': 'application/json',
    'content-type': 'application/json',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36',
    'accept-language': 'en-US,en;q=0.9',
    'x-xsrf-token': 'R8vYNydFMoj1',
    'x-client-date': '1556197184501',
    'x-opentracing': '{"ot-tracer-spanid":"178c8f4729b5b2","ot-tracer-traceid":"192f1967c9136a","ot-tracer-sampled":"true"}',
    cookie: '__cfduid=dc2685ae63f27505f36a56fec4a26254a1555439307; lightstep_guid/medium-web=81f83f4b6f96cc3c; lightstep_session_id=5e01ad60bea0971d; sz=1351; pr=1; tz=-330; uid=50b439c77505; sid=1:F6aYXok273YwXnQYZWS0Pi3v5D8hWyf4PxZPCgyYFU71pGUQ7dqBjqwjwJHp+v+R; xsrf=R8vYNydFMoj1' };

var dataString = 'continue=https%3A%2F%2Faccounts.google.com%2FManageAccount&f.req=%5B%22' + partialEmail + '%40srmuniv.edu.in%22%2C%22AEThLlz88BWYnv6dNMnDxQcZMJUoIl7LVEvw5uECB7VSDYJd6KHP0USW1a6BQ5KuyHYgpH_8VjQx3-JfC9sqwB7-wTOOYbrq8nbQACZnKwhTkqLLdVR0yYvhJH7uI2CzAJVLEPYcsfumoN5jBZUly1pkqtiAtLheU9Obol68voQFPqdSjTVBOy4%22%2C%5B%5D%2Cnull%2C%22IN%22%2Cnull%2Cnull%2C2%2Cfalse%2Ctrue%2C%5Bnull%2Cnull%2C%5B2%2C1%2Cnull%2C1%2C%22https%3A%2F%2Faccounts.google.com%2FServiceLogin%22%2Cnull%2C%5B%5D%2C4%2C%5B%5D%2C%22GlifWebSignIn%22%5D%2C1%2C%5Bnull%2Cnull%2C%5B%5D%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5D%2Cnull%2Cnull%2Cnull%2C%5B%5D%2C%5B%5D%5D%2Cnull%2Cnull%2Cnull%2Ctrue%5D%2C%22' + partialEmail + '%40srmuniv.edu.in%22%5D&bgRequest=%5B%22identifier%22%2C%22!39yl3P1CBnmRmyDahypEr3_mjqXLD_8CAAAAfFIAAAAMmQE_gNU_u3xVCSIMPLK1HG_0Q0M4r0SkYbdLi4K3V__7cemXr1mioNNFHii8s936OiJyEdNWiXJl7vs6nCU3oUMN3mEJBDTj4FeBcp2iwNFFi_61BhhCguZdKqgB1lXPaGmUUoILFjkNh24mA6-3ela65yRJoA3sZQ23ojpa8Mg8vk0yvTQcj57BBjxvG2va48gbwJUjZSBw5hbp7JuqUNyktgU3V3rrtVdPDEEMhtqzwV34kllESDrzRewcXPPQ-iVy62KWjHn8PKKXdsMcgAgttMs8DcHkUG0LVKrmcgFXzvWs9wAKpDa2cWoL_7XaP6hFOuaIEmBa1_4OR8tkgKoyDiYC7SkUBA3uwOJNOBHIq6_Y66Pbk3GvT9UKFyzOKhHTSZXRVx5alkwYxNhLQ8O7ji9sYuoZWGs1akD6fmFh0Q%22%5D&azt=AFoagUWpAVF4Tc7JMQ59-W0kONStyVzcmw%3A1550137987483&cookiesDisabled=false&deviceinfo=%5Bnull%2Cnull%2Cnull%2C%5B%5D%2Cnull%2C%22IN%22%2Cnull%2Cnull%2C%5B%5D%2C%22GlifWebSignIn%22%2Cnull%2C%5Bnull%2Cnull%2C%5B%5D%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5D%2Cnull%2Cnull%2Cnull%2C%5B%5D%2C%5B%5D%5D%5D&gmscoreversion=undefined&checkConnection=youtube%3A442%3A1&checkedDomains=youtube&pstMsg=1&';

var options = {
        url: 'https://medium.com/me/list/bookmarks',
        method: 'GET',
        headers: headers,
};

function callback(error, response, body) {
        if (!error && response.statusCode == 200) {


            console.log(body);

        }
}

request(options, callback);	
    
  res.render('web/public/index.html');
});

// logout API
app.get('/logout', function(req, res) {
	auth.signOut();
	res.clearCookie('currentUser');
	return res.redirect('/');
});

// register API
app.get('/register', function(req, res) {
	if (req.cookies.currentUser) {
		return res.redirect('/userdashboard');
	} else {
		res.render('web/public/register.html');
	}
});

app.post('/register', function(req, res) {
	var email = req.body.email;
	var pwd = req.body.pwd;

	let partialEmail = email.substring(0, email.length - 15);

	var headers = {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:65.0) Gecko/20100101 Firefox/65.0',
			'Accept': '*/*',
			'Accept-Language': 'en-US,en;q=0.5',
			'Referer': 'https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin',
			'X-Same-Domain': '1',
			'Google-Accounts-XSRF': '1',
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
			'DNT': '1',
			'Connection': 'keep-alive',
			'TE': 'Trailers',
			'Cookie': 'GAPS=1:cR3-j4ldBGP_4EegdUGk5yOz3Bg-HA:4ypANPCGrHQ-CN69; NID=160=O9_zclBQNifVLuQsP9F1848auaQ-a_e9HoVuweHYFzAxu-f0LfVsS-aHN63axGxCMGcGVvvJAayrsqpQMNJn2fhS2iIvpe5uX9lFW5Ye6sJfOOt0QFAVXA5CXRSHZEXaSjjhM3nAgIa0PDVPCv5Odj5Qosdvv-XB5UzmsMjZ4gc'
	};
	
	var dataString = 'continue=https%3A%2F%2Faccounts.google.com%2FManageAccount&f.req=%5B%22' + partialEmail + '%40srmuniv.edu.in%22%2C%22AEThLlz88BWYnv6dNMnDxQcZMJUoIl7LVEvw5uECB7VSDYJd6KHP0USW1a6BQ5KuyHYgpH_8VjQx3-JfC9sqwB7-wTOOYbrq8nbQACZnKwhTkqLLdVR0yYvhJH7uI2CzAJVLEPYcsfumoN5jBZUly1pkqtiAtLheU9Obol68voQFPqdSjTVBOy4%22%2C%5B%5D%2Cnull%2C%22IN%22%2Cnull%2Cnull%2C2%2Cfalse%2Ctrue%2C%5Bnull%2Cnull%2C%5B2%2C1%2Cnull%2C1%2C%22https%3A%2F%2Faccounts.google.com%2FServiceLogin%22%2Cnull%2C%5B%5D%2C4%2C%5B%5D%2C%22GlifWebSignIn%22%5D%2C1%2C%5Bnull%2Cnull%2C%5B%5D%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5D%2Cnull%2Cnull%2Cnull%2C%5B%5D%2C%5B%5D%5D%2Cnull%2Cnull%2Cnull%2Ctrue%5D%2C%22' + partialEmail + '%40srmuniv.edu.in%22%5D&bgRequest=%5B%22identifier%22%2C%22!39yl3P1CBnmRmyDahypEr3_mjqXLD_8CAAAAfFIAAAAMmQE_gNU_u3xVCSIMPLK1HG_0Q0M4r0SkYbdLi4K3V__7cemXr1mioNNFHii8s936OiJyEdNWiXJl7vs6nCU3oUMN3mEJBDTj4FeBcp2iwNFFi_61BhhCguZdKqgB1lXPaGmUUoILFjkNh24mA6-3ela65yRJoA3sZQ23ojpa8Mg8vk0yvTQcj57BBjxvG2va48gbwJUjZSBw5hbp7JuqUNyktgU3V3rrtVdPDEEMhtqzwV34kllESDrzRewcXPPQ-iVy62KWjHn8PKKXdsMcgAgttMs8DcHkUG0LVKrmcgFXzvWs9wAKpDa2cWoL_7XaP6hFOuaIEmBa1_4OR8tkgKoyDiYC7SkUBA3uwOJNOBHIq6_Y66Pbk3GvT9UKFyzOKhHTSZXRVx5alkwYxNhLQ8O7ji9sYuoZWGs1akD6fmFh0Q%22%5D&azt=AFoagUWpAVF4Tc7JMQ59-W0kONStyVzcmw%3A1550137987483&cookiesDisabled=false&deviceinfo=%5Bnull%2Cnull%2Cnull%2C%5B%5D%2Cnull%2C%22IN%22%2Cnull%2Cnull%2C%5B%5D%2C%22GlifWebSignIn%22%2Cnull%2C%5Bnull%2Cnull%2C%5B%5D%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5D%2Cnull%2Cnull%2Cnull%2C%5B%5D%2C%5B%5D%5D%5D&gmscoreversion=undefined&checkConnection=youtube%3A442%3A1&checkedDomains=youtube&pstMsg=1&';
	
	var options = {
			url: 'https://accounts.google.com/_/signin/sl/lookup?hl=en-GB&_reqid=55410&rt=j',
			method: 'POST',
			headers: headers,
			body: dataString
	};
	
	function callback(error, response, body) {
			if (!error && response.statusCode == 200) {
					var lengthOfResponse = body.length;
					if (lengthOfResponse < 700) {
						return res.send('Your email seems fishy and not official!')
					}

					auth.createUserWithEmailAndPassword(email, pwd)
					.then(function(userData) {
						console.log('registering and logging in');
						res.cookie('currentUser', auth.currentUser);
						return res.redirect('/userdashboard');
					})
					.catch(function(error) {
						if (error) {
							res.send(error);
						}
					});

			}
	}
	
	request(options, callback);	
});

// login API
app.get('/login', function(req, res) {
	if (req.cookies.currentUser) {
		return res.redirect('/userdashboard');
	} else {
		res.render('web/public/login.html');
	}
});

app.post('/login', function(req, res) {
	var email = req.body.email;
	var pwd = req.body.pwd;

	auth.signInWithEmailAndPassword(email, pwd)
	.then(function(userData) {
		console.log('logging in');
		res.cookie('currentUser', auth.currentUser);

		if (req.query['redirect'] != null) {
			var finalURL = req.query['redirect'].replace(/\s/g, "/");
			return res.redirect(finalURL);
		}

		return res.redirect('/userdashboard');
	})
	.catch(function(error) {
		if (error) {
			res.send(error);
		}
	});
});

// user dashboard
app.get('/userdashboard', function(req, res) {
	if (req.cookies.currentUser) {

		db.ref().child("contributions").child(req.cookies.currentUser['uid']).once('value')
		.then( snapshot => {
			var coreUserData = []
			snapshot.forEach(function(childSnapshot) {

				coreUserData.push({"key": childSnapshot.key, "value": childSnapshot.val()});
			});
			return coreUserData;
		})
		.then(function(coreUserData) {
			res.render('web/public/dashboard.html', {coreUserData: JSON.stringify(coreUserData)});
		});

	} else {
		return res.send('Unauthorized');
	}
});


// server settings
var server = http.createServer(app);

server.listen(4000, function () {
  console.log('Port 4000 - BookmarksAreFun')
});