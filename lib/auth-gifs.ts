// Curated list of tech/data/analytics related GIFs
export const authBackgroundGifs = [
  // Data/Analytics GIFs
  "https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif", // Data visualization
  "https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif", // Analytics lines
  "https://media.giphy.com/media/3o7TKUM3IgJBX2as9O/giphy.gif", // Digital network
  "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif", // Data flow
  "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif", // Digital waves
  
  // Tech/Code GIFs
  "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif", // Digital particles
  "https://media.giphy.com/media/xTiTnxpQ3ghPiB2Hp6/giphy.gif", // Code matrix
  "https://media.giphy.com/media/f3iwJFOVOwuy7K6FFw/giphy.gif", // Digital network
  
  // Abstract/Modern GIFs
  "https://media.giphy.com/media/RHEqKwRZDwFKE/giphy.gif", // Abstract waves
  "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif", // Digital flow
];

export const getRandomAuthGif = () => {
  return authBackgroundGifs[Math.floor(Math.random() * authBackgroundGifs.length)];
};