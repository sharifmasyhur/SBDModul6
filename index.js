const express = require("express");
const bodyParser = require('body-parser');
const eventRepo = require('./repositories/repository.event');
require('dotenv').config();

const app = express();
const port = 3014;

// Middleware
app.use(bodyParser.json());

// Endpoint
app.post('/events', eventRepo.addEvent);
app.get('/events', eventRepo.getAllEvent);
app.put('/events/:id', eventRepo.updateEvent);
app.delete('/events/:id', eventRepo.deleteEvent);
app.post('/events/bulk', eventRepo.addObjects);
app.get('/events/country', eventRepo.getEventsByCountry);
app.get('/events/paginate', eventRepo.getPaginated);

app.listen(port, () => {
    console.log('Server is running and listening on port', port);
});