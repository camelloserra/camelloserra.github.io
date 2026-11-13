# Prohibido No Jugar

Home del sitio. Muestra los thumbnails de todos los juegos; al apretar uno, se abre el juego.

## Archivos

- `index.html` – la home (no hace falta tocarla)
- `juegos.js` – **la lista de juegos**: acá sumás cada juego nuevo
- `img/logo.jpg`, `img/icono.png` – logo e ícono de la pestaña
- `img/juegos/` – los thumbnails de los juegos (ideal 640×400 px)

## Publicar el sitio en GitHub

1. En GitHub, creá un repositorio nuevo llamado **`TU-USUARIO.github.io`** (con tu usuario exacto). Público.
2. Subí todo el contenido de esta carpeta (Add file → Upload files → arrastrar todo).
3. En el repo: **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. En la misma pantalla, en **Custom domain**, escribí tu dominio (ej. `prohibidonojugar.com`) → Save. Cuando aparezca, tildá **Enforce HTTPS**.

## Apuntar el dominio a GitHub (en donde compraste el dominio, ej. NIC.ar / Namecheap / GoDaddy)

En la zona DNS del dominio, cargá:

| Tipo  | Nombre | Valor                 |
|-------|--------|-----------------------|
| A     | @      | 185.199.108.153       |
| A     | @      | 185.199.109.153       |
| A     | @      | 185.199.110.153       |
| A     | @      | 185.199.111.153       |
| CNAME | www    | TU-USUARIO.github.io  |

Puede tardar desde minutos hasta 24 h en funcionar.

## Llevar los juegos al dominio (sin mover nada)

Como la home está en el repo `TU-USUARIO.github.io` con tu dominio, **cada otro repo tuyo con GitHub Pages activado aparece automáticamente en `tudominio.com/nombre-del-repo/`**.

Para cada juego:

1. Entrá al repo del juego → **Settings → Pages** → Branch `main` / `(root)` → Save.
   (El `index.html` del juego tiene que estar en la raíz del repo.)
2. Probá `https://tudominio.com/nombre-del-repo/`.
3. Agregalo a `juegos.js`:

```js
{
  titulo: "Nombre del juego",
  url: "/nombre-del-repo/",
  imagen: "nombre-del-repo.jpg"
},
```

4. Subí el thumbnail a `img/juegos/nombre-del-repo.jpg`.

> Ojo: si un juego carga archivos con rutas que empiezan con `/` (ej. `src="/sonido.mp3"`), cambialas a relativas (`src="sonido.mp3"`), porque ahora el juego vive dentro de una subcarpeta.

## Sumar un juego nuevo en el futuro

Mismo proceso: repo nuevo → activar Pages → agregar un bloque al final de `juegos.js` → subir el thumbnail. Aparece solo, abajo de los anteriores.

## Google AdSense

Los costados de la home ya tienen espacio reservado (`anuncio-izquierda` y `anuncio-derecha`, 160 px de ancho) que se ve en pantallas anchas. Cuando AdSense te apruebe, pegá el script en el `<head>` donde dice el comentario, y el código de cada bloque dentro de esos dos `div`.
