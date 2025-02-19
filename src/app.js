require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const carRoutes = require('./routes/car.routes');
const brandRoutes = require('./routes/brand.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const morgan = require('morgan');


const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de Autos! 🚗💨 /api/cars');
});

app.use('/api/cars', carRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ✅: ${PORT}`));
