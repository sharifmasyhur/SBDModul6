const { Pool } = require("pg");
require('dotenv').config();

const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;
const db = process.env.DB;

const pool = new Pool ({
    user: "sbd2024_owner",
    password: "XkbaJ7IVi2FT",
    host: "ep-royal-moon-a16c8i2a.ap-southeast-1.aws.neon.tech",
    database: "sbd2024",

    // Set to true if you are using a remote server that uses HTTPS
    ssl: {
        require: true,
    },
});

pool.connect().then(() => {
    console.log("Connected to PostgreSQL database.");
});

async function addEvent(req, res) {
    const { title, description, year, period, month, day, country, city} = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO history (title, description, year, period, month, day, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [title, description, year, period, month, day, country, city]
        );
        const newEvent = result.rows[0];
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getAllEvent(req, res) {
    try {
        const result = await pool.query('SELECT * FROM history');
        const allEvents = result.rows;
        res.status(200).json(allEvents);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}


async function updateEvent(req, res) {
    const eventId = req.params.id; // Assuming the ID is passed as a URL parameter
    const { title, description, year, period, month, day, country, city } = req.body;

    try {
        const result = await pool.query(
            'UPDATE history SET title = $1, description = $2, year = $3, period = $4, month = $5, day = $6, country = $7, city = $8 WHERE id = $9 RETURNING *',
            [title, description, year, period, month, day, country, city, eventId]
        );
        const updatedEvent = result.rows[0];
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}


async function deleteEvent(req, res) {
    const eventId = req.params.id; // Assuming the ID is passed as a URL parameter

    try {
        const result = await pool.query('DELETE FROM history WHERE id = $1 RETURNING *', [eventId]);
        const deletedEvent = result.rows[0];
        res.status(200).json(deletedEvent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function addObjects(req, res) {
    const { title, description, year, period, month, day, country, city } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO history (title, description, year, period, month, day, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, description, year, period, month, day, country, city]
        );
        const newEvent = result.rows[0];
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getEventsByCountry(req, res) {
    const { country } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM history WHERE country = $1',
            [country]
        );

        const allEvents = result.rows;
        res.status(200).json(allEvents);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getPaginated(req, res) {
    const { page, pageSize } = req.query;

    try {
        // Calculate the offset based on page and pageSize
        const offset = (page - 1) * pageSize;

        // Query the database with limit and offset
        const result = await pool.query(
            'SELECT * FROM history LIMIT $1 OFFSET $2',
            [pageSize, offset]
        );

        // Respond with the retrieved events
        res.status(200).json(result.rows);
    } catch (error) {
        // Handle database errors
        res.status(500).json({ error: "Internal Server Error" });
    }
}

    module.exports = {
        addEvent,
        getAllEvent,
        updateEvent,
        deleteEvent,
        addObjects,
        getEventsByCountry,
        getPaginated
    };