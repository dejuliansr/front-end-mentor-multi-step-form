/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'sidebar-destop': "url('https://raw.githubusercontent.com/dejuliansr/front-end-mentor-multi-step-form/1af2005db63d35644414b5af9d7e6c0fc089fcae/assets/images/bg-sidebar-desktop.svg')",
        'sidebar-mobile': "url('https://github.com/dejuliansr/front-end-mentor-multi-step-form/blob/master/assets/images/bg-sidebar-mobile.jpg?raw=')",
      },
      colors: {
        'Marine-blue': 'hsl(213, 96%, 18%)',
        'Purplish-blue': 'hsl(243, 100%, 62%)',
        'Pastel-blue': 'hsl(228, 100%, 84%)',
        'Light-blue':' hsl(206, 94%, 87%)',
        'Strawberry-red': 'hsl(354, 84%, 57%)',

        'Cool-gray': 'hsl(231, 11%, 63%)',
        'Light-gray': 'hsl(229, 24%, 87%)',
        'Magnolia': 'hsl(217, 100%, 97%)',
        'Alabaster': 'hsl(231, 100%, 99%)',
      }
    },
  },
  plugins: [],
}

