// greenvest-backend/index.js const express = require('express'); const cors = require('cors'); const dotenv = require('dotenv'); const db = require('./config/db'); const authRoutes = require('./routes/authRoutes'); const investmentRoutes = require('./routes/investmentRoutes');

dotenv.config(); const app = express(); const PORT = process.env.PORT || 4000;

app.use(cors()); app.use(express.json());

app.use('/api', authRoutes); app.use('/api', investmentRoutes);

app.get('/', (req, res) => { res.send('GreenVest API is running'); });

app.listen(PORT, async () => { try { await db.authenticate(); console.log('Database connected...'); } catch (err) { console.error('Database connection failed:', err); } console.log(Server running on port ${PORT}); });

