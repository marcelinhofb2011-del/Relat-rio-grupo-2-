-- SQL para criação das tabelas no seu projeto Supabase
-- Você pode copiar e colar esse script diretamente no SQL Editor do seu Supabase Dashboard.

-- 1. Criação da tabela de Membros do Grupo
CREATE TABLE IF NOT EXISTS membros (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    grupo TEXT DEFAULT 'Grupo 2',
    categoria TEXT NOT NULL, -- 'Publicador', 'Pioneiro Regular', 'Pioneiro Auxiliar'
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Criação da tabela de Relatórios Mensais
CREATE TABLE IF NOT EXISTS relatorios (
    id TEXT PRIMARY KEY,
    membro_id TEXT REFERENCES membros(id) ON DELETE CASCADE,
    membroId TEXT, -- campo redundante para garantir compatibilidade com camelCase do JS
    nome_irmao TEXT NOT NULL,
    nomeIrmao TEXT, -- campo redundante para garantir compatibilidade com camelCase do JS
    mes_ano TEXT NOT NULL, -- Exemplo: "2026-06"
    mesAno TEXT, -- campo redundante para garantir compatibilidade com camelCase do JS
    categoria TEXT NOT NULL,
    participou_ministerio BOOLEAN DEFAULT TRUE,
    participouMinisterio BOOLEAN DEFAULT TRUE, -- campo redundante para garantir compatibilidade com camelCase do JS
    quantidade_estudos INTEGER DEFAULT 0,
    quantidadeEstudos INTEGER DEFAULT 0, -- campo redundante para garantir compatibilidade com camelCase do JS
    horas INTEGER NULL, -- Nulo para publicadores normais
    observacoes TEXT,
    data_registro TEXT,
    dataRegistro TEXT, -- campo redundante para garantir compatibilidade com camelCase do JS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ativar segurança RLS (Row Level Security) ou manter aberto dependendo do seu uso.
-- Como sugestão inicial para projetos simples, você pode desativar as políticas restritivas nas tabelas:
ALTER TABLE membros DISABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios DISABLE ROW LEVEL SECURITY;

-- 3. Inserção de dados de demonstração (Opcional - remova se quiser iniciar limpo)
INSERT INTO membros (id, nome, grupo, categoria, ativo) VALUES
('m1', 'Carlos Souza', 'Grupo 2', 'Pioneiro Regular', true),
('m2', 'Ana Santos', 'Grupo 2', 'Pioneiro Regular', true),
('m3', 'Lucas Oliveira', 'Grupo 2', 'Publicador', true),
('m4', 'Fernanda Lima', 'Grupo 2', 'Pioneiro Auxiliar', true),
('m5', 'Marcos Silva', 'Grupo 2', 'Publicador', true),
('m6', 'Juliana Costa', 'Grupo 2', 'Publicador', true),
('m7', 'Roberto Teixeira', 'Grupo 2', 'Publicador', true),
('m8', 'Estevão Pereira', 'Grupo 2', 'Pioneiro Regular', true),
('m9', 'Pedro Santos', 'Grupo 2', 'Publicador', true),
('m10', 'Marta Ferreira', 'Grupo 2', 'Publicador', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO relatorios (
    id, membro_id, membroId, nome_irmao, nomeIrmao, mes_ano, mesAno, categoria, 
    participou_ministerio, participouMinisterio, quantidade_estudos, quantidadeEstudos, 
    horas, observacoes, data_registro, dataRegistro
) VALUES
('r2_m1', 'm1', 'm1', 'Carlos Souza', 'Carlos Souza', '2026-06', '2026-06', 'Pioneiro Regular', true, true, 4, 4, 54, 'Estudos progredindo bem.', '2026-06-05T20:15:00Z', '2026-06-05T20:15:00Z'),
('r2_m4', 'm4', 'm4', 'Fernanda Lima', 'Fernanda Lima', '2026-06', '2026-06', 'Pioneiro Auxiliar', true, true, 2, 2, 30, 'Muito grata pelo privilégio.', '2026-06-05T22:30:00Z', '2026-06-05T22:30:00Z'),
('r2_m5', 'm5', 'm5', 'Marcos Silva', 'Marcos Silva', '2026-06', '2026-06', 'Publicador', true, true, 1, 1, null, 'Teve revisitas interessantes.', '2026-06-05T23:50:00Z', '2026-06-05T23:50:00Z')
ON CONFLICT (id) DO NOTHING;
