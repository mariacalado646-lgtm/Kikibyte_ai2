-- Migration: Create mensagem_direta table for direct messaging between gestores and clientes
-- Run this against your PostgreSQL database

CREATE TABLE IF NOT EXISTS mensagem_direta (
    id_mensagem     SERIAL PRIMARY KEY,
    cliente_id      INTEGER NOT NULL REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    remetente_id    INTEGER NOT NULL REFERENCES utilizador(id_utilizador) ON DELETE CASCADE,
    mensagem        TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups by client
CREATE INDEX IF NOT EXISTS idx_mensagem_direta_cliente_id ON mensagem_direta(cliente_id);
