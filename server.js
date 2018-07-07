const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// vklopim podporo za parciale in povem, kje se nahajajo
hbs.registerPartials(__dirname + '/views/partials');
// s tem postavim, da je hbs view engine; šablone pričakuje v podimeniku views
app.set('view engine', 'hbs');

// tole je middleware, ki ga uporabim zato, da prestrežem vsak klic in zapišem log
// ko pokličem next(), se nadaljuje izvajanje ostalih skript; če ne pokličem next, se stran ne naloži
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.originalUrl}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  })
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// tole je za vklop servisiranja statičnih strani v imeniku public
app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  // res.send('<h1>hello Express!</h1>')
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'Houdy ... How are you?'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request.'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000')
});