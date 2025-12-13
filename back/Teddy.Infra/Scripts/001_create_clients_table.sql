-- =====================================================
-- Script: 001_create_clients_table.sql
-- Description: Create clients table with all required fields
-- Database: PostgreSQL
-- Date: 2024-12-12
-- =====================================================

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    salary NUMERIC(18,2) NOT NULL,
    company_value NUMERIC(18,2) NOT NULL,
    access_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    deleted_at TIMESTAMP WITHOUT TIME ZONE NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS ix_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS ix_clients_deleted_at ON clients(deleted_at);

-- Add comments
COMMENT ON TABLE clients IS 'Stores client information for Teddy application';
COMMENT ON COLUMN clients.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN clients.name IS 'Client name (minimum 3 characters)';
COMMENT ON COLUMN clients.salary IS 'Client salary';
COMMENT ON COLUMN clients.company_value IS 'Company valuation';
COMMENT ON COLUMN clients.access_count IS 'Number of times the client detail was accessed';
COMMENT ON COLUMN clients.created_at IS 'Record creation timestamp (UTC)';
COMMENT ON COLUMN clients.updated_at IS 'Last update timestamp (UTC)';
COMMENT ON COLUMN clients.deleted_at IS 'Soft delete timestamp (NULL = active)';
