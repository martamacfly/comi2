/**
 * Mantiene app/assets/icon.svg alineado con public/favicon.svg (fuente del icono APK/PWA).
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'public', 'favicon.svg')
const destDir = join(root, 'assets')
const dest = join(destDir, 'icon.svg')

mkdirSync(destDir, { recursive: true })
copyFileSync(src, dest)
console.log('icon.svg ← favicon.svg')
