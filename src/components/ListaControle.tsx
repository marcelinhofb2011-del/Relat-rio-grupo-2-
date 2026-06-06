/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Membro, Relatorio, CategoriaMembro } from '../types';
import { Search, Filter, Plus, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ListaControleProps {
  membros: Membro[];
  relatorios: Relatorio[];
  selectedMesAno: string;
  onSelectMembroParaRelatorio: (membroId: string) => void;
}

export default function ListaControle({
  membros,
  relatorios,
  selectedMesAno,
  onSelectMembroParaRelatorio
}: ListaControleProps) {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('TODAS');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS'); // TODOS, ENVIADO, PENDENTE

  // Get only active members for this checklist
  const membrosAtivos = membros.filter(m => m.ativo);

  // Map members to their report status for this selected month
  const checklist = membrosAtivos.map(membro => {
    const relatorio = relatorios.find(r => r.membroId === membro.id && r.mesAno === selectedMesAno);
    const enviado = !!relatorio;
    return {
      membro,
      enviado,
      relatorio
    };
  });

  // Filter the checklist based on search and selected settings
  const filteredChecklist = checklist.filter(item => {
    const matchesName = item.membro.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoriaFilter === 'TODAS' || item.membro.categoria === categoriaFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'ENVIADO') matchesStatus = item.enviado;
    else if (statusFilter === 'PENDENTE') matchesStatus = !item.enviado;

    return matchesName && matchesCategory && matchesStatus;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="lista-controle-container">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-50 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800" id="controle-visual-titulo">
            Controle de Envio
          </h3>
          <p className="text-xs text-slate-400">
            Acompanhamento para {selectedMesAno.split('-').reverse().join('/')}
          </p>
        </div>
        
        {/* Quick legend */}
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-center">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            Enviado ({checklist.filter(c => c.enviado).length})
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse inline-block"></span>
            Pendente ({checklist.filter(c => !c.enviado).length})
          </span>
        </div>
      </div>

      {/* Inputs and Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4" id="controle-filters-bar">
        {/* Search input */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-slate-50/20 transition-all"
            id="controle-search-input"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer"
            id="controle-categoria-filter"
          >
            <option value="TODAS">Categorias: Todas</option>
            <option value={CategoriaMembro.PUBLICADOR}>Publicador</option>
            <option value={CategoriaMembro.PIONEIRO_REGULAR}>Pioneiro Regular</option>
            <option value={CategoriaMembro.PIONEIRO_AUXILIAR}>Pioneiro Auxiliar</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer"
            id="controle-status-filter"
          >
            <option value="TODOS">Status: Todos</option>
            <option value="ENVIADO">🟢 Relatório Enviado</option>
            <option value="PENDENTE">🔴 Relatório Pendente</option>
          </select>
        </div>
      </div>

      {/* List wrapper */}
      <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 -mr-1 scrollbar-thin" id="controle-list-wrapper">
        {filteredChecklist.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-xl">🔍</span>
            <p className="text-slate-500 text-sm font-semibold mt-2">Nenhum irmão encontrado</p>
            <p className="text-slate-400 text-xs mt-1">Experimente limpar seus filtros ou alterar a busca.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredChecklist.map(({ membro, enviado, relatorio }) => (
              <div
                key={membro.id}
                onClick={() => onSelectMembroParaRelatorio(membro.id)}
                className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  enviado
                    ? 'bg-emerald-50/10 border-slate-100 hover:bg-emerald-50/20 hover:border-emerald-200'
                    : 'bg-white border-slate-100 hover:bg-rose-50/10 hover:border-rose-200 shadow-sm'
                }`}
                id={`controle-row-${membro.id}`}
              >
                {/* Left indicators & meta */}
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0">
                    {enviado ? (
                      <span className="flex items-center justify-center p-1.5 bg-emerald-100 text-emerald-600 rounded-full" title="Relatório Enviado">
                        <CheckCircle2 size={16} />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center p-1.5 bg-rose-100 text-rose-500 rounded-full" title="Relatório Pendente">
                        <AlertCircle size={16} />
                      </span>
                    )}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 group-hover:text-slate-950 transition-colors">
                      {membro.nome}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                        {membro.categoria}
                      </span>
                      {relatorio && relatorio.quantidadeEstudos > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {relatorio.quantidadeEstudos} {relatorio.quantidadeEstudos === 1 ? 'estudo' : 'estudos'}
                        </span>
                      )}
                      {relatorio && relatorio.horas !== '' && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-violet-50 text-violet-700 font-semibold rounded">
                          {relatorio.horas} horas
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right button Action */}
                <div>
                  {enviado ? (
                    <button
                      type="button"
                      className="px-2.5 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center gap-1 border border-slate-200/60"
                      id={`btn-edit-controle-${membro.id}`}
                    >
                      <Edit2 size={12} />
                      Editar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-2.5 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold group-hover:bg-rose-600 group-hover:text-white transition-all flex items-center gap-1 border border-rose-200/30"
                      id={`btn-add-controle-${membro.id}`}
                    >
                      <Plus size={12} />
                      Lançar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
