/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Membro, CategoriaMembro } from '../types';
import { UserPlus, Edit2, Trash2, Check, X, Search, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'motion/react';

interface GerenciarMembrosProps {
  membros: Membro[];
  onAddMembro: (membro: Omit<Membro, 'id'>) => void;
  onUpdateMembro: (membro: Membro) => void;
  onDeleteMembro: (membroId: string) => void;
}

export default function GerenciarMembros({
  membros,
  onAddMembro,
  onUpdateMembro,
  onDeleteMembro
}: GerenciarMembrosProps) {
  // Local form states
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaMembro>(CategoriaMembro.PUBLICADOR);
  const [ativo, setAtivo] = useState(true);
  
  // Edit mode states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editCategoria, setEditCategoria] = useState<CategoriaMembro>(CategoriaMembro.PUBLICADOR);
  const [editAtivo, setEditAtivo] = useState(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    onAddMembro({
      nome: nome.trim(),
      grupo: 'Grupo 2',
      categoria,
      ativo
    });

    // Reset Form
    setNome('');
    setCategoria(CategoriaMembro.PUBLICADOR);
    setAtivo(true);
  };

  const startEdit = (m: Membro) => {
    setEditingId(m.id);
    setEditNome(m.nome);
    setEditCategoria(m.categoria);
    setEditAtivo(m.ativo);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateSave = (id: string) => {
    if (!editNome.trim()) return;
    onUpdateMembro({
      id,
      nome: editNome.trim(),
      grupo: 'Grupo 2',
      categoria: editCategoria,
      ativo: editAtivo
    });
    setEditingId(null);
  };

  // Filter members base on query
  const filteredMembros = membros.filter(m => 
    m.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="gerenciar-membros-layout">
      {/* 1. Add Member Form */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-fit" id="card-novo-membro">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <UserPlus size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Cadastrar Novo Membro</h3>
            <p className="text-[11px] text-slate-400">Insira as informações básicas do publicador</p>
          </div>
        </div>

        <form onSubmit={handleAddSubmit} className="space-y-4" id="form-cadastrar-membro">
          {/* Nome */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5Packed">
              Nome do Irmão / Irmã
            </label>
            <input
              type="text"
              placeholder="Ex: Carlos Daniel"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-705 outline-none focus:border-blue-500 transition-all"
              required
              id="membro-nome-input"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaMembro)}
              className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none cursor-pointer focus:border-blue-500 transition-all"
              id="membro-categoria-select"
            >
              <option value={CategoriaMembro.PUBLICADOR}>Publicador</option>
              <option value={CategoriaMembro.PIONEIRO_REGULAR}>Pioneiro Regular</option>
              <option value={CategoriaMembro.PIONEIRO_AUXILIAR}>Pioneiro Auxiliar</option>
            </select>
          </div>

          {/* Ativo? */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-700 block">Status Inicial</span>
              <span className="text-[10px] text-slate-400">Ativo no Grupo 2?</span>
            </div>
            <button
              type="button"
              onClick={() => setAtivo(!ativo)}
              className="text-slate-600 focus:outline-none"
              id="btn-toggle-ativo"
            >
              {ativo ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Sim (Ativo)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Não (Inativo)
                </span>
              )}
            </button>
          </div>

          {/* Action trigger */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            id="btn-save-membro"
          >
            <UserPlus size={14} />
            Cadastrar no Grupo
          </button>
        </form>
      </div>

      {/* 2. Members List / Operations Dashboard */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col h-full" id="card-lista-cadastro">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Membros Registrados ({membros.length})</h3>
            <p className="text-[11px] text-slate-400">Gerencie a equipe ativa e configure as categorias do Grupo 2</p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 transition-all w-full sm:w-44"
              id="search-cadastro-input"
            />
          </div>
        </div>

        {/* List items block */}
        <div className="overflow-y-auto max-h-[360px] pr-1 -mr-1 space-y-2" id="membros-grid-cadastro">
          {filteredMembros.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 text-xs">Nenhum membro registrado ou compatível.</p>
            </div>
          ) : (
            filteredMembros.map((m) => {
              const isEditing = editingId === m.id;
              return (
                <div
                  key={m.id}
                  className={`border rounded-xl p-3 transition-shadow ${
                    isEditing 
                      ? 'border-blue-300 bg-blue-50/5' 
                      : m.ativo 
                        ? 'border-slate-100 bg-white hover:border-slate-200 shadow-sm' 
                        : 'border-slate-100 bg-slate-50/70 text-slate-400 opacity-75'
                  }`}
                  id={`membro-cad-row-${m.id}`}
                >
                  {isEditing ? (
                    /* EDITING LAYOUT */
                    <div className="space-y-3" id="edit-form-block">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Name input */}
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Nome</label>
                          <input
                            type="text"
                            value={editNome}
                            onChange={(e) => setEditNome(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 w-full outline-hidden"
                            required
                          />
                        </div>
                        {/* Category list option */}
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Categoria</label>
                          <select
                            value={editCategoria}
                            onChange={(e) => setEditCategoria(e.target.value as CategoriaMembro)}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 w-full cursor-pointer"
                          >
                            <option value={CategoriaMembro.PUBLICADOR}>Publicador</option>
                            <option value={CategoriaMembro.PIONEIRO_REGULAR}>Pioneiro Regular</option>
                            <option value={CategoriaMembro.PIONEIRO_AUXILIAR}>Pioneiro Auxiliar</option>
                          </select>
                        </div>
                      </div>

                      {/* Active toggle / cancel section */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setEditAtivo(!editAtivo)}
                          className="flex items-center gap-1.5 focus:outline-none"
                        >
                          <span className="text-[10px] text-slate-400 font-bold">Ativo:</span>
                          {editAtivo ? (
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">Sim</span>
                          ) : (
                            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-100">Não</span>
                          )}
                        </button>

                        <div className="flex gap-1.5">
                          <button
                            onClick={cancelEdit}
                            className="p-1 px-2.5 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                            title="Cancelar Edição"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleUpdateSave(m.id)}
                            className="p-1 px-2.5 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1"
                            title="Salvar Alterações"
                          >
                            <Check size={12} /> Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* DEFAUT VALUE DISPLAY */
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-700">{m.nome}</h4>
                          {!m.ativo && (
                            <span className="text-[8px] bg-slate-200 text-slate-500 font-bold px-1.5 py-0.2 rounded uppercase">
                              Inativo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-medium">{m.grupo}</span>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{m.categoria}</span>
                        </div>
                      </div>

                      {/* Default actions on member */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(m)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Editar Membro"
                          id={`btn-edit-mem-${m.id}`}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteMembro(m.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Excluir Membro"
                          id={`btn-del-mem-${m.id}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
