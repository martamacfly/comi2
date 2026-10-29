/**
 * Copia la APK debug a releases/ con la versión en el nombre (comi2-v2.4.apk)
 * y deja además releases/comi2.apk como copia de la última.
 * La versión sale de versionName en android/app/build.gradle.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const gradle = readFileSync(join(root, 'android', 'app', 'build.gradle'), 'utf8')
const version = gradle.match(/versionName\s+"([^"]+)"/)?.[1]
if (!version) {
  console.error('No se encontró versionName en android/app/build.gradle')
  process.exit(1)
}

const apk = join(root, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
if (!existsSync(apk)) {
  console.error(`No existe ${apk}. ¿Ha fallado Gradle?`)
  process.exit(1)
}

const releases = join(root, '..', 'releases')
mkdirSync(releases, { recursive: true })
const conVersion = join(releases, `comi2-v${version}.apk`)
copyFileSync(apk, conVersion)
copyFileSync(apk, join(releases, 'comi2.apk'))
console.log(`APK lista: ${conVersion}`)
console.log(`(copia de la última en ${join(releases, 'comi2.apk')})`)
