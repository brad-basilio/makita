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
        primary: '#F8B62C',

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
