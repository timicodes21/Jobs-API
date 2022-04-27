require('dotenv').config();
require('express-async-errors')

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const express = require('express')
const app = express();

const connectDB = require('./db/connect')

const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const authMiddleware = require('./middleware/auth')
const authRoutes = require('./routes/auth')
const jobRoutes = require('./routes/jobs')

// middleware
app.set('trust proxy', 1)
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());



//routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', authMiddleware, jobRoutes)

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000

const start = async () => {
    try {
        // connect to the db
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server is listening to port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start();