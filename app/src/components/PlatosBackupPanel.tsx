import { useRef, useState } from 'react';
import { DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import { useListaCompra } from '../context/useListaCompra';
import {
  buildBackupPayload,
  downloadBackupFile,
  parseBackupJson,
  restoreBackupData,
} from '../lib/backup';

type PlatosBackupPanelProps = {
  onImportSuccess?: () => void;
};

export function PlatosBackupPanel({ onImportSuccess }: PlatosBackupPanelProps) {
  const { borrarLista } = useListaCompra();
  const fileRef = useRef<HTMLInputElement>(null);
  const [exportando, setExportando] = useState(false);
  const [importando, setImportando] = useState(false);
  const [errorImport, setErrorImport] = useState<string | null>(null);

  const exportar = async () => {
    setExportando(true);
    setErrorImport(null);
    try {
      const payload = await buildBackupPayload();
      await downloadBackupFile(payload);
    } catch (e) {
      setErrorImport(
        e instanceof Error ? e.message : 'No se pudo exportar el respaldo',
      );
    } finally {
      setExportando(false);
    }
  };

  const elegirArchivo = () => {
    setErrorImport(null);
    fileRef.current?.click();
  };

  const onArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const ok = window.confirm(
      '¿Restaurar desde este archivo? Se borrarán todos los datos actuales en este dispositivo (productos, platos, etiquetas, semana planificada y lista generada en memoria) y se sustituirán por los del respaldo. Esta acción no se puede deshacer.',
    );
    if (!ok) return;

    setImportando(true);
    setErrorImport(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text =
          typeof reader.result === 'string'
            ? reader.result
            : new TextDecoder().decode(reader.result as ArrayBuffer);
        const data = parseBackupJson(text);
        await restoreBackupData(data);
        borrarLista();
        onImportSuccess?.();
      } catch (err) {
        setErrorImport(
          err instanceof Error ? err.message : 'Error al importar el archivo',
        );
      } finally {
        setImportando(false);
      }
    };
    reader.onerror = () => {
      setErrorImport('No se pudo leer el archivo');
      setImportando(false);
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <div className="platos-backup">
      <h2 className="platos-backup__title">Respaldo</h2>
      <p className="muted platos-backup__lead">
        Exporta todo el contenido (productos, platos, etiquetas y semana
        planificada) a un archivo JSON para hacer copia de seguridad o pasarlo a
        otro navegador o instalación de Comi2. Importar{' '}
        <strong>reemplaza por completo</strong> los datos de esta copia de la app.
      </p>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="platos-backup__file-input"
        aria-label="Seleccionar archivo JSON de respaldo de Comi2"
        tabIndex={-1}
        onChange={onArchivo}
      />
      <div className="btn-group platos-backup__actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => void exportar()}
          disabled={exportando || importando}
        >
          <DownloadSimple size={20} weight="duotone" aria-hidden />
          {exportando ? 'Exportando…' : 'Exportar respaldo'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={elegirArchivo}
          disabled={exportando || importando}
        >
          <UploadSimple size={20} weight="duotone" aria-hidden />
          {importando ? 'Importando…' : 'Importar respaldo'}
        </button>
      </div>
      {errorImport && (
        <p className="alert alert--error platos-backup__error" role="alert">
          {errorImport}
        </p>
      )}
    </div>
  );
}
