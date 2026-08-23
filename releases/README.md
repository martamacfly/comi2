# APK de Comi2

Las APK de prueba se generan **siempre** en esta carpeta:

**`releases/comi2.apk`**

En Windows eso es `C:\Users\<usuario>\...\Comi2\releases\comi2.apk`.

- `npm run cap:apk:debug` (Windows) o `npm run cap:apk:debug:unix` (Linux/macOS), desde `app/`
- Los `*.apk` **no se versionan** en git (`.gitignore`)

Copia también generada por Gradle en:

`app/android/app/build/outputs/apk/debug/app-debug.apk`
