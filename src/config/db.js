const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('La URI de MongoDB no está definida en las variables de entorno ❌');
        process.exit(1);
    }

    mongoose.set('strictQuery', false); // Prevenir advertencias

    const maxRetries = 5;
    let attempts = 0;

    const connectWithRetry = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('¡Conectado a la base de datos MongoDB! 🎉');
        } catch (error) {
            attempts += 1;
            if (attempts <= maxRetries) {
                console.error(`Error de conexión a la base de datos (Intento ${attempts}/${maxRetries}) ❌:`, error);
                setTimeout(connectWithRetry, 5000); // Reintentar después de 5 segundos
            } else {
                console.error('No se pudo conectar a la base de datos después de varios intentos ❌');
                process.exit(1);
            }
        }
    };

    connectWithRetry();

    mongoose.connection.on('connected', () => {
        console.log('¡Conectado a MongoDB!');
    });

    mongoose.connection.on('error', (error) => {
        console.error('Error de conexión a MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Desconectado de MongoDB');
    });
};

module.exports = connectDB;
