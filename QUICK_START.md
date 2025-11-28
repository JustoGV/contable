# 🚀 Inicio Rápido

## Configuración Inicial (Solo una vez)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env` y configura:
```bash
cp .env.example .env
```

Edita `.env` con tus datos:
- `DATABASE_URL`: Tu PostgreSQL connection string
- `NEXTAUTH_SECRET`: Genera con `openssl rand -base64 32`
- Configuración SMTP para emails

### 3. Crear la base de datos
```bash
# Si la base de datos no existe
createdb contable

# Crear las tablas
npm run db:init

# Cargar datos de ejemplo
npm run db:seed
```

## Iniciar el Servidor

```bash
npm run dev
```

Abre http://localhost:3000

## Credenciales de Prueba

### Admin
- Usuario: `admin`
- Password: `admin123`

### Empleados (password: `empleado123`)
- `jperez` - Juan Pérez
- `mgarcia` - María García
- `clopez` - Carlos López
- `amartinez` - Ana Martínez
- `prodriguez` - Pedro Rodríguez

## Flujo de Uso

### Como Admin:
1. Login con `admin` / `admin123`
2. Click en "Subir Recibos"
3. Selecciona período y PDFs
4. Asigna empleados
5. Sube y envía

### Como Empleado:
1. Recibe email con notificación
2. Click en el link del email
3. Revisa el PDF
4. Firma electrónicamente

## Scripts Útiles

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Iniciar en producción
npm run db:init      # Crear tablas
npm run db:seed      # Cargar datos de ejemplo
```

## Solución de Problemas

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Verifica `DATABASE_URL` en `.env`

### Error al enviar emails
- Configura variables SMTP en `.env`
- Para Gmail, usa contraseñas de aplicación

### Error al subir archivos
- Verifica permisos en carpeta `public/uploads/`

## Próximos Pasos

- [ ] Configura SMTP para producción
- [ ] Sube recibos reales
- [ ] Personaliza los emails
- [ ] Deploy a producción

---

**¿Problemas?** Revisa el README.md completo para más detalles.
