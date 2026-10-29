# APK de Comi2

Las APK de prueba se generan **siempre** en esta carpeta, con la versión en el nombre:

**`releases/comi2-v<versión>.apk`** (por ejemplo `comi2-v2.4.apk`)

y además **`releases/comi2.apk`**, que es siempre una copia de la última generada.

La versión sale de `versionName` en `app/android/app/build.gradle`: súbela (junto a `versionCode`) antes de generar una APK nueva.

- `npm run cap:apk:debug` (Windows) o `npm run cap:apk:debug:unix` (Linux/macOS), desde `app/`
- Los `*.apk` **no se versionan** en git (`.gitignore`)

Copia también generada por Gradle en:

`app/android/app/build/outputs/apk/debug/app-debug.apk`
