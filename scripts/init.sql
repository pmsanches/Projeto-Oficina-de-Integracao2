-- =====================================================
-- ELLP - Sistema de Controle de Oficinas
-- Script de inicialização do banco de dados
-- Paolla
-- =====================================================

-- Tabela de usuários do sistema (gerentes)
-- Armazena as credenciais de acesso ao sistema
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de professores
-- Armazena os dados dos professores das oficinas
CREATE TABLE IF NOT EXISTS professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tutores
-- Armazena os dados dos tutores que auxiliam nas oficinas
CREATE TABLE IF NOT EXISTS tutores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de temas
-- Armazena os temas disponíveis para as oficinas
CREATE TABLE IF NOT EXISTS temas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    carga_horaria INTEGER NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de alunos
-- Armazena os dados dos alunos participantes
CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de oficinas
-- Armazena os dados das oficinas cadastradas
CREATE TABLE IF NOT EXISTS oficinas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    tema_id INTEGER REFERENCES temas(id) ON DELETE SET NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento oficinas-professores
-- Permite que uma oficina tenha vários professores
CREATE TABLE IF NOT EXISTS oficina_professores (
    id SERIAL PRIMARY KEY,
    oficina_id INTEGER REFERENCES oficinas(id) ON DELETE CASCADE,
    professor_id INTEGER REFERENCES professores(id) ON DELETE CASCADE,
    UNIQUE(oficina_id, professor_id)
);

-- Tabela de relacionamento oficinas-tutores
-- Permite que uma oficina tenha vários tutores
CREATE TABLE IF NOT EXISTS oficina_tutores (
    id SERIAL PRIMARY KEY,
    oficina_id INTEGER REFERENCES oficinas(id) ON DELETE CASCADE,
    tutor_id INTEGER REFERENCES tutores(id) ON DELETE CASCADE,
    UNIQUE(oficina_id, tutor_id)
);

-- Tabela de relacionamento oficinas-alunos
-- Permite que uma oficina tenha vários alunos
CREATE TABLE IF NOT EXISTS oficina_alunos (
    id SERIAL PRIMARY KEY,
    oficina_id INTEGER REFERENCES oficinas(id) ON DELETE CASCADE,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    UNIQUE(oficina_id, aluno_id)
);

-- Tabela de certificados
-- Armazena os certificados gerados para os alunos
CREATE TABLE IF NOT EXISTS certificados (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    oficina_id INTEGER REFERENCES oficinas(id) ON DELETE CASCADE,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(aluno_id, oficina_id)
);

-- Inserir usuário administrador padrão
-- Senha: admin123 (em produção, usar hash)
INSERT INTO usuarios (nome, email, senha) 
VALUES ('Administrador', 'admin@ellp.com', 'admin123')
ON CONFLICT (email) DO NOTHING;
