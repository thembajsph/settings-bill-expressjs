const express = require("express");

//  instantiate or reference handlebars
const exphbs = require('express-handlebars');

// //get body parser / instantiate
const bodyParser = require('body-parser');


//require the settings bill factory function
const SettingsBill = require("./settings-bill");

// create an instance for the app, instantiate it.
const app = express();

//instance
const settingsBill = SettingsBill();

//after ive instantiate my app ,configure , expressJs as handlebars(middleware)
app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

//make the public folder visible when using express, could be css ,js ,page wanst styled.now can see the middleware
// http://localhost:3011/css/style.css --- to see your css

app.use(express.static('public'));

// // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// // parse application/json
app.use(bodyParser.json());



// get something back on the screen, one route
app.get("/", function (req, res) {

  // No default engine was specified and no extension was provided(Error: for me to use render,)
  //install, npm install --save express-handlebars
  // npm install --save body-parser(forms to work)

  // put it again the settingsbill data on screen , render it on second parameter:
  res.render("index", {
    settings: settingsBill.getSettings(),
    totals: settingsBill.totals()
  });

});

//settings route that is a post as per instructions
app.post("/settings", function (req, res) {

  settingsBill.setSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel
  });

  // when we send to the server our request will be available in the body so...req.body
  console.log(settingsBill.getSettings());

  // redirect to the home /first route for now
  res.redirect("/");

});

// another route, the Action route
app.post("/action", function (req, res) {

  // capture the type to add
  console.log();

  //want to send the call and sms to my factort function
  settingsBill.recordAction(req.body.actionType);

  // redirect to the home /first route for now once done
  res.redirect("/");

});

// another route, a get route, called Actions
app.get("/actions", function (req, res) {
  // render new created template actions.handlebars, send something in (second parameter)
  res.render("actions", {actions: settingsBill.actions() });

});

// another route a get, /actions/:type route , a dynamic to display calls and text
app.get("/actions/:actionType", function (req, res) {
  const actionType = req.params.actionType;
  res.render("actions", {actions: settingsBill.actions(actionType) });
 

});

const PORT = process.env.PORT || 3001

app.listen(PORT, function () {
  console.log("app started at port:", PORT);

});