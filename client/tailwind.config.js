module.exports = {
   content: ['./src/**/*.{js,jsx,ts,tsx}'],
   darkMode: 'class',
   theme: {
      extend: {
         colors: {
            aside_db: '#111315',
            table_db: '#dadada',
            table_db_thead: '#8f95a1',
            h_td: '#5054631a',
         },
         boxShadow: {
            // db: '0px 3px 3px rgba(0,0,0,0.24)',
            // db: '0px 2px 7px rgba(0,0,0,0.3)',
            db: '0px 1px 2px rgba(0,0,0,0.3)',
            dark_db: '0px 3px 8px rgba(255,255,255,0.1)',
         },
         keyframes: {
            typing: {
               '0%, 100%': {
                  width: 0,
               },
               '50% ,90%': {
                  width: '100%',
               },
            },
         },
         animation: {
            'waving-hand': 'wave 1s linear infinite',
            typing: 'typing 4s steps(40) infinite',
            effectt: 'effect .3s linear',
         },
         fontFamily: {
            nikeFutura: 'Nike Futura',
         },
         aspectRatio: {
            product: '4 / 5',
         },
      },
   },
};
