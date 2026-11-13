/*
  LISTA DE JUEGOS DE PROHIBIDO NO JUGAR
  -------------------------------------
  Para sumar un juego nuevo, copiá un bloque { ... } y pegalo AL FINAL de la lista.
  Los juegos aparecen en la home en este mismo orden (los nuevos quedan abajo).

  titulo  -> el nombre que se ve debajo del thumbnail
  url     -> dónde está el juego. Si el repo del juego se llama "mi-juego",
             la dirección es "/mi-juego/"
  imagen  -> el thumbnail, guardado en la carpeta img/juegos/
             (ideal: 640x400 px, .jpg o .png). Si todavía no tenés imagen,
             dejá imagen: "" y se muestra una tarjeta de color con el nombre.
*/

const JUEGOS = [
  {
    titulo: "Juego de ejemplo 1",
    url: "/nombre-del-repo-1/",
    imagen: ""
  },
  {
    titulo: "Juego de ejemplo 2",
    url: "/nombre-del-repo-2/",
    imagen: ""
  },
  {
    titulo: "Juego de ejemplo 3",
    url: "/nombre-del-repo-3/",
    imagen: ""
  },
];
