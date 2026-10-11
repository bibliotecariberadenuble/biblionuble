# BiblioÑuble — Guía para publicar (sin pagar)

## Qué está preparado
La app PWA, buscador, categorías, filtros por curso y formato, favoritos, íconos y catálogo de ejemplo. **No está publicada todavía**. Los libros se abren desde enlaces legales; los PDF externos no se almacenan automáticamente sin conexión.

## Paso 1 — Publicar la aplicación
1. Crear una cuenta gratuita en https://github.com/signup
2. Entrar a https://github.com/new y crear un repositorio **público** llamado `biblionuble`.
3. Elegir `Add file` > `Upload files` y subir **los archivos y la carpeta `icons` que están DENTRO de esta carpeta**, no el ZIP.
4. Pulsar `Commit changes`.
5. Ir a `Settings` > `Pages` > `Build and deployment` > `Deploy from a branch`; elegir `main` y `/(root)`, guardar.
6. La dirección será `https://TUUSUARIO.github.io/biblionuble/`. Puede tardar varios minutos.

## Paso 2 — Administrar libros desde Google Sheets (solo una vez)
1. Abrir https://sheets.google.com y crear una hoja.
2. Importar `catalogo_ejemplo.csv` mediante Archivo > Importar > Subir.
3. Mantener los encabezados exactamente como están. Cada fila es un recurso. `estado=Publicado` muestra el libro; `estado=Oculto` lo retira. `curso` admite `5° 6° 7° 8°`.
4. Elegir Archivo > Compartir > Publicar en la Web; seleccionar **solo la pestaña del catálogo** y formato **CSV**, publicar y copiar el enlace. Las opciones pueden variar en cuentas escolares. **Todo lo publicado es público: no añadir nombres de estudiantes ni datos personales.**
5. En GitHub, abrir `config.js`, pulsar el lápiz y reemplazar el valor vacío de `csvUrl` con el enlace CSV completo entre comillas. Guardar con `Commit changes`.
6. Esperar a que se actualice el sitio. Luego solo agregar filas a Sheets para añadir libros.

Ejemplo de configuración: `window.BIBLIO_CONFIG = { csvUrl: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv" };`

## Sin Google Sheets
También puedes editar el archivo `catalogo.csv` (mismas columnas) y subirlo de nuevo al repositorio. Este modo requiere actualizar el archivo cada vez.

## Cómo instalar en celulares
- Android: abrir la web en Chrome y usar `Instalar aplicación` o el menú > `Añadir a pantalla de inicio`.
- iPhone: abrir en Safari, Compartir > `Añadir a pantalla de inicio`.
- Computador: abrir la web en Chrome o Edge y usar la opción de instalación si aparece.

## Qué tipos de enlaces usar
En la columna `enlace` poner una dirección HTTPS a un PDF autorizado, EPUB, audiolibro o sitio de lectura. El botón abre el recurso en una pestaña nueva. `portada` es opcional y debe apuntar a una imagen HTTPS pública. No subir obras protegidas sin permiso; para bibliotecas con préstamo, enlazar a su sitio.

## Seguridad y límites
- La hoja publicada y su contenido son públicos; solo compartir el catálogo, nunca datos de estudiantes.
- No usar la hoja como formulario de respuestas de estudiantes.
- El plan gratuito de GitHub Pages tiene límites y exige repositorio público para este caso.
- Para que los alumnos puedan leer los libros, necesitan conexión, salvo que el recurso permita descarga legal o lectura offline propia.
- Las portadas y enlaces deben ser apropiados para la edad y respetar los derechos de autor.

## Problemas frecuentes
- Si muestra libros de demostración: verificar `config.js` y la URL CSV publicada.
- Si el CSV no se actualiza inmediatamente: esperar unos minutos y recargar.
- Si no se instala: verificar que el sitio se abrió desde la URL HTTPS publicada y no desde un archivo local.
