const express = require('express');
const cors = require('cors');

const dbName = ''; 

function configMiddlewares(app) {
    app.use(express.static('./public'));
    app.use(cors());
    app.use(express.json());
}

function createServer({ port = 3000 } = {}) { 
    const app = express();
    configMiddlewares(app);

    let server = null;

    async function start() {
        try {
            await dbServices.connect({ database: dbName }); // il manque la configuration de la base de données***
            console.log('Connected to ' + dbName + ' database');

            server = app.listen(port, () => {
                console.log(`Server started on http://localhost:${port}/`);
            });
        } catch (error) {
            console.error('Failed to start server:', error);
        }
    }

    function stop() {
        if (server) {
            server.close(() => {
                console.log('Server stopped.');
            });
        }
    }

    return {
        start,
        stop,
        port
    };
}

module.exports = createServer;
