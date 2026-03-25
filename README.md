# Arachiz — Sistema de Registro de Asistencia

Aplicación web fullstack para gestión de asistencia institucional SENA.

- **Frontend:** React + Vite (puerto 5173)
- **Backend:** Node.js + Express (puerto 3000)
- **Base de datos:** PostgreSQL

---

## Requisitos previos

Tener instalado en tu máquina:

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/download/) v14 o superior
- npm (viene con Node.js)

---

## 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd arachiz
```

---

## 2. Configurar la base de datos

1. Abre pgAdmin o la terminal de PostgreSQL y crea la base de datos:

```sql
CREATE DATABASE arachiz;
```

2. Conéctate a ella y crea las tablas necesarias (ejecuta tu script SQL si tienes uno, o créalas manualmente según el modelo de datos del proyecto).

---

## 3. Configurar variables de entorno del servidor

Dentro de la carpeta `servidor/`, crea un archivo llamado `.env`:

```
servidor/.env
```

Con el siguiente contenido (ajusta los valores a tu configuración local):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=arachiz
```

> El archivo `.env` nunca se sube al repositorio. Cada desarrollador debe crearlo localmente.

---

## 4. Instalar dependencias del servidor

```bash
cd servidor
npm install
```

---

## 5. Ejecutar el servidor

Para desarrollo (con recarga automática):

```bash
npm run dev
```

Para producción:

```bash
npm start
```

Si todo está bien verás en consola:

```
🚀 Servidor corriendo en http://localhost:3000
```

Puedes verificarlo abriendo `http://localhost:3000` en el navegador. Debe responder con un JSON de confirmación.

---

## 6. Instalar dependencias del cliente

Abre una **nueva terminal** (deja el servidor corriendo) y ejecuta:

```bash
cd cliente
npm install
```

---

## 7. Ejecutar el cliente

```bash
npm run dev
```

Vite levantará el frontend en:

```
http://localhost:5173
```

---

## Resumen de comandos

| Qué hacer | Carpeta | Comando |
|---|---|---|
| Instalar backend | `servidor/` | `npm install` |
| Correr backend | `servidor/` | `npm run dev` |
| Instalar frontend | `cliente/` | `npm install` |
| Correr frontend | `cliente/` | `npm run dev` |

---

## Estructura del proyecto

```
arachiz/
├── cliente/        → Frontend React + Vite
├── servidor/       → Backend Node.js + Express + PostgreSQL
├── documentacion/  → Documentos del proyecto
└── README.md
```
