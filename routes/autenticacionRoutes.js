const express = require("express");
const router = express.Router();
const authController = require("../controllers/autenticacionController");
const axios = require("axios");
const { ECAPTCHA_SECRET } = require("../config/credentials");

// Validación mejorada de reCAPTCHA
const validateCaptcha = async (req, res, next) => {
  const { captchaToken } = req.body;
  
  if (!captchaToken) {
    return res.status(400).json({ 
      success: false, 
      error: "Token de CAPTCHA requerido" 
    });
  }

  try {
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await axios.post(verificationUrl, null, {
      params: {
        secret: ECAPTCHA_SECRET,
        response: captchaToken
      },
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      }
    });

    if (!response.data.success) {
      console.warn("Intento fallido de CAPTCHA:", {
        errors: response.data['error-codes'],
        ip: req.ip
      });
      return res.status(400).json({
        success: false,
        error: "Verificación de CAPTCHA fallida",
        details: response.data['error-codes']
      });
    }

    next();
  } catch (error) {
    console.error("Error en validación CAPTCHA:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor al validar CAPTCHA"
    });
  }
};

// Endpoints con validación de CAPTCHA donde sea necesario
router.post("/login", validateCaptcha, authController.iniciarSesion);
router.post("/verificar-token", authController.verificarToken);
router.post("/validar-captcha", validateCaptcha, (req, res) => {
  res.json({ success: true, message: "CAPTCHA validado correctamente" });
});

module.exports = router;