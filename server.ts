/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory state fallback for Demo/Local mode if Supabase keys are absent or invalid
let localMembros = [
  {
    id: 'm1',
    nome: 'Carlos Souza',
    grupo: 'Grupo 2',
    categoria: 'Pioneiro Regular',
    ativo: true
  },
  {
    id: 'm2',
    nome: 'Ana Santos',
    grupo: 'Grupo 2',
    categoria: 'Pioneiro Regular',
    ativo: true
  },
  {
    id: 'm3',
    nome: 'Lucas Oliveira',
    grupo: 'Grupo 2',
    categoria: 'Publicador',
    ativo: true
  },
  {
    id: 'm4',
    nome: 'Fernanda Lima',
    grupo: 'Grupo 2',
    categoria: 'Pioneiro Auxiliar',
    ativo: true
  },
  {
    id: 'm5',
    nome: 'Marcos Silva',
    grupo: 'Grupo 2',
    categoria: 'Publicador',
    ativo: true
  },
  {
    id: 'm6',
    nome: 'Juliana Costa',
    grupo: 'Grupo 2',
    categoria: 'Publicador',
    ativo: true
  },
  {
    id: 'm7',
    nome: 'Roberto Teixeira',
    grupo: 'Grupo 2',
    categoria: 'Publicador',
    ativo: true
  },
  {
    id: 'm8',
    nome: 'Estevão Pereira',
    grupo: 'Grupo 2',
    categoria: 'Pioneiro Regular',
    ativo: true
  },
  {
    id: 'm9',
    nome: 'Pedro Santos',
    grupo: 'Grupo 2',
    categoria: 'Publicador',
    ativo: true
  },
  {
    id: 'm10',
    nome: 'Marta Ferreira',
    grupo: 'Grupo 2',
    categoria: 'Publicador',
    ativo: false
  }
];

let localRelatorios = [
  {
    id: 'r1_m1',
    mesAno: '2026-05',
    membroId: 'm1',
    nomeIrmao: 'Carlos Souza',
    categoria: 'Pioneiro Regular',
    participouMinisterio: true,
    quantidadeEstudos: 3,
    horas: 52,
    observacoes: 'Muito encorajador este mês de campanha.',
    dataRegistro: '2026-05-30T18:30:00Z'
  },
  {
    id: 'r1_m2',
    mesAno: '2026-05',
    membroId: 'm2',
    nomeIrmao: 'Ana Santos',
    categoria: 'Pioneiro Regular',
    participouMinisterio: true,
    quantidadeEstudos: 4,
    horas: 50,
    observacoes: 'Consegui iniciar um novo estudo na semana passada.',
    dataRegistro: '2026-05-30T19:00:00Z'
  },
  {
    id: 'r1_m3',
    mesAno: '2026-05',
    membroId: 'm3',
    nomeIrmao: 'Lucas Oliveira',
    categoria: 'Publicador',
    participouMinisterio: true,
    quantidadeEstudos: 1,
    horas: '',
    observacoes: 'Participação regular.',
    dataRegistro: '2026-05-31T10:00:00Z'
  },
  {
    id: 'r1_m4',
    mesAno: '2026-05',
    membroId: 'm4',
    nomeIrmao: 'Fernanda Lima',
    categoria: 'Pioneiro Auxiliar',
    participouMinisterio: true,
    quantidadeEstudos: 2,
    horas: 32,
    observacoes: 'Amei os finais de semana estendidos.',
    dataRegistro: '2026-05-31T12:30:00Z'
  },
  {
    id: 'r1_m5',
    mesAno: '2026-05',
    membroId: 'm5',
    nomeIrmao: 'Marcos Silva',
    categoria: 'Publicador',
    participouMinisterio: true,
    quantidadeEstudos: 0,
    horas: '',
    observacoes: '',
    dataRegistro: '2026-05-31T14:45:00Z'
  },
  {
    id: 'r1_m6',
    mesAno: '2026-05',
    membroId: 'm6',
    nomeIrmao: 'Juliana Costa',
    categoria: 'Publicador',
    participouMinisterio: false,
    quantidadeEstudos: 0,
    horas: '',
    observacoes: 'Estava viajando e doente.',
    dataRegistro: '2026-06-01T08:00:00Z'
  },
  {
    id: 'r1_m8',
    mesAno: '2026-05',
    membroId: 'm8',
    nomeIrmao: 'Estevão Pereira',
    categoria: 'Pioneiro Regular',
    participouMinisterio: true,
    quantidadeEstudos: 5,
    horas: 55,
    observacoes: 'Vários estudantes com boa dedicação.',
    dataRegistro: '2026-05-31T15:20:00Z'
  },
  {
    id: 'r2_m1',
    mesAno: '2026-06',
    membroId: 'm1',
    nomeIrmao: 'Carlos Souza',
    categoria: 'Pioneiro Regular',
    participouMinisterio: true,
    quantidadeEstudos: 4,
    horas: 54,
    observacoes: 'Estudos progredindo bem.',
    dataRegistro: '2026-06-05T20:15:00Z'
  },
  {
    id: 'r2_m4',
    mesAno: '2026-06',
    membroId: 'm4',
    nomeIrmao: 'Fernanda Lima',
    categoria: 'Pioneiro Auxiliar',
    participouMinisterio: true,
    quantidadeEstudos: 2,
    horas: 30,
    observacoes: 'Muito grata pelo privilégio.',
    dataRegistro: '2026-06-05T22:30:00Z'
  },
  {
    id: 'r2_m5',
    mesAno: '2026-06',
    membroId: 'm5',
    nomeIrmao: 'Marcos Silva',
    categoria: 'Publicador',
    participouMinisterio: true,
    quantidadeEstudos: 1,
    horas: '',
    observacoes: 'Teve revisitas interessantes.',
    dataRegistro: '2026-06-05T23:50:00Z'
  }
];

// Lazy-loaded Supabase Client
let _supabase: any = null;
function getSupabaseClient() {
  if (_supabase) return _supabase;

  let url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key || url.startsWith('http://your-supabase-project') || url === '') {
    return null;
  }

  // Clean trailing rest/v1 or rest/v1/ patterns to avoid Supabase driver path resolution issues
  if (url.includes('/rest/v1')) {
    url = url.split('/rest/v1')[0];
  }
  
  try {
    _supabase = createClient(url, key);
    return _supabase;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Check configuration status
app.get('/api/config', async (req, res) => {
  const supabase = getSupabaseClient();
  const isConfigured = supabase !== null;
  let hasTables = false;
  let connectionError: any = null;

  if (isConfigured) {
    try {
      // Test querying both tables with limit(1)
      const { error: errorMembros } = await supabase.from('membros').select('id').limit(1);
      const { error: errorRelatorios } = await supabase.from('relatorios').select('id').limit(1);
      
      if (!errorMembros && !errorRelatorios) {
        hasTables = true;
      } else {
        const err = errorMembros || errorRelatorios;
        connectionError = {
          message: err?.message || 'Erro ao consultar tabelas',
          code: err?.code,
          details: err?.details,
          hint: err?.hint
        };
        console.error('Supabase initialization test error:', connectionError);
      }
    } catch (err: any) {
      connectionError = {
        message: err?.message || 'Erro de exceção na conexão Supabase'
      };
      console.error('Supabase exception during initialization test:', err);
    }
  }

  res.json({
    supabaseConfigured: isConfigured,
    supabaseUrl: process.env.SUPABASE_URL || null,
    hasTables,
    connectionError
  });
});

// MEMBERS CONTROLLERS
app.get('/api/membros', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    // Return Local mock database
    return res.json(localMembros);
  }

  try {
    const { data, error } = await supabase
      .from('membros')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error('Supabase fetch error for membros. Falling back to local data.', error);
    res.json(localMembros);
  }
});

app.post('/api/membros', async (req, res) => {
  const { id, nome, grupo, categoria, ativo } = req.body;
  const newMember = { id, nome, grupo, categoria, ativo };

  const supabase = getSupabaseClient();
  if (!supabase) {
    localMembros.push(newMember);
    return res.json(newMember);
  }

  try {
    const { data, error } = await supabase
      .from('membros')
      .insert([newMember])
      .select();

    if (error) throw error;
    res.json(data[0] || newMember);
  } catch (error: any) {
    console.error('Supabase write error for membro:', error);
    // fallback
    localMembros.push(newMember);
    res.json(newMember);
  }
});

app.put('/api/membros', async (req, res) => {
  const { id, nome, grupo, categoria, ativo } = req.body;
  const updatedMember = { id, nome, grupo, categoria, ativo };

  const supabase = getSupabaseClient();
  if (!supabase) {
    localMembros = localMembros.map(m => m.id === id ? updatedMember : m);
    return res.json(updatedMember);
  }

  try {
    const { data, error } = await supabase
      .from('membros')
      .update({ nome, grupo, categoria, ativo })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0] || updatedMember);
  } catch (error: any) {
    console.error('Supabase update error for membro:', error);
    localMembros = localMembros.map(m => m.id === id ? updatedMember : m);
    res.json(updatedMember);
  }
});

app.delete('/api/membros/:id', async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabaseClient();
  if (!supabase) {
    localMembros = localMembros.filter(m => m.id !== id);
    return res.json({ success: true });
  }

  try {
    const { error } = await supabase
      .from('membros')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    console.error('Supabase delete error for membro:', error);
    localMembros = localMembros.filter(m => m.id !== id);
    res.json({ success: true });
  }
});

// REPORTS CONTROLLERS
app.get('/api/relatorios', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.json(localRelatorios);
  }

  try {
    // Select all. We perform manual JS sorting at the end to avoid column-case sensitivity order issues on Postgres.
    const { data, error } = await supabase
      .from('relatorios')
      .select('*');

    if (error) throw error;

    // Normalizing keys casing if stored in flat camelCase or snake_case
    const normalized = data.map((r: any) => ({
      id: r.id,
      mesAno: r.mes_ano || r.mesano || r.mesAno || '',
      membroId: r.membro_id || r.membroid || r.membroId || '',
      nomeIrmao: r.nome_irmao || r.nomeirmao || r.nomeIrmao || '',
      categoria: r.categoria,
      participouMinisterio: r.participou_ministerio !== undefined ? r.participou_ministerio : (r.participouministerio !== undefined ? r.participouministerio : (r.participouMinisterio !== undefined ? r.participouMinisterio : true)),
      quantidadeEstudos: r.quantidade_estudos !== undefined ? r.quantidade_estudos : (r.quantidadeestudos !== undefined ? r.quantidadeestudos : (r.quantidadeEstudos !== undefined ? r.quantidadeEstudos : 0)),
      horas: r.horas,
      observacoes: r.observacoes,
      dataRegistro: r.data_registro || r.dataregistro || r.dataRegistro || ''
    }));

    // Manual client-side descending order by dataRegistro
    normalized.sort((a, b) => {
      const dateA = a.dataRegistro || '';
      const dateB = b.dataRegistro || '';
      return dateB.localeCompare(dateA);
    });

    res.json(normalized);
  } catch (error: any) {
    console.error('Supabase fetch error for relatorios. Falling back to local data.', error);
    res.json(localRelatorios);
  }
});

app.post('/api/relatorios', async (req, res) => {
  const report = req.body;
  
  // Construct a payload containing exclusively lowercase and snake_case properties
  // to avoid standard unquoted-Postgres column folding mismatch errors entirely!
  const dbPayload: any = {
    id: report.id,
    categoria: report.categoria,
    horas: report.horas === '' ? null : report.horas,
    observacoes: report.observacoes
  };

  // Populate safe flat options based on standard conventions (snake_case / lowercase)
  dbPayload.mes_ano = report.mesAno;
  dbPayload.mesano = report.mesAno;
  dbPayload.membro_id = report.membroId;
  dbPayload.membroid = report.membroId;
  dbPayload.nome_irmao = report.nomeIrmao;
  dbPayload.nomeirmao = report.nomeIrmao;
  dbPayload.participou_ministerio = report.participouMinisterio;
  dbPayload.participouministerio = report.participouMinisterio;
  dbPayload.quantidade_estudos = report.quantidadeEstudos;
  dbPayload.quantidadeestudos = report.quantidadeEstudos;
  dbPayload.data_registro = report.dataRegistro;
  dbPayload.dataregistro = report.dataRegistro;

  const supabase = getSupabaseClient();
  if (!supabase) {
    localRelatorios.push(report);
    return res.json(report);
  }

  try {
    const { error } = await supabase
      .from('relatorios')
      .insert([dbPayload]);

    if (error) throw error;
    res.json(report);
  } catch (error: any) {
    console.error('Supabase write error for relatorio:', error);
    localRelatorios.push(report);
    res.json(report);
  }
});

app.put('/api/relatorios', async (req, res) => {
  const report = req.body;

  // Construct a payload containing exclusively lowercase and snake_case properties
  // to avoid standard unquoted-Postgres column folding mismatch errors entirely!
  const dbPayload: any = {
    categoria: report.categoria,
    horas: report.horas === '' ? null : report.horas,
    observacoes: report.observacoes
  };

  // Populate safe flat options based on standard conventions (snake_case / lowercase)
  dbPayload.mes_ano = report.mesAno;
  dbPayload.mesano = report.mesAno;
  dbPayload.membro_id = report.membroId;
  dbPayload.membroid = report.membroId;
  dbPayload.nome_irmao = report.nomeIrmao;
  dbPayload.nomeirmao = report.nomeIrmao;
  dbPayload.participou_ministerio = report.participouMinisterio;
  dbPayload.participouministerio = report.participouMinisterio;
  dbPayload.quantidade_estudos = report.quantidadeEstudos;
  dbPayload.quantidadeestudos = report.quantidadeEstudos;
  dbPayload.data_registro = report.dataRegistro;
  dbPayload.dataregistro = report.dataRegistro;

  const supabase = getSupabaseClient();
  if (!supabase) {
    localRelatorios = localRelatorios.map(r => r.id === report.id ? report : r);
    return res.json(report);
  }

  try {
    const { error } = await supabase
      .from('relatorios')
      .update(dbPayload)
      .eq('id', report.id);

    if (error) throw error;
    res.json(report);
  } catch (error: any) {
    console.error('Supabase update error for relatorio:', error);
    localRelatorios = localRelatorios.map(r => r.id === report.id ? report : r);
    res.json(report);
  }
});

app.delete('/api/relatorios/:id', async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabaseClient();
  if (!supabase) {
    localRelatorios = localRelatorios.filter(r => r.id !== id);
    return res.json({ success: true });
  }

  try {
    const { error } = await supabase
      .from('relatorios')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    console.error('Supabase delete error for relatorio:', error);
    localRelatorios = localRelatorios.filter(r => r.id !== id);
    res.json({ success: true });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
