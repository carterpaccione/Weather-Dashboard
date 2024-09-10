import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder

// TODO: Implement middleware for parsing JSON and urlencoded form data

// TODO: Implement middleware to connect the routes

app.use(express.json()); // This is the line that parses JSON data sent in the request body
app.use(express.urlencoded({ extended: true })); // This is the line that parses urlencoded form data sent in the request body
app.use(express.static('../client/dist')); // This is the line that serves the static files in the client dist folder
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
