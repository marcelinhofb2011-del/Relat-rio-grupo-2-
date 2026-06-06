/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Membro, Relatorio, CategoriaMembro } from '../types';
import { Save, AlertCircle, RefreshCw, ClipboardCheck, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RegistroRelatorioProps {
  membros: Membro[];
  relatorios: Relatorio[];
  onSaveRelatorio: (relatorio: Omit<Relatorio, 'id' | 'dataRegistro'> & { id?: string }) => void;
  selectedMembroId?: string;
  selectedMesAno: string;
  onClose?: () => void;
  onChangeSelectedMembro?: (id: string) => void;
}

export default function RegistroRelatorio({
  membros,
  relatorios,
  onSaveRelatorio,
  selectedMembroId = '',
  selectedMesAno,
  onClose,
  onChangeSelectedMembro
}: RegistroRelatorioProps) {
  // Local states
  const [membroId, setMembroId] = useState(selectedMembroId);
  const [mesAno, setMesAno] = useState(selectedMesAno);
  const [participou, setParticipou] = useState(true);
  const [estudos, setEstudos] = useState<number>(0);
  const [horas, setHoras] = useState<number | ''>('');
  const [observacoes, setObservacoes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Active members only for recording brand new reports
  const membrosAtivos = membros.filter(m => m.ativo || m.id === membroId);

  // Find currently selected member details
  const selectedMembro = membros.find(m => m.id === membroId);

  // Update effect when external selectedMembroId or selectedMesAno change
  useEffect(() => {
    if (selectedMembroId) {
      setMembroId(selectedMembroId);
    }
  }, [selectedMembroId]);

  useEffect(() => {
    if (selectedMesAno) {
      setMesAno(selectedMesAno);
    }
  }, [selectedMesAno]);

  // Load existing report if it exists for the selected member & month combination
  useEffect(() => {
    if (membroId && mesAno) {
      const existing = relatorios.find(r => r.membroId === membroId && r.mesAno === mesAno);
      if (existing) {
        setParticipou(existing.participouMinisterio);
        setEstudos(existing.quantidadeEstudos);
        setHoras(existing.horas);
        setObservacoes(existing.observacoes);
        setIsEditing(true);
      } else {
        // Reset to smart defaults
        setParticipou(true);
        setEstudos(0);
        setHoras('');
        setObservacoes('');
        setIsEditing(false);
        
        // Pioneers should start with a placeholder or empty hours
        if (selectedMembro && selectedMembro.categoria !== CategoriaMembro.PUBLICADOR) {
          setHoras('');
        }
      }
    }
  }, [membroId, mesAno, relatorios, selectedMembro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!membroId) return;

    const existing = relatorios.find(r => r.membroId === membroId && r.mesAno === mesAno);

    onSaveRelatorio({
      id: existing?.id, // Send ID if editing to overwrite correctly
      membroId,
      mesAno,
      nomeIrmao: selectedMembro?.nome || '',
      categoria: selectedMembro?.categoria || CategoriaMembro.PUBLICADOR,
      participouMinisterio: selectedMembro?.categoria === CategoriaMembro.PUBLICADOR ? participou : true, // Pioneers always active
      quantidadeEstudos: estudos,
      horas: selectedMembro?.categoria !== CategoriaMembro.PUBLICADOR ? Number(horas || 0) : '',
      observacoes
    });

    if (onClose) {
      onClose();
    } else {
      // Clear or set to consecutive state if on-page form
      setMembroId('');
      setEstudos(0);
      setHoras('');
      setObservacoes('');
    }
  };

  const handleMembroSelectChange = (id: string) => {
    setMembroId(id);
    if (onChangeSelectedMembro) {
      onChangeSelectedMembro(id);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="registro-relatorio-container">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800" id="registro-title">
              {isEditing ? 'Editar Relatório' : 'Registrar Relatório'}
            </h3>
            <p className="text-xs text-slate-400">Grupo 2 • {mesAno.split('-').reverse().join('/')}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" id="registro-form">
        {/* Member Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Nome do irmão / irmã
          </label>
          <select
            value={membroId}
            onChange={(e) => handleMembroSelectChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
            required
            id="membro-select"
          >
            <option value="">-- Selecione o Irmão --</option>
            {membrosAtivos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Category display */}
        <AnimatePresence mode="wait">
          {selectedMembro && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              key={selectedMembro.id}
            >
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Categoria</span>
                  <span className="text-sm font-bold text-slate-700">{selectedMembro.categoria}</span>
                </div>
                <div>
                  {selectedMembro.categoria === CategoriaMembro.PIONEIRO_REGULAR && (
                    <span className="px-2 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg border border-violet-100">
                      Pioneiro Regular
                    </span>
                  )}
                  {selectedMembro.categoria === CategoriaMembro.PIONEIRO_AUXILIAR && (
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg border border-amber-100">
                      Pioneiro Auxiliar
                    </span>
                  )}
                  {selectedMembro.categoria === CategoriaMembro.PUBLICADOR && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                      Publicador
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Month Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Mês do Relatório
          </label>
          <input
            type="month"
            value={mesAno}
            onChange={(e) => setMesAno(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            required
            id="mes-ano-input"
          />
        </div>

        {/* Conditional Fields based on Category */}
        <AnimatePresence mode="popLayout">
          {selectedMembro && (
            <motion.div
              key={selectedMembro.categoria}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
              id="conditional-fields-container"
            >
              {/* Field 1: Participou do Ministério (Only relevant for Publicadores) */}
              {selectedMembro.categoria === CategoriaMembro.PUBLICADOR && (
                <div className="bg-emerald-50/40 rounded-xl p-3.5 border border-emerald-100">
                  <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
                    Participou do Ministério este mês?
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setParticipou(true)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                        participou
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                      id="opt-participou-sim"
                    >
                      SIM (Participou)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setParticipou(false);
                        setEstudos(0); // If they didn't participate, regular studies would typically be 0
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                        !participou
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                      id="opt-participou-nao"
                    >
                      NÃO (Não participou)
                    </button>
                  </div>
                </div>
              )}

              {/* Field 2: Hours Input (Only Pioneers) */}
              {selectedMembro.categoria !== CategoriaMembro.PUBLICADOR && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Horas de Ministério
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Quantidade de horas dedicadas"
                    value={horas}
                    onChange={(e) => setHoras(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    required
                    id="horas-input"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {selectedMembro.categoria === CategoriaMembro.PIONEIRO_REGULAR 
                      ? 'Requisito mensal sugerido: 50 horas.' 
                      : 'Requisito mensal sugerido: 30 horas.'}
                  </span>
                </div>
              )}

              {/* Field 3: Studies (All categories, but for Publicador only if they participated) */}
              {(!participou && selectedMembro.categoria === CategoriaMembro.PUBLICADOR) ? null : (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Quantidade de Estudos Bíblicos
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Número de estudos bíblicos conduzidos"
                    value={estudos}
                    onChange={(e) => setEstudos(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    required
                    id="estudos-input"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Observations */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <MessageSquare size={12} /> Observações
          </label>
          <textarea
            placeholder="Digite notas, observações de ministério ou assistência se houver..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all h-20 resize-none"
            id="observacoes-textarea"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex gap-2 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              id="cancel-form-btn"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={!membroId}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm ${
              membroId 
                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer' 
                : 'bg-slate-300 cursor-not-allowed'
            }`}
            id="submit-form-btn"
          >
            {isEditing ? <RefreshCw size={14} className="animate-spin-slow" /> : <Save size={14} />}
            {isEditing ? 'Atualizar Relatório' : 'Salvar Relatório'}
          </button>
        </div>
      </form>
    </div>
  );
}
