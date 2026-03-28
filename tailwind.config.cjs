const medusaPreset = require('@medusajs/ui-preset')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...medusaPreset,
  // Medusa preset đọc darkMode từ config; "class" để điều khiển .dark trên <html> (menu Chủ đề + localStorage).
  darkMode: 'class',
}
