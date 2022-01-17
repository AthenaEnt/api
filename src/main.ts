import "reflect-metadata"
import path from "path"
import { authRouter } from "./controllers"
import { apiRouter } from "./controllers/router"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import http from "http"
import {Server} from "socket.io"
import { setSocketConnection } from "./controllers/webhooks/router"

//DATABASE_URL="mysql://dantexlx_admin:zJZ7h6NF6wnKFAK@localhost:3306/dantexlx_tokpa"
//Init app
const app=express()

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:"*",
        methods:['GET', 'POST'],
        credentials:true
    }
});



function appInit(){
    //Socket connexion
    
    io.on('connection', setSocketConnection);

    //*****Configs 
    dotenv.config()

    //Cors
    app.use(cors())


    app.use(express.static(path.join(__dirname, "../public")))

    //*****Global Middleware
    


    //Body parser
    app.use(bodyParser.json({limit:"50mb"}))
    app.use(bodyParser.urlencoded({limit:"50mb", extended:true}))

    
    app.use("/welcome", (req:any, res:any)=>res.status(200).json("Hey, Welcome to tokpa backend api"))

    //Auhentication routes
    app.use('/auth', authRouter)

    //Api routes
    app.use('/api', apiRouter)


    //Start  server listen
    server.listen(process.env.PORT ?? 4000, ()=>console.log('server started'))
}

try{
    appInit()
}catch(e){
    console.log("Une erreur est survenue.")
}
