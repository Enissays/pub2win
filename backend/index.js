const { app, io } = require('./src/server');
const http = require('http');

if (!app || !io) {
  console.error('Erreur: Les composants du serveur n\'ont pas été correctement importés');
  process.exit(1);
}

const server = app.listen || http.createServer(app);

const PORT = process.env.PORT || 5000;

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Pub2Win API démarrée avec succes sur le port ${PORT}`);
    console.log(`=================================================`);
    console.log(`📝 Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔌 Socket.IO activé pour les communications en temps réel`);
    console.log(`=================================================`);
  });
};

process.on('uncaughtException', (error) => {
  console.error('Erreur non interceptée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
});

startServer();