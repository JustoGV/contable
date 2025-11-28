-- Crear las tablas para el sistema de recibos

-- Tabla de empresas/estudios contables
CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(255) NOT NULL,
  cuit VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipos enum
CREATE TYPE user_role AS ENUM ('ADMIN', 'EMPLOYEE');
CREATE TYPE receipt_status AS ENUM ('PENDING', 'SENT', 'SIGNED', 'EXPIRED');

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'EMPLOYEE',
  company_id VARCHAR(30) REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);

-- Tabla de recibos
CREATE TABLE IF NOT EXISTS receipts (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employee_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id VARCHAR(30) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  period VARCHAR(10) NOT NULL, -- Formato: 2024-11
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  status receipt_status DEFAULT 'PENDING',
  sent_at TIMESTAMP,
  uploaded_by_id VARCHAR(30) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_receipts_employee_id ON receipts(employee_id);
CREATE INDEX idx_receipts_company_id ON receipts(company_id);
CREATE INDEX idx_receipts_period ON receipts(period);
CREATE INDEX idx_receipts_status ON receipts(status);

-- Tabla de firmas electrónicas
CREATE TABLE IF NOT EXISTS signatures (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  receipt_id VARCHAR(30) UNIQUE NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(50) NOT NULL,
  user_agent TEXT NOT NULL,
  document_hash VARCHAR(64) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_signatures_receipt_id ON signatures(receipt_id);
CREATE INDEX idx_signatures_user_id ON signatures(user_id);
