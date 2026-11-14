export type PlaygroundCard = {
  src: string;
  bg: string;
  col?: number;
};

export const PLAYGROUND_ROWS: PlaygroundCard[][] = [
  [
    { src: '/images/01.webp', bg: '#3020e8' },
    { src: '/images/02.webp', bg: '#a9ebd5' },
    { src: '/images/03.webp', bg: '#171313' },
  ],
  [
    { src: '/images/04.webp', bg: '#d7ff46' },
    { src: '/images/05.webp', bg: '#c7278e' },
  ],
  [{ src: '/images/06.webp', bg: '#df3434', col: 2 }],
  [
    { src: '/images/07.webp', bg: '#a9ebd5', col: 2 },
    { src: '/images/08.webp', bg: '#171313', col: 3 },
  ],
  [
    { src: '/images/09.webp', bg: '#3020e8' },
    { src: '/images/10.webp', bg: '#d7ff46', col: 3 },
  ],
  [
    { src: '/images/11.webp', bg: '#c7278e', col: 2 },
    { src: '/images/12.webp', bg: '#a9ebd5', col: 3 },
  ],
];