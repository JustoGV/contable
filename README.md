# � Sistema de Gestión de Recibos de Sueldo con Firma Electrónica

Sistema completo para estudios contables que permite **enviar y firmar recibos de sueldo digitalmente con validez legal**. Desarrollado con Next.js 14 y TypeScript.

> 🎯 **Demo Hardcodeada**: Actualmente todo el sistema funciona con datos hardcodeados para facilitar la demostración. No requiere base de datos para funcionar.

## ✨ Características Principales

### Para el Estudio Contable (Admin)
- 📤 **Carga masiva de PDFs** - Sube múltiples recibos en un solo paso
- 👥 **Gestión de empleados** - Asigna automáticamente recibos a cada empleado
- 📧 **Envío automático** - Notifica a todos los empleados con un click
- 📊 **Dashboard completo** - Visualiza estadísticas y estado de firmas
- 📁 **Organización automática** - Archivos guardados por período (mes/año)

### Para los Empleados
- 🔐 **Login seguro** - Usuario y contraseña personal
- 📨 **Notificaciones por email** - Aviso inmediato de nuevos recibos
- ✍️ **Firma electrónica simple** - Un click para firmar
- 📜 **Historial completo** - Acceso a todos los recibos anteriores
- 💾 **Descarga de PDFs** - Guarda tus recibos localmente

### Validez Legal
- ⚖️ **Trazabilidad completa** - Se registra fecha, hora, IP, navegador
- 🔒 **Hash del documento** - Verificación criptográfica de integridad
- 📝 **Evidencia digital** - Respaldo legal para auditorías

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL (con node-postgres/pg)
- **Autenticación**: NextAuth.js v5
- **Estilos**: Tailwind CSS
- **Email**: Nodemailer
- **UI**: Componentes custom con Lucide Icons

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- Git

### Paso 1: Instalar dependencias

```bash
npm install
```

### Paso 2: Configurar variables de entorno

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/contable?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-con-openssl-rand-base64-32"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-password-de-aplicacion"
SMTP_FROM="Sistema de Recibos <noreply@tuempresa.com>"
```

### Paso 3: Configurar la base de datos

```bash
# Crear la base de datos (si no existe)
createdb contable

# Crear las tablas
npm run db:init

# Cargar datos de ejemplo (opcional pero recomendado)
npm run db:seed
```

### Paso 4: Iniciar el servidor

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👤 Credenciales de Acceso (Datos de Ejemplo)

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`

### Empleados (password: `empleado123`)
- `jperez` - Juan Pérez
- `mgarcia` - María García
- `clopez` - Carlos López
- `amartinez` - Ana Martínez
- `prodriguez` - Pedro Rodríguez

## 📖 Guía de Uso

### Para Administradores

**Subir Recibos (4 Clicks)**

1. Inicia sesión como admin
2. Click en "Subir Recibos"
3. Selecciona período y archivos PDF
4. Verifica asignación de empleados
5. Click en "Subir" y luego "Enviar todos"

### Para Empleados

1. Recibe email con notificación
2. Click en el link o inicia sesión
3. Revisa el PDF
4. Click en "Firmar Recibo Electrónicamente"
5. Confirma - ¡Listo!

## 📂 Estructura del Proyecto

```
contable/
├── app/
│   ├── api/                     # API Routes
│   │   ├── auth/                # NextAuth
│   │   └── receipts/            # Endpoints de recibos
│   ├── admin/                   # Panel administrador
│   ├── employee/                # Portal empleados
│   └── login/                   # Login
├── components/                  # Componentes React
│   ├── ui/                      # Componentes base
│   ├── admin/                   # Admin components
│   └── employee/                # Employee components
├── lib/                         # Utilidades
│   ├── db.ts                    # Conexión PostgreSQL
│   └── auth.ts                  # Utilidades auth
├── database/                    # Base de datos
│   ├── init.sql                 # Schema SQL
│   └── seed.ts                  # Datos de ejemplo
└── public/uploads/              # PDFs almacenados
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sesiones JWT con NextAuth
- ✅ Rutas protegidas por middleware
- ✅ Hash SHA-256 de documentos
- ✅ Trazabilidad completa de firmas

## 📧 Configuración de Email (Gmail)

1. Activa verificación en 2 pasos
2. Genera contraseña de aplicación en Google Account
3. Usa esa contraseña en `SMTP_PASSWORD`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Iniciar producción
npm run lint         # Linter
npm run db:init      # Crear tablas en la BD
npm run db:seed      # Cargar datos de ejemplo
```

## 🚀 Deploy en Producción

1. Conecta a Vercel
2. Configura variables de entorno
3. Conecta base de datos PostgreSQL
4. Deploy automático

## 📝 Modelo de Datos

- **companies**: Estudios contables
- **users**: Admin o Employee con credenciales
- **receipts**: PDFs con período y estado
- **signatures**: Firma electrónica con trazabilidad legal

Ver schema completo en `database/init.sql`

---

**Desarrollado con ❤️ para estudios contables modernos**
# contable
