import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
//import session from 'express-session';
import mongoose from 'mongoose';
//Passport imports
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import productsRouter from './routes/products.router.js';





//Routers
import viewsRouter from './routes/views.router.js';
import usersViewRouter from './routes/users.view.router.js'; 
import jwtRouter from './routes/jwt.router.js'
import usersRouter from './routes/users.router.js';
import passwordRouter from './routes/password.router.js';
import User from './services/db/daos/models/User.js'
import cartsRouter from './routes/carts.router.js';



import petsRouter from './routes/pets.router.js';
// //Custom - Extended
import UsersExtendRouter from './routes/custom/users.extend.router.js'



const app = express();

//JSON settings:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


const MONGO_URL = "mongodb://localhost:27017/clase23?retryWrites=true&w=majority";

//Cookies
app.use(cookieParser("CoderS3cr3tC0d3"));

//Middlewares Passport
initializePassport();
app.use(passport.initialize());
//app.use(passport.session());

//Declare routers:
app.use("/", viewsRouter);
app.use("/users", usersViewRouter);
app.use("/api/jwt", jwtRouter);
app.use('/api/users', usersRouter);
app.use("/api/pets", petsRouter);
app.use('/api/password', passwordRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('./models/User.js', usersExtendRouter);



const usersExtendRouter = new UsersExtendRouter();
app.use("/api/extend/users", usersExtendRouter.getRouter());

app.get("/test", (req, res) => {
    res.send("HOLA")
})


const SERVER_PORT = 9090;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};

connectMongoDB();