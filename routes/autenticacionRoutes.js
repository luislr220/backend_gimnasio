const express = require("express");
const router = express.Router();
const authController = require("../controllers/autenticacionController");
const axios = require("axios");
const { ECAPTCHA_SECRET } = require("../config/credentials"); // Asegúrate de tener esto en tu archivo de config

// Endpoints existentes
router.post("/login", authController.iniciarSesion);
router.post('/verificar-token', authController.verificarToken);

// Nuevo endpoint para validar reCAPTCHA
router.post('/validar-captcha', async (req, res) => {
    const { captchaToken } = req.body;

    if (!captchaToken) {
        return res.status(400).json({ success: false, error: "Token de CAPTCHA faltante" });
    }

    try {
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            `secret=${ECAPTCHA_SECRET}&response=${captchaToken}`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        if (!response.data.success) {
            console.error("Error en CAPTCHA:", response.data['error-codes']);
            return res.status(400).json({ 
                success: false, 
                error: "CAPTCHA inválido",
                details: response.data['error-codes'] 
            });
        }

        res.json({ success: true });

    } catch (error) {
        console.error("Error al validar CAPTCHA:", error);
        res.status(500).json({ 
            success: false, 
            error: "Error interno al validar CAPTCHA" 
        });
    }
});

module.exports = router;