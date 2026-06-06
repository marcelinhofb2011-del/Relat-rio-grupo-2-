/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Membro, Relatorio, CategoriaMembro } from '../types';
import { Trash2, Edit2, Calendar, BookOpen, Clock, AlertTriangle, MessageSquare, Search, FileDown, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface RelatoriosTabelaProps {
  membros: Membro[];
  relatorios: Relatorio[];
  onEditRelatorio: (membroId: string) => void;
  onDeleteRelatorio: (relatorioId: string) => void;
  selectedMesAno: string;
  onExportCSV: () => void;
  onPrintReport: () => void;
}

export default function RelatoriosTabela({
  membros,
  relatorios,
  onEditRelatorio,
  onDeleteRelatorio,
  selectedMesAno,
  onExportCSV,
  onPrintReport
}: RelatoriosTabelaProps) {
  // Filters inside reports table
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState<string>('TODAS');

  // Filter reports only for the selected month to run analysis
  const relatoriosDoMes = relatorios.filter(r => r.mesAno === selectedMesAno);

  // 1. Calculations as requested:
  // - Quantidade de publicadores que participaram (categoria: Publicador && participouMinisterio === true)
  const publicadoresParticipantes = relatoriosDoMes.filter(
    r => r.categoria === CategoriaMembro.PUBLICADOR && r.participouMinisterio
  ).length;

  // - Total de estudos
  const totalEstudos = relatoriosDoMes.reduce((acc, r) => acc + (r.quantidadeEstudos || 0), 0);

  // - Total de horas dos pioneiros regulares
  const totalHorasRegulares = relatoriosDoMes
    .filter(r => r.categoria === CategoriaMembro.PIONEIRO_REGULAR)
    .reduce((acc, r) => acc + Number(r.horas || 0), 0);

  // - Total de horas dos pioneiros auxiliares
  const totalHorasAuxiliares = relatoriosDoMes
    .filter(r => r.categoria === CategoriaMembro.PIONEIRO_AUXILIAR)
    .reduce((acc, r) => acc + Number(r.horas || 0), 0);

  // List of active brothers who haven't reported yet for this month
  const irmaosPendentes = membros
    .filter(m => m.ativo)
    .filter(m => !relatoriosDoMes.some(r => r.membroId === m.id));

  // Filter actual visual logs based on Search & Category inside the table
  const filteredReports = relatoriosDoMes.filter(r => {
    const matchesName = r.nomeIrmao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = catFilter === 'TODAS' || r.categoria === catFilter;
    return matchesName && matchesCategory;
  });

  return (
    <div className="space-y-6" id="relatorios-tabela-section">
      {/* 1. AGGREGATES AND MONTHLY ANALYSIS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Resumo dos Relatórios ({selectedMesAno.split('-').reverse().join('/')})
          </h3>
          {/* Quick PDF/Excel download actions */}
          <div className="flex gap-2">
            <button
              onClick={onPrintReport}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
              id="btn-print"
            >
              <Calendar size={13} />
              Visualizar PDF / Imprimir
            </button>
            <button
              onClick={onExportCSV}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-100"
              id="btn-export-csv"
            >
              <FileDown size={13} />
              Exportar Excel (CSV)
            </button>
          </div>
        </div>

        {/* Dynamic Aggregated Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" id="analysis-grid">
          {/* Publicadores que Participaram */}
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-blue-500 uppercase tracking-wider">Publicadores Ativos</span>
              <span className="text-xl font-extrabold text-blue-950 font-sans">{publicadoresParticipantes}</span>
              <span className="block text-[10px] text-blue-500">participaram do ministério</span>
            </div>
          </div>

          {/* Total Estudos */}
          <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 text-teal-700 rounded-xl">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-teal-500 uppercase tracking-wider">Total Estudos</span>
              <span className="text-xl font-extrabold text-teal-950 font-sans">{totalEstudos}</span>
              <span className="block text-[10px] text-teal-500">estudos na média</span>
            </div>
          </div>

          {/* Horas Regulares */}
          <div className="bg-violet-50/50 border border-violet-100 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 text-violet-700 rounded-xl">
              <Clock size={18} />
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-violet-500 uppercase tracking-wider">Pion. Regulares</span>
              <span className="text-xl font-extrabold text-violet-950 font-sans">{totalHorasRegulares}h</span>
              <span className="block text-[10px] text-violet-500">total de horas</span>
            </div>
          </div>

          {/* Horas Auxiliares */}
          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <Clock size={18} />
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Pion. Auxiliares</span>
              <span className="text-xl font-extrabold text-amber-950 font-sans">{totalHorasAuxiliares}h</span>
              <span className="block text-[10px] text-amber-500">total de horas</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BROTHERS WHO HAVE NOT CONCLUDED YET */}
      {irmaosPendentes.length > 0 && (
        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-3 justify-between" id="alert-pendentes-box">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-600 flex-shrink-0" size={18} />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Irmãos Pendentes ({irmaosPendentes.length})</h4>
              <p className="text-[11px] text-slate-500">Membros ativos do Grupo 2 que ainda não entregaram o relatório deste mês.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 w-full md:w-auto max-w-lg">
            {irmaosPendentes.map((m, idx) => (
              <span
                key={m.id}
                onClick={() => onEditRelatorio(m.id)}
                className="text-[10px] bg-white hover:bg-amber-50 cursor-pointer border border-slate-200 text-slate-600 font-semibold px-2 py-0.5 rounded-md transition-colors"
                title="Lançar relatório para este irmão"
              >
                {m.nome}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAIN REPORTS TABLE & DETAIL LIST */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden" id="historico-relatorios-card">
        {/* Header toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">Relatórios Recebidos</h3>
            <p className="text-xs text-slate-400">Gerenciamento e histórico detalhado das atividades mensais</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar irmão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-500 transition-all w-44"
                id="tabela-search-input"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer"
              id="tabela-category-select"
            >
              <option value="TODAS">Categorias: Todas</option>
              <option value={CategoriaMembro.PUBLICADOR}>Publicador</option>
              <option value={CategoriaMembro.PIONEIRO_REGULAR}>Pioneiro Regular</option>
              <option value={CategoriaMembro.PIONEIRO_AUXILIAR}>Pioneiro Auxiliar</option>
            </select>
          </div>
        </div>

        {/* Data Container */}
        <div className="overflow-x-auto" id="tabela-viewport">
          {filteredReports.length === 0 ? (
            <div className="text-center py-16 px-4">
              <span className="text-2xl">📋</span>
              <h4 className="text-slate-500 text-sm font-semibold mt-2">Sem registros compatíveis</h4>
              <p className="text-slate-400 text-xs mt-1">
                Nenhum relatório foi enviado para esta busca ou mês selecionado ainda.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse" id="relatorios-data-table">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Nome do Irmão</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4 text-center">Participou?</th>
                  <th className="py-3.5 px-4 text-center">Bíblias / Estudos</th>
                  <th className="py-3.5 px-4 text-center">Horas</th>
                  <th className="py-3.5 px-4">Observações</th>
                  <th className="py-3.5 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
                {filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors" id={`relatorio-tr-${r.id}`}>
                    <td className="py-3.5 px-6 font-bold text-slate-800">
                      {r.nomeIrmao}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {r.categoria === CategoriaMembro.PUBLICADOR ? (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded border border-blue-100/55">
                          Publicador
                        </span>
                      ) : r.categoria === CategoriaMembro.PIONEIRO_REGULAR ? (
                        <span className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] rounded border border-violet-100/55 font-bold">
                          Pioneiro Regular
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] rounded border border-amber-100/55 font-bold">
                          Pioneiro Auxiliar
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {r.categoria === CategoriaMembro.PUBLICADOR ? (
                        r.participouMinisterio ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded font-semibold">Sim</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] rounded font-semibold">Não</span>
                        )
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {r.quantidadeEstudos > 0 ? (
                        <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                          <BookOpen size={11} />
                          {r.quantidadeEstudos}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {r.horas !== '' ? (
                        <span className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 px-2 py-0.5 rounded">
                          <Clock size={11} />
                          {r.horas}h
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate" title={r.observacoes}>
                      {r.observacoes ? (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <MessageSquare size={11} className="text-slate-300" />
                          {r.observacoes}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">Nenhuma</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => onEditRelatorio(r.membroId)}
                          className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                          title="Editar Relatório"
                          id={`btn-edit-rel-${r.id}`}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteRelatorio(r.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Excluir Relatório"
                          id={`btn-del-rel-${r.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
