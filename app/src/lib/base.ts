// En GitHub Pages la app vive bajo /comi2/ (BASE_URL absoluta); en la APK se compila con './' y se sirve desde la raíz.
const baseAbsoluta = import.meta.env.BASE_URL.startsWith('/');

/** Prefijo para el router: solo hace falta cuando la app no está en la raíz. */
export const ROUTER_BASENAME = baseAbsoluta ? import.meta.env.BASE_URL : undefined;

/** URL de un archivo de `public/` que funciona tanto en la web como en la APK. */
export function publicUrl(archivo: string): string {
  return (baseAbsoluta ? import.meta.env.BASE_URL : '/') + archivo.replace(/^\//, '');
}
