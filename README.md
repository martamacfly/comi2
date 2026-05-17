# Comi2

![Comi2](assets/imagenes/comi2.svg)

**Comi2** es una aplicación web sencilla para organizar **qué comer cada día de la semana** y sacar una **lista de la compra** con lo que necesitas. Pensada para el día a día en casa: tus platos, tus productos, tu menú.

> **Proyecto personal · hecho con IA y vibecoding**  
> Este repositorio nació como una herramienta para uso propio. El código y la documentación se han ido construyendo con ayuda de **inteligencia artificial** y **vibecoding** (iterar en conversación con el asistente, probar en el navegador, ajustar). No es un producto comercial ni un servicio con soporte: si te sirve, adelante; si encuentras algo raro, es normal en un proyecto así.

---

## ¿Para qué sirve?

1. Guardas **productos** (ingredientes, con emoji si quieres).
2. Creas **platos** con esos productos, si son de comida, cena o ambos, y etiquetas de color.
3. En **Semana** asignas un plato a cada comida y cena (lunes a domingo).
4. En **Lista** generas la compra: productos únicos de los platos planificados; puedes tachar lo que ya tienes en casa.

Todo se guarda **en tu navegador** (sin cuenta ni servidor). Si borras los datos del sitio, pierdes el contenido.

```mermaid
flowchart LR
  Productos[Productos] --> Platos[Platos]
  Platos --> Semana[Semana]
  Semana --> Lista[Lista de la compra]
```

---

## Probar la app en tu ordenador

Necesitas [Node.js](https://nodejs.org/) LTS (v20 o superior).

```bash
cd app
npm install
npm run dev
```

Abre la URL que muestre la terminal (suele ser `http://localhost:5173`).

**Primer paseo:** crea un plato → rellena la semana → genera la lista. Los productos también puedes crearlos al editar un plato.

---

## App Android (APK)

Comi2 se puede instalar en el móvil como **APK** gracias a [Capacitor](https://capacitorjs.com/): la misma app web va dentro de una WebView; los datos siguen en **IndexedDB** en el dispositivo.

**Requisitos:** Node (como arriba), **JDK 21**, **Android SDK** (p. ej. con Android Studio).

```bash
cd app
npm install
# Una vez: copia android/local.properties.example → android/local.properties y pon tu sdk.dir
npm run cap:apk:debug
```

La APK queda en:

- **`releases/comi2.apk`** (copia fácil de encontrar en la raíz del repo)
- `app/android/app/build/outputs/apk/debug/app-debug.apk` (salida de Gradle; carpeta ignorada por git)

Pasos completos, requisitos, solución de problemas y lista de cambios en el repo: **[docs/guias/android-apk.md](docs/guias/android-apk.md)**.

---

## Si quieres profundizar

| Quiero… | Dónde mirar |
|--------|-------------|
| Entender el proyecto de punta a punta | **[howto-comi2.md](howto-comi2.md)** — guía principal |
| Generar la APK Android | **[docs/guias/android-apk.md](docs/guias/android-apk.md)** |
| Requisitos y funcionalidades | [docs/](docs/) |
| Colores, logo y cabecera | [docs/branding/branding.md](docs/branding/branding.md) |
| Código de la app | carpeta [`app/`](app/) (React + Vite + TypeScript + Dexie + Capacitor) |

### Rutas de la app

| Ruta | Qué es |
|------|--------|
| `/platos` | Tu recetario (por listado, momento o etiquetas) |
| `/productos` | Ingredientes |
| `/semana` | Planificador de la semana |
| `/lista` | Lista de la compra |

---

## Cómo está hecho (resumen)

| Parte | Tecnología |
|-------|------------|
| Interfaz | React, TypeScript |
| Navegación | React Router |
| Build | Vite |
| Datos en el navegador / móvil | Dexie (IndexedDB), base `comi2-db` |
| APK Android | Capacitor 8 (`es.comi2.app`) |

Comandos útiles dentro de `app/`: `npm run dev`, `npm run build`, `npm run lint`, `npm run cap:apk:debug`.

---

## Estructura del repo

```
Comi2/
├── README.md         ← estás aquí
├── howto-comi2.md    ← documentación detallada
├── releases/         ← APK de prueba (comi2.apk) tras npm run cap:apk:debug
├── docs/             ← requisitos, arquitectura, branding, guía APK…
├── assets/           ← logos e imágenes (logo2, comi2…)
└── app/              ← código (web + proyecto Android en app/android/)
```

---

## Licencia y uso

Uso **personal**. Puedes inspirarte en el código o forkarlo para ti, pero no hay garantías. La marca y los assets en `assets/imagenes/` son parte de este proyecto concreto.

Si tienes curiosidad por el proceso (IA, decisiones, MVP), la [howto](howto-comi2.md) y los docs en `docs/` cuentan el resto con más detalle técnico.
