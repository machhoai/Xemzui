require('dotenv').config(); // Load environment variables from .env file
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const MoviesDB = client.db('Movies_Store');

// Get the Movies collection
const GenresCollection = MoviesDB.collection('Genres');
const MoviesCollection = MoviesDB.collection('Movies');
const VoMCollection = MoviesDB.collection('VideosOfMovies');
const UsersCollection = MoviesDB.collection('Users');
const BlacklistCollection = MoviesDB.collection('BlackList');

// Connect the client to the server
async function runConnect() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log('Connected to MongoDB!');

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        await client.close();
    }
}

// clode the client connection when the Node.js process ends
async function closeConnection() {
    process.on('SIGINT', async () => {
        await client.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
}

module.exports = {
    runConnect,
    closeConnection,
    GenresCollection,
    MoviesCollection,
    VoMCollection,
    UsersCollection,
    BlacklistCollection,
};