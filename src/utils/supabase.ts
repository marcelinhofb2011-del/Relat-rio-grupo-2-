import { createClient } from '@supabase/supabase-js';
import { Membro, Relatorio, CategoriaMembro } from '../types';

// Read keys from environment or use the user's provided direct fallback credentials
const RAW_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://kptilycibgboqwpvokga.supabase.co';
const ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdGlseWNpYmdib3F3cHZva2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTI4OTMsImV4cCI6MjA5NjI4ODg5M30.bM-3ED5dDpuwDXSYOocqIZKX4-nMqeJp2RHXeZd_si0';

// Clean trailing rest/v1 paths if present in the URL
let cleanUrl = RAW_URL ? RAW_URL.trim() : '';
if (cleanUrl.includes('/rest/v1')) {
  cleanUrl = cleanUrl.split('/rest/v1')[0];
}

export const supabase = (cleanUrl && ANON_KEY) ? createClient(cleanUrl, ANON_KEY) : null;

console.log('Supabase Direct Client Initialized:', !!supabase, 'URL:', cleanUrl);

// Normalizes fetched reports from Supabase query to clean local camelCase Model type
export function normalizeRelatorio(r: any): Relatorio {
  return {
    id: r.id,
    mesAno: r.mes_ano || r.mesano || r.mesAno || '',
    membroId: r.membro_id || r.membroid || r.membroId || '',
    nomeIrmao: r.nome_irmao || r.nomeirmao || r.nomeIrmao || '',
    categoria: r.categoria,
    participouMinisterio: r.participou_ministerio !== undefined ? r.participou_ministerio : (r.participouministerio !== undefined ? r.participouministerio : (r.participouMinisterio !== undefined ? r.participouMinisterio : true)),
    quantidadeEstudos: r.quantidade_estudos !== undefined ? r.quantidade_estudos : (r.quantidadeestudos !== undefined ? r.quantidadeestudos : (r.quantidadeEstudos !== undefined ? r.quantidadeEstudos : 0)),
    horas: r.horas !== null && r.horas !== undefined ? r.horas : '',
    observacoes: r.observacoes || '',
    dataRegistro: r.data_registro || r.dataregistro || r.dataRegistro || ''
  };
}

// Normalizer safe payload package for inserting and updating
export function buildRelatorioPayload(report: Relatorio): any {
  return {
    id: report.id,
    categoria: report.categoria,
    horas: report.horas === '' ? null : report.horas,
    observacoes: report.observacoes || '',
    // Supplying snake_case, lowercase, and camelCase properties to survive any tables schema layout without issues
    mes_ano: report.mesAno,
    mesano: report.mesAno,
    mesAno: report.mesAno,
    membro_id: report.membroId,
    membroid: report.membroId,
    membroId: report.membroId,
    nome_irmao: report.nomeIrmao,
    nomeirmao: report.nomeIrmao,
    nomeIrmao: report.nomeIrmao,
    participou_ministerio: report.participouMinisterio,
    participouministerio: report.participouMinisterio,
    participouMinisterio: report.participouMinisterio,
    quantidade_estudos: report.quantidadeEstudos,
    quantidadeestudos: report.quantidadeEstudos,
    quantidadeEstudos: report.quantidadeEstudos,
    data_registro: report.dataRegistro,
    dataregistro: report.dataRegistro,
    dataRegistro: report.dataRegistro
  };
}

// MEMBER DATABASE ACTIONS
export async function getMembrosDirect(): Promise<Membro[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('membros')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data as Membro[];
  } catch (err) {
    console.error('Direct Supabase fetch failed for membros:', err);
    return null;
  }
}

export async function addMembroDirect(m: Membro): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('membros')
      .insert([m]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Direct Supabase insert failed for membro:', err);
    return false;
  }
}

export async function updateMembroDirect(m: Membro): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('membros')
      .update({
        nome: m.nome,
        grupo: m.grupo,
        categoria: m.categoria,
        ativo: m.ativo
      })
      .eq('id', m.id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Direct Supabase update failed for membro:', err);
    return false;
  }
}

export async function deleteMembroDirect(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('membros')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Direct Supabase delete failed for membro:', err);
    return false;
  }
}


// REPORT DATABASE ACTIONS
export async function getRelatoriosDirect(): Promise<Relatorio[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('relatorios')
      .select('*');

    if (error) throw error;
    
    const formatted = data.map(normalizeRelatorio);
    // Sort descending by dataRegistro
    formatted.sort((a, b) => {
      const dateA = a.dataRegistro || '';
      const dateB = b.dataRegistro || '';
      return dateB.localeCompare(dateA);
    });

    return formatted;
  } catch (err) {
    console.error('Direct Supabase fetch failed for relatorios:', err);
    return null;
  }
}

export async function addRelatorioDirect(r: Relatorio): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload = buildRelatorioPayload(r);
    const { error } = await supabase
      .from('relatorios')
      .insert([dbPayload]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Direct Supabase insert failed for relatorio:', err);
    return false;
  }
}

export async function updateRelatorioDirect(r: Relatorio): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload = buildRelatorioPayload(r);
    const { error } = await supabase
      .from('relatorios')
      .update(dbPayload)
      .eq('id', r.id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Direct Supabase update failed for relatorio:', err);
    return false;
  }
}

export async function deleteRelatorioDirect(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('relatorios')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Direct Supabase delete failed for relatorio:', err);
    return false;
  }
}
