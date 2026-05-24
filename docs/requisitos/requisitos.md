# Requisitos — Comi2

## Objetivo del producto

**Comi2** ayuda a **planificar las comidas de la semana** y a **generar la lista de la compra** a partir de los platos elegidos.

El usuario mantiene un catálogo de **platos** (cada uno con los **productos** necesarios para prepararlo), asigna platos a los huecos de **comida** y **cena** de la semana, y la aplicación consolida los productos en una **lista de la compra** lista para ir al supermercado.

## Usuarios

| Perfil | Descripción | Necesidades |
|--------|-------------|-------------|
| Usuario doméstico | Persona o familia que organiza el menú semanal | Definir platos y productos, ver la semana de un vistazo, no olvidar ingredientes al comprar |

**Supuesto inicial:** un único usuario por dispositivo/navegador (sin cuentas ni multi-usuario en el MVP).

## Requisitos funcionales (RF)

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-001 | Dar de alta, editar y eliminar **productos** (ingredientes base del catálogo) | Alta |
| RF-002 | Dar de alta, editar y eliminar **platos**, con **momento** del día: solo comida, solo cena o ambos | Alta |
| RF-003 | Asociar a cada plato los **productos** que necesita para su elaboración (solo nombre; sin cantidades en el MVP) | Alta |
| RF-009 | Gestionar **etiquetas** al **editar un plato** (crear, editar color/nombre, eliminar, asignar varias por plato); operaciones de creación y edición accesibles desde un **modal dedicado**; cada etiqueta tiene **color** visible en la UI | Alta |
| RF-004 | **Planificar la semana** (lunes a domingo): un plato por **comida** y uno por **cena** cada día (14 huecos) | Alta |
| RF-010 | **Vista resumen** de la semana: modal de solo lectura con los platos asignados a comida y cena de cada día | Media |
| RF-011 | Crear un **plato nuevo directamente desde un hueco** de la semana; al guardar el plato se asigna automáticamente y se regresa al planificador | Media |
| RF-005 | **Generar lista de la compra** a partir de los platos del plan semanal, listando cada producto una vez (sin sumar cantidades en el MVP) | Alta |
| RF-006 | Consultar y marcar ítems de la lista de la compra (comprado / pendiente) | Media |
| RF-007 | Duplicar o reutilizar el plan de una semana anterior | Baja (futuro) |
| RF-008 | Categorizar productos (verdura, lácteos, etc.) | Baja (futuro) |

## Requisitos no funcionales (RNF)

| ID | Descripción |
|----|-------------|
| RNF-001 | La aplicación debe funcionar sin conexión a servidor (datos en IndexedDB) |
| RNF-002 | Interfaz en **español** |
| RNF-003 | Los datos persisten en el navegador entre sesiones |
| RNF-004 | Tiempo de respuesta percibido instantáneo en operaciones CRUD locales |
| RNF-005 | Diseño usable en móvil y escritorio (responsive) |

## Restricciones y supuestos

- Aplicación web en navegador (React + Vite).
- Persistencia local mediante IndexedDB (Dexie).
- Sin backend ni sincronización entre dispositivos en la fase inicial.
- La lista de la compra se **deriva** del plan semanal; no es la fuente de verdad de los ingredientes.

## Glosario

| Término | Definición |
|---------|------------|
| **Producto** | Ingrediente o artículo de compra (ej. arroz, pollo, aceite) |
| **Plato** | Receta o comida preparada, compuesta por uno o más productos |
| **Momento del plato** | Si el plato es de comida, de cena o de ambos (regla del planificador semanal) |
| **Etiqueta** | Etiqueta libre con **nombre** y **color**; se crea y gestiona desde la edición del plato; un plato puede tener varias |
| **Comida** | Comida del mediodía (almuerzo) en el plan semanal |
| **Cena** | Comida de la noche en el plan semanal |
| **Plan semanal** | Conjunto de asignaciones plato ↔ día ↔ (comida \| cena) para una semana |
| **Lista de la compra** | Listado consolidado de productos necesarios según el plan activo |

## Decisiones de producto (cerradas)

| Tema | Decisión |
|------|----------|
| Huecos por día | Un plato por comida y uno por cena (14 huecos/semana) |
| Cantidades | Solo nombres de producto en la lista; sin cantidades ni unidades en el MVP |
| Momento del plato | Solo comida / solo cena / ambos; solo platos compatibles en cada hueco |
| Etiquetas por plato | Varias por plato; CRUD desde edición del plato; cada etiqueta con color (catálogo reutilizable) |
| Inicio de semana | Lunes |
