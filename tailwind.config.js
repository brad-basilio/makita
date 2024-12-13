/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        textPrimary: '#10235b',
        primary: '#FF3131',
        secondary: '#ffd632'
      },
      fontSize: {
        '2xl': '1.5rem',
      },
      margin: {
        primary: '5%',
      },
      padding: {
        primary: '5%',
      },
      // Puedes agregar personalizaciones aquí si es necesario
    },
  },
  plugins: [
    require('tailwindcss-animated'),
    // Otros plugins si los tienes
  ],
}
