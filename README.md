# AgroGestión 360

**Sistema integral de gestión agropecuaria** - Taller de Desarrollo Web 2025

## Índice
- [Información del Proyecto](#información-del-proyecto)
- [Autores](#autores)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Contenido de la Página](#contenido-de-la-página)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Enlaces](#enlaces)
- [Instalación y Uso](#instalación-y-uso)
- [Tests](#tests)
- [Actualización automática de precios](#actualización-automática-de-precios)
- [Publicación en GitHub Pages](#publicación-en-github-pages)
- [Requisitos del Primer Parcial](#requisitos-del-primer-parcial)
- [Requisitos del Segundo Parcial](#requisitos-del-segundo-parcial)
- [Requisitos del Final](#requisitos-del-final)

## Información del Proyecto

**AgroGestión 360** es una aplicación web diseñada para la **gestión integral de actividades agropecuarias**. La plataforma permite a los usuarios administrar su maquinaria agrícola, registrar su ganadería, calcular costos de siembra, consultar el clima de cualquier punto del mapa y acceder a las bolsas de cereales.

### Características Principales
- **Inicio de sesión y registro**: Acceso con email y contraseña (guardados en localStorage)
- **Gestión de Maquinaria**: Registro con foto, precio y estado
- **Control de Ganadería**: Inventario de animales por tipo y raza con contadores +1 / -1
- **Calculadora de Costos**: Costo por hectárea, costo total, ingreso esperado y utilidad
- **Clima**: Consulta en tiempo real a la API de Open-Meteo eligiendo un punto en el mapa. Se puede guardar un punto como **"mi campo"** (queda en localStorage y el mapa arranca ahí)
- **Bolsa de Cereales**: Precios de pizarra reales (en pesos y dólares, con su fecha) de Rosario y Córdoba, que se **actualizan solos todos los días hábiles** con GitHub Actions
- **Almacenamiento Local**: Persistencia de sesión, maquinaria, ganadería y tema elegido entre visitas
- **Panel de resumen**: Máquinas activas, total de animales y valor de la maquinaria en la portada
- **Buscador de maquinaria**: Filtro en tiempo real por nombre/tipo y por estado; cada máquina tiene un botón para activarla o desactivarla
- **Modo oscuro**: Botón 🌙 en el encabezado; la preferencia queda guardada
- **Diseño responsive**: Menú hamburguesa en celulares y grillas que se adaptan al ancho

## Autores
- **Marfortt, Renzo**
- **Baudino, José**

## Tecnologías Utilizadas

| Categoría                | Tecnología                                   |
|--------------------------|----------------------------------------------|
| **Framework**            | React 19                                     |
| **Herramienta de build** | Vite 7                                       |
| **Enrutamiento**         | react-router-dom 6 (HashRouter + Outlet)     |
| **Estilos**              | SCSS (Sass) + Google Fonts (Poppins)         |
| **Mapas**                | Leaflet + OpenStreetMap                      |
| **API externa**          | Open-Meteo (fetch)                           |
| **Almacenamiento**       | localStorage                                 |
| **Tests**                | Jest + React Testing Library                 |
| **Calidad de código**    | ESLint                                       |
| **Control de Versiones** | Git & GitHub                                 |
| **Deployment**           | GitHub Pages (carpeta `docs/`)               |

## Contenido de la Página

### Rutas
| Ruta      | Página                                  |
|-----------|-----------------------------------------|
| `#/home`  | Bienvenida: inicio de sesión y registro |
| `#/`      | Aplicación principal (requiere sesión)  |

### Secciones de la aplicación principal

1. **Inicio**
   - Presentación del sistema y menú de navegación
2. **Organizador de Maquinaria**
   - Formulario con validación en tiempo real y carga opcional de foto
   - Lista dinámica con confirmación antes de eliminar
3. **Registro de Ganadería**
   - Inventario por tipo de animal y raza
   - Contadores dinámicos (+1, -1)
4. **Calculadora de Costos de Siembra**
   - Costo por hectárea, costo total, ingreso esperado y utilidad
   - Validación de campos numéricos (vacíos, letras, negativos, máximos)
5. **Clima**
   - Mapa interactivo: al hacer clic se muestran temperatura, viento, humedad y probabilidad de lluvia
   - Botón "Guardar punto como mi campo": el punto queda guardado y se muestra con un círculo verde
6. **Bolsa de Cereales**
   - Tarjetas de la Bolsa de Rosario y la Bolsa de Córdoba, armadas con `fetch` a `public/data/cotizaciones.json`
   - Precios de pizarra reales de [CAC - BCR](https://www.cac.bcr.com.ar/es/precios-de-pizarra) (Rosario) y [BCCBA](https://www.bccba.org.ar/) (Córdoba), con la fecha de cada pizarra
   - Se actualizan automáticamente (ver [Actualización automática de precios](#actualización-automática-de-precios))

### Funcionalidades Técnicas
- **Validaciones en tiempo real** (`onChange`) con mensajes accesibles (`role="alert"`, `aria-invalid`)
- Al enviar un formulario con datos inválidos se avisa al usuario y **se blanquean los campos incorrectos**
- **Sesión compartida con Context** (`useContext`) y rutas protegidas
- **Diseño responsivo** para desktop y móvil

## Estructura del Proyecto

```
Proyecto2025-Baudino-Marfortt/
├── Sketch/            # Bocetos en papel (PC y Móvil)
├── Mockup/            # Mockups desktop y mobile
├── .github/workflows/ # Tarea diaria que actualiza las cotizaciones
├── docs/              # Build de producción publicado en GitHub Pages
└── frontend/          # Código fuente (React + Vite)
    ├── index.html
    ├── public/data/   # cotizaciones.json (lo actualiza GitHub Actions)
    ├── scripts/       # actualizar-cotizaciones.js (lee las pizarras de las bolsas)
    └── src/
        ├── api/          # Servicios: clima (fetch a Open-Meteo) y cotizaciones (fetch al JSON de precios)
        ├── assets/
        │   └── imagenes/ # Imágenes del sitio
        ├── components/   # Componentes reutilizables (Button, Card, Input, ConfirmModal, secciones)
        ├── contexts/     # Contexto y proveedor de sesión
        ├── hooks/        # Hooks propios: useFormulario, useLocalStorage y useTema
        ├── layouts/      # MainLayout (header + Outlet + footer)
        ├── pages/        # HomePage (login/registro) e IndexPage (principal)
        ├── styles/       # Hoja de estilos SCSS
        ├── utils/        # Validaciones, cálculos y localStorage
        └── __tests__/    # Tests con Jest + React Testing Library
```

## Enlaces

- **Sitio Web**: [AgroGestión 360 - GitHub Pages](https://josebaudino.github.io/Proyecto2025-Baudino-Marfortt/)
- **Repositorio**: [GitHub Repository](https://github.com/JoseBaudino/Proyecto2025-Baudino-Marfortt)
- **Imagen de fondo**: ["Expansive Green Soybean Field Under Cloudy Sky"](https://www.pexels.com/photo/expansive-green-soybean-field-under-cloudy-sky-38740391/) de Clinton Weaver en Pexels (licencia gratuita de Pexels)

## Instalación y Uso

### Requisitos Previos
- Node.js 18 o superior y npm
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Instrucciones
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JoseBaudino/Proyecto2025-Baudino-Marfortt
   ```
2. **Instalar dependencias:**
   ```bash
   cd Proyecto2025-Baudino-Marfortt/frontend
   npm install
   ```
3. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
4. Abrir **http://localhost:5173/** en el navegador.

### Uso de la Aplicación
1. **Registro / Login**: Creá una cuenta y luego iniciá sesión. *Al ser una demo sin servidor, se guarda un solo usuario en el navegador: si se registra otra cuenta, reemplaza a la anterior.*
2. **Maquinaria**: Completá el formulario y, opcionalmente, agregá una foto
3. **Ganadería**: Seleccioná tipo de animal, raza y cantidad inicial (no se puede repetir la misma raza para un mismo animal)
4. **Calculadora**: Ingresá hectáreas, dosis y precio de semilla (obligatorios) y el resto de los costos
5. **Clima**: Hacé clic en cualquier punto del mapa
6. **Bolsa**: Hacé clic en una tarjeta para ver los precios actualizados

## Tests

Los tests están en `frontend/src/__tests__/` (24 tests: componentes genéricos, servicio y tabla de precios, validaciones, cálculos, calculadora, ganadería, buscador y cambio de estado de maquinaria, panel de resumen, modo oscuro, navegación y sesión).

```bash
cd frontend
npm test
```

## Actualización automática de precios

Las bolsas no permiten leer sus páginas desde el navegador (bloqueo CORS), por eso los precios se leen "del lado del servidor":

1. De lunes a viernes a las 18:30 (hora argentina), **GitHub Actions** ejecuta `.github/workflows/actualizar-cotizaciones.yml`.
2. La tarea corre `frontend/scripts/actualizar-cotizaciones.js`, que descarga las pizarras de Rosario y Córdoba y guarda los precios en `frontend/public/data/cotizaciones.json` y `docs/data/cotizaciones.json`.
3. Si los precios cambiaron, hace un commit automático y vuelve a publicar el sitio.
4. La app pide el JSON con `fetch` cada vez que se abre, así que siempre muestra la última pizarra.

Si una bolsa no se puede leer, se mantienen sus precios anteriores. También se puede actualizar a mano:

```bash
cd frontend
npm run cotizaciones
```

o desde GitHub: pestaña **Actions** → **Actualizar cotizaciones** → **Run workflow**.

## Publicación en GitHub Pages

GitHub Pages publica la carpeta `docs/` de la rama `main`. Para actualizarla:

```bash
cd frontend
npm run build   # genera el build en ../docs
```

Luego hacer commit y push de la carpeta `docs/`.

---


## Requisitos del Primer Parcial

### Sobre el Sketch
- [ ] Versión Desktop y Mobile
- [ ] Guardado en formato PNG, JPG ó PDF
- [ ] Dentro de una carpeta llamada "Sketch"
- [ ] En el diseño tener en cuenta los mensajes de error para el usuario

Tener en cuenta:
* ¿Qué opciones debe ofrecer al usuario?
* ¿Qué campos hay para ingresar datos?
* Benchmarking: Investigar sistemas similares
* ¿Qué acciones le permiten al usuario realizar?
* Mensajes de Error

### Sobre el Wireframe/Mockup
- [ ] Dibujado con algún programa como: Figma, AdobeXD, Canvas, Draw.io en Drive, Pencil Project, Mockups, NinjaMock, o similares.
- [ ] Diseño de Mensajes de error para el usuario
- [ ] Versión Desktop y Mobile
- [ ] Guardado en formato PNG, JPG ó PDF
- [ ] Dentro de una carpeta llamada "Wireframe" ó "Mockup"

### Sobre el Repositorio
- [ ] El proyecto debe estar subido al repositorio adecuado "Proyecto2025-ApellidoAlumno1-ApellidoAlumno2"
- [ ] Modificar el Readme.MD y colocar información del proyecto/página (mínimamente: título del proyecto, autores con nombre y apellido, link de gh-pages, contenido de la página,  listado de tecnologías usadas, etc)
- [ ] En el **readme.md** se debe emplear Markdown y aplicar negrita, titulo de orden 1, 2 y 3, link, items, tabla, index a cada sección
- [ ] El código debe estar pusheado en el repositorio (emplear gh-pages ó publicar la página desde el main), y no debe haber diferencias entre **main** y **gh-pages** (verificar de realizar el Merge).
- [ ] Publicar la Web empleando GitHubPages
- [ ] El repositorio no debe contener archivos innecesarios (no debe contener .idea o .vsc ni .DS_Store, en todo caso emplear **.gitignore**)

### Sobre el Proyecto General
- [ ] La página principal debe llamarse index
- [ ] NO está permitido descargar un TEMPLATE (diseño 100% desde cero)
- [ ] La estructura del proyecto debe ser adecuada
      - Crear una carpeta para las imágenes
      - Carpeta para los sketch
      - Carpeta para los mockups/Wireframes
      En una segunda etapa, al emplear **React**:
      - Carpeta de Componentes
      - Carpeta de Pages
      - Carpeta de Styles
- [ ] Identar correctamente el código (en Webstorm Ctrl+Alt+L)
- [ ] No debe haber errores presentes (realizar *Code* > *Inspect Code* para verificar que no haya errores)
- [ ] Se debe emplear algún favicon
- [ ] Emplear alguna fuente de google fonts o subir al proyecto alguna fuente externa
- [ ] Debe haber navegación entre todas las páginas
- [ ] No debe haber errores de ortografía en el contenido visual
- [ ] "Lorem ipsum" es sólo válido para los prototipos, NO para la página

### Sobre el HTML
- [ ] Todas las etiquetas deben estar en minúscula
- [ ] Poner comillas a todos los atributos
- [ ] Title debe contener el título de la página
- [ ] En el ```<head></head>``` incluir las etiquetas ```<meta>``` detallando: autor, descripcion y palabras clave
- [ ] Emplear al menos 3 etiquetas semánticas diferentes (header, nav, aside, main, section, article, footer)
- [ ] Emplear ```<header></header>```. En el contenido de la cabecera debe haber un título ```<h1></h1>```, puede tener color de fondo, algún logotipo, etc.
- [ ] Debe haber por lo menos una etiqueta ```<img>``` en la página.
- [ ] La estructura de la página debe estar definida con ```<div></div>```
- [ ] Debe contener al menos 3 elementos de tipo ```<input>``` o ```<select>``` ó ```<button>``` que le permitan al usuario ingresar valores para poder realizar un cálculo de un ejercicio.
- [ ] Emplear el atributo [**placeholder**](U2_HTM  L_avanzado.html#/19) (mínimamente en 1 input)
- [ ] Emplear el atributo **size** para que el tamaño de los inputs sea prolijo
- [ ] Emplear el atributo **maxlength** para que el usurario no pueda ingresar valores "muy grandes"
- [ ] No espaciar con excesivos ```<br>```. Utilizar márgenes, paddings, etc.
- [ ] La anidación de etiquetas HTML debe ser correcta.
- [ ] No utilizar etiquetas deprecadas.
- [ ] Todas las etiquetas deben estar correctamente cerradas
- [ ] Los ids de los elementos deben ser unívocos

### Sobre las imágenes
- [ ] Debe contener por lo menos una etiqueta ```<img>``` en la página.
- [ ] Todas las imágenes deben ser incluidas en el repositorio dentro de una carpeta llamada **imagenes** (salvo que sean demasiado pesadas. En ese caso, se puede emplear un servidor externo).
- [ ] No se deben subir videos en el repositorio (excepto que sean MUY livianos).
- [ ] Toda imagen debe tener su atributo alt
- [ ] Las imágenes deben poseer un nombre representativo 

### Sobre el CSS
- [ ] El estilo de los elementos debe establecerse en un archivo CSS (prohibido poner el atributo style a los elementos o emplear estilos incrustados).
- [ ] El CSS debe contar mínimo con un tipo de cada forma (por Tag, por ID y por clase).
- [ ] Se debe emplear pseudoclase
- [ ] No emplear !important
- [ ] El diseño de la página debe ser consistente
- [ ] En la primera etapa debe existir un único archivo CSS (se debe evitar código duplicado. Se debe aplicar re-utilización de código/estilos)

### Sobre Accesibilidad:
- [ ] Toda imagen debe tener su etiqueta alt
- [ ] Todo ```<input>``` o ```<select>``` debe tener su ```<label>```
- [ ] Los labels deben contener el atributo **for** (el for debe contener el id del input al cual se referencia) 
- [ ] Si hay una tabla en la página, debe contener ```<caption></caption>```

### Sobre la funcionalidad JavaScript
Se debe agregar funcionalidad Js a la página HTML+CSS desarrollada
- [ ] Una función que compruebe si los valores ingresados son correctos, y si no lo son, que le indique al usuario por un alert o dialog, y que blanquee el contenido del campo.
- [ ] Una función que calcule/muestre algo en base a los valores ingresados por el usuario en los inputs.
- [ ] El código Js debe estar en un archivo externo
- [ ] Se debe emplear var, let o const según corresponda para mayor eficiencia
- [ ] No deben existir funciones innecesarias que no se llamen en ninguna sección del código
- [ ] Las funciones deben estar escritas cómo **función flecha**
- [ ] No debe haber errores JavaScript presentes (F12 > Consola)
- [ ] El funcionamiento de la página debe ser consistente.

### Sobre la documentación
- [ ] TODAS las funciones javaScript deben estar comentadas adecuadamente. [JsDoc](https://jsdoc.app/about-getting-started.html)
   ```/**
     * Descripción de que hace la función
     * @method Nombre de la función
     * @param {string} ParámetroA - Explicación de que valor almacena ParámetroA
     * @param {number} ParámetroB - Explicación de que valor almacena ParámetroB
     * @return Valor que retorna
     */
   ```

### Testing 

- Es sumamente IMPORTANTE probar el funcionamiento de la página con diferentes valores.
- ¿Qué pasa si presiono calcular sin ingresar nada?
- ¿Y si ingreso solo algunos campos? ¿Y si ingreso todo cero? ¿Y si ingreso letras? ¿Y si ingreso números negativos?
- ¿Si vacío el carrito de compras?¿Si recargo la página?
- Prueba todas las situaciones posibles, no te quedes solo con el **happy path**.

### Sobre las correcciones
* Se corregirá el proyecto con el último commit realizado en Github hasta las 23:59 del día anterior a la fecha de entrega
* Las notas serán de la siguiente manera: (Por ejemplo 55% 4; 59% 5; 67% 6; 75% 7; 82% 8; 89% 9; 97% 10)
* Todas los errores o la falta de cumplimiento de los requisitos serán reportados a través de la plataforma de GitHub, en la pestaña de ISSUES

| Items a Evaluar    | %   |
|--------------------|-----|
| Prototipo en papel | 7%  |
| Prototipo Mockup   | 8%  |
| HTML+CSS+Js        | 85% |

Por cada corrección o defecto en el HTML+CSS+Js se descontará un 5% del 85%.

## Requisitos del Segundo Parcial

### Sobre React
- [ ] Se debe emplear **Vite** para instalar **React**
- [ ] Se debe emplear **Hooks**, useState, useEffect, useContext, useNavigate
- [ ] Se debe emplear **react-router-dom** para el enrutamiento a otras p�ginas
- [ ] Se debe emplear **outlet** para que un componente principal renderice componentes de rutas hijas.
- [ ] La estructura del proyecto (carpetas) debe ser el correcto: components, pages, styles
- [ ] Los **imports** deben ser usando con **alias**
- [ ] Validaciones en tiempo real con onChange + mensajes de error accesibles.
- [ ] Crear al menos un componente genérico (ej: Button, Card, Input) y reutilizarlo en varias páginas.
- [ ] Guardar algún dato en localStorage (ej: preferencias de tema o un carrito de compras).
- [ ] En caso de tener backend, emplear **fetch**
- [ ] En caso de no contar con un servicio que nos provea la información necesaria, la misma debe ser leída en formato tipo Json local y renderizar listas dinámicas. Ejemplo:
````javascript
const activities = [
  {
    nombre: "taekwondo",
    descripcion: "Arte marcial coreana",
    horarios: [
      { dia: 2, "hora-inicio": "18:30", "hora-fin": "20:00" },
      { dia: 4, "hora-inicio": "18:30", "hora-fin": "20:00" }
    ]
  },
  {
    nombre: "zumba",
    descripcion: "ritmos latinos",
    horarios: [
      { dia: 1, "hora-inicio": "19:30", "hora-fin": "20:30" },
      { dia: 3, "hora-inicio": "19:30", "hora-fin": "20:30" }
    ]
  }
];
````

### Sobre las Correcciones
- [ ] Todas las correcciones y mejoras (sugerencias) solicitadas durante el primer parcial deben estar corregidas.
- [ ] No debe haber errores presentes en el código (realizar *Code* > *Inspect Code* para verificar que no haya errores)
- [ ] Se corregirá el proyecto con el último commit realizado en Github hasta las 23:59 del día anterior a la fecha de entrega
- [ ] Las notas serán de la siguiente manera: (Por ejemplo 55% 4; 59% 5; 67% 6; 75% 7; 82% 8; 89% 9; 97% 10)
- Las sugerencias sobre el HTML, CSS y Js realizadas en el anterior parcial dejen ser corregidas.

| Items a Evaluar                          | %   |
|------------------------------------------|-----|
| Estructura del Proyecto                  | 10% |
| Navegación con react-router-dom          | 15% |
| Uso correcto de Hooks                    | 20% |
| Renderizado dinámico de datos            | 25% |
| Validaciones y mensajes de error         | 10% |
| Consistencia del diseño y uso de estilos | 10% |
| Código limpio y sin errores en consola   | 10% |

## Requisitos del FINAL
- [ ] Todas las correcciones y mejoras solicitadas durante el primer y segundo parcial deben estar corregidas.
- [ ] No debe haber errores presentes en el código (realizar Code > Inspect Code para verificar que no haya errores)
- [ ] No debe haber errores JavaScript presentes (F12 > Consola)
- [ ] Debe cumplir con TODOS los requisitos del 1er y 2do Parcial (si se agrego código nuevo en Js, se debe documentar, si hay nuevos inputs de html deben contener su label, etc)
- [ ] Incluir al menos 5 tests con Jest + React Testing Library (ejemplo: que un botón renderice un texto esperado).

