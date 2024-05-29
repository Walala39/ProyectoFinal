// multerConfig.js

import multer from 'multer';
import path from 'path';

// Configuración del almacenamiento de archivos con Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'uploads')); // Ruta de destino para guardar los archivos subidos
  },
  filename: function (req, file, cb) {
    // Generar un nombre único para el archivo subido
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Configuración de Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limitar tamaño del archivo a 10 MB
});

export default upload;