import localFont from 'next/font/local';

const inter = localFont({
  src: [
    {
      path: '../public/fonts/Inter/Inter-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  preload: true,
});

const roboto_mono = localFont({
  src: [
    {
      path: '../public/fonts/Roboto_Mono/RobotoMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  adjustFontFallback: false,
  variable: '--font-roboto-mono',
  preload: true,
  display: 'swap',
});

const montserrat = localFont({
  src: [
    {
      path: '../public/fonts/Montserrat/Montserrat-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],

  variable: '--font-montserrat',
  preload: true,
  display: 'swap',
});

const poppins = localFont({
  src: [
    {
      path: '../public/fonts/Poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  preload: true,
  display: 'swap',
});

const cookie = localFont({
  src: [
    {
      path: '../public/fonts/Cookie/Cookie-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cookie',
  adjustFontFallback: false,
  preload: true,
  display: 'swap',
});

const gotham = localFont({
  src: [
    {
      path: '../public/fonts/GothamProBlack/GothamProBlack.ttf',
      weight: 'black',
      style: 'normal',
    },
  ],
  variable: '--font-gotham',
  display: 'swap',
  preload: true,
});

export { inter, roboto_mono, montserrat, cookie, gotham, poppins };
