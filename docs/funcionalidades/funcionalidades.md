# Funcionalidades — Comi2

## Visión general

Comi2 es una aplicación para **organizar qué comer cada día de la semana** y **sacar de ahí la compra**.

Flujo principal:

1. El usuario crea **productos** (ingredientes).
2. Crea **platos**, les asigna **productos** y **etiquetas** (ej. vegetariano, rápido).
3. En el **planificador semanal**, elige platos para cada **comida** y **cena** de cada día.
4. Genera la **lista de la compra** sumando los productos de todos los platos planificados.

```mermaid
flowchart LR
  Productos[Catálogo productos]
  Platos[Catálogo platos]
  Plan[Plan semanal]
  Lista[Lista de la compra]
  Productos --> Platos
  Platos --> Plan
  Plan --> Lista
```

## MVP (versión mínima viable)

| Feature | Descripción | Estado |
|---------|-------------|--------|
| CRUD productos | Alta, edición y borrado de productos | Pendiente |
| CRUD platos | Alta, edición y borrado de platos | Pendiente |
| Etiquetas | CRUD de etiquetas y asignación de varias etiquetas por plato | Pendiente |
| Ingredientes del plato | Añadir/quitar productos a un plato (sin cantidades) | Pendiente |
| Plan semanal | Lunes–domingo; 1 plato/comida + 1 plato/cena por día | Pendiente |
| Generar lista de la compra | Listar productos únicos de los platos planificados (sin sumar cantidades) | Pendiente |
| Persistencia local | Todo en IndexedDB vía Dexie | En curso (smoke test) |

## Funcionalidades futuras

| Feature | Descripción | Prioridad |
|---------|-------------|-----------|
| Marcar productos comprados en la lista | Checkbox o estado por línea | Media |
| Copiar semana anterior | Plantilla de menú recurrente | Baja |
| Categorías de productos | Agrupar en la lista (fruta, carnicería…) | Baja |
| Desayuno u otras comidas | Ampliar más allá de comida/cena | Baja |
| Exportar lista | PDF o compartir texto | Baja |
| Varias semanas guardadas | Historial de planes | Baja |

## Módulos

### Módulo 1 — Catálogo de productos

Gestión del inventario de ingredientes reutilizables entre platos.

**Criterios de aceptación:**

- [ ] Puedo crear un producto con nombre (y unidad por defecto si aplica).
- [ ] Puedo editar y eliminar un producto.
- [ ] No se puede eliminar un producto si está en uso en algún plato (o se avisa y desvincula).

### Módulo 2 — Catálogo de platos

Cada plato agrupa los productos de su elaboración, tiene un **momento** (comida, cena o ambos) y puede llevar **varias etiquetas** libres.

**Criterios de aceptación:**

- [ ] Puedo crear un plato con nombre y **momento**: comida, cena o ambos.
- [ ] Puedo añadir productos al plato (solo selección del catálogo, sin cantidades).
- [ ] Al **editar un plato**, puedo crear una etiqueta nueva (nombre + **color**) y asignarla al plato en el mismo flujo.
- [ ] Puedo elegir etiquetas ya existentes del catálogo (mismas etiquetas reutilizables en otros platos).
- [ ] Puedo cambiar el nombre o el color de una etiqueta existente (el cambio se refleja en todos los platos que la usan).
- [ ] Puedo quitar una etiqueta del plato sin borrarla del catálogo.
- [ ] Puedo eliminar una etiqueta del catálogo (se desvincula de todos los platos).
- [ ] Las etiquetas se muestran como **chips** con su color de fondo o borde en listado, detalle del plato y planificador.
- [ ] Puedo editar y eliminar platos.

### Módulo 3 — Planificador semanal

Vista de la semana actual con huecos **Comida** y **Cena** por día.

**Criterios de aceptación:**

- [ ] Veo la semana de **lunes a domingo** con dos huecos por día (comida, cena).
- [ ] Puedo asignar **un plato** por hueco (o dejarlo vacío).
- [ ] Solo se ofrecen platos cuyo **momento** coincide con el hueco (comida, cena o ambos).
- [ ] (Opcional MVP) Puedo filtrar platos por una o más etiquetas al asignar un hueco.

### Módulo 4 — Lista de la compra

Generación automática desde el plan de la semana activa.

**Criterios de aceptación:**

- [ ] Al generar la lista, aparecen todos los productos de los platos planificados.
- [ ] Si el mismo producto aparece en varios platos, aparece **una sola vez** en la lista (sin cantidades).
- [ ] Puedo regenerar la lista si cambio el plan semanal.

## Flujos de usuario

### Flujo A — Configurar un plato nuevo

1. Ir a **Platos** → **Nuevo plato**.
2. Introducir nombre, **momento** (comida, cena o ambos), crear o seleccionar **etiquetas** (con color).
3. Añadir productos del catálogo (sin cantidades).
4. Guardar.

### Flujo B — Planificar la semana

1. Ir a **Semana**.
2. Para cada día, elegir plato de **Comida** y plato de **Cena**.
3. Los cambios se guardan automáticamente en local.

### Flujo C — Hacer la compra

1. Ir a **Lista de la compra** → **Generar** (o actualizar).
2. Revisar la lista de productos únicos.
3. (Futuro) Marcar como comprado mientras recorres el supermercado.

## Decisiones de producto (cerradas)

| Tema | Decisión |
|------|----------|
| Huecos por día | Un plato por comida + uno por cena |
| Cantidades | Solo nombres de producto; sin cantidades en el MVP |
| Momento del plato | Comida / cena / ambos; filtro en el planificador |
| Etiquetas | CRUD en edición del plato; nombre + color; filtro opcional en planificador |
| Inicio de semana | Lunes |
| Semanas múltiples | Solo semana actual en el MVP (*pendiente confirmar si quieres elegir otra semana más adelante*) |

## Notas

- La tabla `items` actual en Dexie es solo de prueba; el esquema de dominio se definirá en [arquitectura.md](../arquitectura/arquitectura.md) (versión 2).
- Pantallas previstas: Productos, Platos (detalle con ingredientes), Semana, Lista de la compra.
