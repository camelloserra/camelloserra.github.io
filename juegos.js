/*
  LISTA DE JUEGOS DE PROHIBIDO NO JUGAR
  -------------------------------------
  Para sumar un juego nuevo, copiá un bloque { ... } y pegalo AL FINAL de la lista.
  Los juegos aparecen en la home en este mismo orden (los nuevos quedan abajo).

  titulo  -> el nombre que se ve debajo del thumbnail
  url     -> dónde está el juego: "/nombre-del-repo/"
  imagen  -> el thumbnail, guardado en img/juegos/ (ideal 640x400 px).
             Si dejás imagen: "" se muestra una tarjeta de color con el nombre.
*/

const JUEGOS = [
  { titulo: "Chopstick Catch",         url: "/chopstick-catch/",         imagen: "chopstick-catch.jpg" },
  { titulo: "MEM😉JITEST",             url: "/memojitest/",              imagen: "memojitest.jpg" },
  { titulo: "Escape from the Libyans", url: "/escape.from.the.libyans/", imagen: "escape.from.the.libyans.jpg" },
  { titulo: "Help the Cow",            url: "/help.the.cow/",            imagen: "help.the.cow.jpg" },
];
