import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import session,{SessionOptions} from 'express-session'
import cookieParser from 'cookie-parser'
import connectDB from './src/config/dbConfig'
import http from 'http'
import userRoutes from './src/infrastructure/routes/userRoutes'
import brandRoutes from './src/infrastructure/routes/brandRoutes'
import productRoutes from './src/infrastructure/routes/productRoutes'
import categoryRoutes from './src/infrastructure/routes/categoryRoutes'
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(cookieParser())

const sessionOptions:SessionOptions={
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000
    },
}

app.use(session(sessionOptions))
const startServer = async()=>{
    try {
        const PORT = process.env.port || 3000
        await connectDB()
        const server = http.createServer(app)
        server.listen(PORT,()=>{
            console.log(`Server is running on http://localhost:${PORT}`);
        })
        app.use('/user',userRoutes)
        app.use('/brands',brandRoutes)
        app.use('/category',categoryRoutes)
        app.use('/products',productRoutes)

        server.on('error',(error)=>{
            console.log('server error:',error);
        })
    } catch (error) {
        console.log(error);
    }
}


export default startServer
