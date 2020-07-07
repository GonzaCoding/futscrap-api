const app = require('express')();
var historyController = require('../controllers/historyController');

app.get('/api', historyController.getTeams);
app.get('/api/:team', historyController.getHistoryByTeam);

module.exports = app;