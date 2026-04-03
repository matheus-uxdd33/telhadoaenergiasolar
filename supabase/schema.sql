-- Schema inicial para Solar SaaS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de tenants (empresas revendedoras ou clientes enterprise)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  plan VARCHAR(50) DEFAULT 'basic',
  white_label BOOLEAN DEFAULT FALSE,
  logo_url TEXT,
  theme_color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, email)
);

-- Tabela de locais/instalações do cliente
CREATE TABLE customer_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  coordinates POINT,
  installed_power_kw DECIMAL(10, 2),
  distributor VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de marcas de inversores
CREATE TABLE inverter_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  website VARCHAR(255),
  support_email VARCHAR(255),
  api_provider VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de modelos de inversores
CREATE TABLE inverter_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES inverter_brands(id),
  name VARCHAR(100) NOT NULL,
  power_rating_kw DECIMAL(10, 2),
  connectivity_methods VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de conexões do provider
CREATE TABLE provider_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES customer_sites(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES inverter_brands(id),
  model_id UUID NOT NULL REFERENCES inverter_models(id),
  provider_username VARCHAR(255),
  provider_device_id VARCHAR(255),
  auth_method VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP,
  sync_error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de eventos de telemetria
CREATE TABLE telemetry_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES customer_sites(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES provider_connections(id) ON DELETE CASCADE,
  event_type VARCHAR(50),
  generation_kw DECIMAL(10, 3),
  efficiency_percent DECIMAL(5, 2),
  temperature_celsius DECIMAL(5, 2),
  status VARCHAR(50),
  raw_data JSONB,
  recorded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_telemetry_site_recorded ON telemetry_events(site_id, recorded_at);

-- Tabela de alertas
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES customer_sites(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  alert_type VARCHAR(50),
  severity VARCHAR(50),
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_site_severity ON alerts(site_id, severity);

-- Tabela de relatórios
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES customer_sites(id) ON DELETE CASCADE,
  report_type VARCHAR(50),
  period_start DATE,
  period_end DATE,
  generation_kwh DECIMAL(10, 2),
  expected_kwh DECIMAL(10, 2),
  efficiency_percent DECIMAL(5, 2),
  savings_estimated DECIMAL(10, 2),
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de assinaturas
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  monthly_price DECIMAL(10, 2),
  billing_date INT,
  next_billing_date DATE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de faturas
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50),
  issue_date DATE,
  due_date DATE,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de chamados de suporte
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  site_id UUID REFERENCES customer_sites(id),
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  priority VARCHAR(50),
  status VARCHAR(50) DEFAULT 'open',
  assigned_to UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de mensagens de chamado
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  message TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100),
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  changes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at);

-- Índices para performance
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_sites_tenant ON customer_sites(tenant_id);
CREATE INDEX idx_sites_user ON customer_sites(user_id);
CREATE INDEX idx_connections_site ON provider_connections(site_id);
CREATE INDEX idx_alerts_site ON alerts(site_id, created_at DESC);
CREATE INDEX idx_telemetry_site ON telemetry_events(site_id, recorded_at DESC);
CREATE INDEX idx_tickets_tenant ON support_tickets(tenant_id);

-- Criar função de timestmap de update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trigger_tenants_update BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_users_update BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_sites_update BEFORE UPDATE ON customer_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_connections_update BEFORE UPDATE ON provider_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_alerts_update BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_subscriptions_update BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_invoices_update BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_tickets_update BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
