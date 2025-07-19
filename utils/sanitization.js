/**
 * Elimina TODAS las formas de etiquetas HTML y caracteres peligrosos
 * @param {string} input - Texto a sanitizar
 * @returns {string} Texto seguro
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    
    // Elimina todas las etiquetas HTML/XML, incluyendo malformadas
    let output = input.replace(/<\/?[^>]+(>|$)/g, '');
    
    // Elimina caracteres especiales peligrosos
    output = output.replace(/[&<>"'`=\\/]/g, '');
    
    return output;
};

/**
 * Sanitiza y valida un email
 * @param {string} email - Email a sanitizar
 * @returns {string} Email sanitizado o cadena vacía si no es válido
 */
const sanitizeEmail = (email) => {
    if (typeof email !== 'string') return '';
    
    // Sanitiza primero como input normal
    let cleanEmail = sanitizeInput(email.trim().toLowerCase());
    
    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
        return '';
    }
    
    return cleanEmail;
};

module.exports = {
    sanitizeInput,
    sanitizeEmail
};