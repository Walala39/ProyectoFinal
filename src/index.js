/* -------------------------- import  -------------------------- */
import express from "express";
import morgan from "morgan";

import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import personasRoutes from "./routes/personas.routes.js";
import multer from "multer";
import path from "path";
import pool from "./database.js";


/* ----------------------------- Initialization ----------------------------- */

const app = express();

/* ----------------------------- Establece el directorio de destino donde se guardarán los archivos cargados ----------------------------- */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limitar tamaño del archivo a 10 MB
});

/* ----------------- Evitar Colisiones de nombre de variable ---------------- */

const __dirname = dirname(fileURLToPath(import.meta.url));

/* -------------------------------- settings -------------------------------- */

app.set("port", process.env.PORT || 3000);

app.set("views", join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

/* ------------------------------- Middlewares ------------------------------ */

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((err, req, res, next) => {
  console.log(req.body); // Muestra los datos del formulario en la consola
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send("Archivo demasiado grande");
    }
    return res.status(400).send(err.message);
  } else if (err) {
    console.log(err);
    return res.status(500).send("Ocurrió un error en el servidor");
  }
  next();
});

/* --------------------------------- routes --------------------------------- */

app.get("/", (req, res) => {
  res.render("index",{darkMode:true});
});

app.use(personasRoutes);

app.post("/add", upload.any(), async (req, res) => {
  const { name, lastname, age, observacion } = req.body;
  const nombreDelArchivo = req.files[0].filename;
  console.log(name, lastname, age, observacion, nombreDelArchivo);
  const newPersona = {
    name,
    lastname,
    age,
    observacion,
    imagen: nombreDelArchivo 
  };       
  await pool.query("INSERT INTO personas SET ?", [newPersona]);

  res.redirect('/list');
});

/* ------------------------------ Public files ----------------------------- */

app.use(express.static(join(__dirname, "public")));

/* ------------------------------- run server ------------------------------- */

app.listen(app.get("port"), () => {
  console.log("Server listening on port", app.get("port"));
});
