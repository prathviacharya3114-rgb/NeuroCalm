const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/stress', require('./routes/stress'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
