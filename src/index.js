/* -------------------------- import  -------------------------- */
import express from "express";
import morgan from "morgan";

import {join, dirname} from "path"
import {fileURLToPath} from "url"
import {engine} from "express-handlebars"
import personasRoutes from "./routes/personas.routes.js"
import multer from 'multer';
import path from 'path';



/* ----------------------------- Initialization ----------------------------- */

const app = express();

/* ----------------------------- Establece el directorio de destino donde se guardarán los archivos cargados ----------------------------- */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
/* ----------------- Evitar Colisiones de nombre de variable ---------------- */

const __dirname = dirname(fileURLToPath(import.meta.url));

/* -------------------------------- settings -------------------------------- */

app.set("port" , process.env.PORT || 3000 );
app.use(upload.any());


app.set("views", join(__dirname, "views"));
app.engine(".hbs", engine({
    defaultLayout: "main" , 
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs"
}));
app.set("view engine", ".hbs");

/* ------------------------------- Middlewares ------------------------------ */

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* --------------------------------- routes --------------------------------- */

app.get("/", (req, res) => {
    res.render("index")
});

app.use(personasRoutes);

/* ------------------------------ Public filess ----------------------------- */

app.use(express.static(join(__dirname, "public")));

/* ------------------------------- run server ------------------------------- */

app.listen(app.get("port"), () => {
    console.log("Server listeing on port" , app.get("port"));
});