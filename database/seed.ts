import { Pool } from 'pg'
import { hashPassword } from '../lib/auth'
import * as dotenv from 'dotenv'

dotenv.config()

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function main() {
  console.log('🌱 Iniciando seed...')

  try {
    // Limpiar datos existentes (opcional)
    await db.query('DELETE FROM signatures')
    await db.query('DELETE FROM receipts')
    await db.query('DELETE FROM users')
    await db.query('DELETE FROM companies')

    // Crear empresa de ejemplo
    const companyResult = await db.query(`
      INSERT INTO companies (name, cuit, email, phone, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name
    `, [
      'Estudio Contable Demo',
      '20-12345678-9',
      'contacto@estudiodemo.com',
      '+54 11 1234-5678',
      'Av. Corrientes 1234, CABA'
    ])

    const company = companyResult.rows[0]
    console.log('✅ Empresa creada:', company.name)

    // Crear usuario administrador
    const adminPassword = await hashPassword('admin123')
    const adminResult = await db.query(`
      INSERT INTO users (email, username, password, name, role, company_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, username
    `, [
      'admin@estudiodemo.com',
      'admin',
      adminPassword,
      'Administrador del Estudio',
      'ADMIN',
      company.id
    ])

    const admin = adminResult.rows[0]
    console.log('✅ Admin creado - Usuario: admin, Password: admin123')

    // Crear empleados de ejemplo
    const employees = [
      {
        email: 'juan.perez@example.com',
        username: 'jperez',
        name: 'Juan Pérez'
      },
      {
        email: 'maria.garcia@example.com',
        username: 'mgarcia',
        name: 'María García'
      },
      {
        email: 'carlos.lopez@example.com',
        username: 'clopez',
        name: 'Carlos López'
      },
      {
        email: 'ana.martinez@example.com',
        username: 'amartinez',
        name: 'Ana Martínez'
      },
      {
        email: 'pedro.rodriguez@example.com',
        username: 'prodriguez',
        name: 'Pedro Rodríguez'
      }
    ]

    const employeePassword = await hashPassword('empleado123')

    for (const emp of employees) {
      const result = await db.query(`
        INSERT INTO users (email, username, password, name, role, company_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, username
      `, [
        emp.email,
        emp.username,
        employeePassword,
        emp.name,
        'EMPLOYEE',
        company.id
      ])
      
      const employee = result.rows[0]
      console.log('✅ Empleado creado:', employee.name, '- Usuario:', employee.username)
    }

    console.log('\n🎉 Seed completado exitosamente!')
    console.log('\n📋 Credenciales de acceso:')
    console.log('   Admin:')
    console.log('   - Usuario: admin')
    console.log('   - Password: admin123')
    console.log('\n   Empleados (todos con password: empleado123):')
    employees.forEach(emp => {
      console.log(`   - Usuario: ${emp.username} (${emp.name})`)
    })
    console.log('\n🚀 Puedes iniciar sesión en http://localhost:3000/login')
  } catch (error) {
    console.error('❌ Error en seed:', error)
    throw error
  }
}

main()
  .then(async () => {
    await db.end()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error('❌ Error fatal:', e)
    await db.end()
    process.exit(1)
  })
