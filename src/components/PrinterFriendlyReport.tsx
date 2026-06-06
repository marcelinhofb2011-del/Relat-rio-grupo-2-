/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Membro, Relatorio, CategoriaMembro } from '../types';
import { Printer, X, Download } from 'lucide-react';

interface PrinterFriendlyReportProps {
  membros: Membro[];
  relatorios: Relatorio[];
  selectedMesAno: string;
  onClose: () => void;
}

export default function PrinterFriendlyReport({
  membros,
  relatorios,
  selectedMesAno,
  onClose
}: PrinterFriendlyReportProps) {
  // Filter for the selected month
  const relatoriosDoMes = relatorios.filter(r => r.mesAno === selectedMesAno);
  const membrosAtivos = membros.filter(m => m.ativo);

  // Stats
  const totalMembrosAtivos = membrosAtivos.length;
  const totalRelatados = relatoriosDoMes.length;
  const totalPendentes = totalMembrosAtivos - totalRelatados;
  const percentualParticipacao = totalMembrosAtivos > 0 ? (totalRelatados / totalMembrosAtivos) * 100 : 0;

  // Categoria stats
  const totalPublicadoresParticipou = relatoriosDoMes.filter(
    r => r.categoria === CategoriaMembro.PUBLICADOR && r.participouMinisterio
  ).length;

  const totalPublicadoresNaoParticipou = relatoriosDoMes.filter(
    r => r.categoria === CategoriaMembro.PUBLICADOR && !r.participouMinisterio
  ).length;

  const totalEstudos = relatoriosDoMes.reduce((acc, r) => acc + (r.quantidadeEstudos || 0), 0);

  const totalHorasRegularesInput = relatoriosDoMes
    .filter(r => r.categoria === CategoriaMembro.PIONEIRO_REGULAR)
    .reduce((acc, r) => acc + Number(r.horas || 0), 0);

  const totalHorasAuxiliaresInput = relatoriosDoMes
    .filter(r => r.categoria === CategoriaMembro.PIONEIRO_AUXILIAR)
    .reduce((acc, r) => acc + Number(r.horas || 0), 0);

  const listPendentes = membrosAtivos.filter(
    m => !relatoriosDoMes.some(r => r.membroId === m.id)
  );

  const handlePrint = () => {
    window.print();
  };

  const getFormatDate = (mesAnoStr: string) => {
    const [ano, mes] = mesAnoStr.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[parseInt(mes) - 1]} de ${ano}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" id="pdf-preview-modal">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none">
        
        {/* Modal Toolbar (hidden on print) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold font-mono">PDF PREVIEW</span>
            <h3 className="text-sm font-bold text-slate-800">Visualização de Impressão • Grupo 2</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              id="print-trigger"
            >
              <Printer size={14} />
              Imprimir / Salvar PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINT CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 print:p-0 bg-slate-100 print:bg-white" id="printable-area-scroller">
          <div className="w-[100%] max-w-[210mm] mx-auto bg-white p-8 print:p-4 rounded-xl border border-slate-200/30 shadow-xs print:shadow-none print:border-none print:mx-0 print:my-0" id="documento-imprimir">
            
            {/* Header Document */}
            <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
              <h1 className="text-xl font-bold text-slate-900 tracking-wide uppercase">Relatório de Atividades Espirituais</h1>
              <h2 className="text-base font-semibold text-slate-600 mt-1 uppercase">Grupo de Serviço 2</h2>
              <div className="inline-block bg-slate-100 px-4 py-1 rounded-md mt-2 print:border print:border-slate-300">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mês de Referência: {getFormatDate(selectedMesAno)}
                </span>
              </div>
            </div>

            {/* General Overview Metrics (2x2 Grid) */}
            <div className="grid grid-cols-4 gap-4 mb-6" id="print-stats-grid">
              <div className="border border-slate-300 p-3 rounded text-center">
                <span className="block text-[9px] uppercase font-bold text-slate-400">Total de Membros Activos</span>
                <span className="text-xl font-extrabold text-slate-800 font-sans">{totalMembrosAtivos}</span>
              </div>
              <div className="border border-slate-300 p-3 rounded text-center">
                <span className="block text-[9px] uppercase font-bold text-slate-400">Relatórios Recebidos</span>
                <span className="text-xl font-extrabold text-emerald-700 font-sans">{totalRelatados}</span>
              </div>
              <div className="border border-slate-300 p-3 rounded text-center">
                <span className="block text-[9px] uppercase font-bold text-slate-400">Relatórios Pendentes</span>
                <span className="text-xl font-extrabold text-rose-600 font-sans">{totalPendentes}</span>
              </div>
              <div className="border border-slate-300 p-3 rounded text-center bg-slate-50/50">
                <span className="block text-[9px] uppercase font-bold text-slate-400">Taxa de Relatórios</span>
                <span className="text-xl font-extrabold text-slate-800 font-sans">{percentualParticipacao.toFixed(1)}%</span>
              </div>
            </div>

            {/* Summarized Fields as Required */}
            <div className="border border-slate-300 rounded mb-6 overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Totais Consolidados do Grupo</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-300 text-xs fill-slate-700">
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Publicadores Ativos</span>
                  <p className="text-base font-bold text-slate-800">{totalPublicadoresParticipou} participaram</p>
                  <p className="text-[10px] text-slate-400">{totalPublicadoresNaoParticipou} informaram que não</p>
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Horas Pioneiros Regulares</span>
                  <p className="text-base font-bold text-slate-800">{totalHorasRegularesInput} horas</p>
                  <p className="text-[10px] text-slate-400">conduzido por P. Regulares</p>
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Horas Pioneiros Auxiliares</span>
                  <p className="text-base font-bold text-slate-800">{totalHorasAuxiliaresInput} horas</p>
                  <p className="text-[10px] text-slate-400">conduzido por P. Auxiliares</p>
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total de Estudos Bíblicos</span>
                  <p className="text-base font-bold text-slate-800">{totalEstudos} estudos</p>
                  <p className="text-[10px] text-slate-400">Média geral do grupo</p>
                </div>
              </div>
            </div>

            {/* Breakdown Detail Table */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Histórico Individual de Atividades</h3>
              <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase text-slate-700">
                    <th className="py-2 px-3 border-r border-slate-300">Irmão / Irmã</th>
                    <th className="py-2 px-3 border-r border-slate-300">Categoria</th>
                    <th className="py-2 px-3 border-r border-slate-300 text-center">Ativo?</th>
                    <th className="py-2 px-3 border-r border-slate-300 text-center">Participou?</th>
                    <th className="py-2 px-3 border-r border-slate-300 text-center">Estudos</th>
                    <th className="py-2 px-3 border-r border-slate-300 text-center">Horas</th>
                    <th className="py-2 px-3">Observações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {relatoriosDoMes.map(r => (
                    <tr key={r.id}>
                      <td className="py-2 px-3 font-semibold text-slate-800 border-r border-slate-300">{r.nomeIrmao}</td>
                      <td className="py-2 px-3 border-r border-slate-300 text-[11px]">{r.categoria}</td>
                      <td className="py-2 px-3 border-r border-slate-300 text-center">Sim</td>
                      <td className="py-2 px-3 border-r border-slate-300 text-center">
                        {r.categoria === CategoriaMembro.PUBLICADOR ? (r.participouMinisterio ? 'Sim' : 'Não') : 'Sim'}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-300 text-center font-semibold">{r.quantidadeEstudos > 0 ? r.quantidadeEstudos : '-'}</td>
                      <td className="py-2 px-3 border-r border-slate-300 text-center font-semibold">{r.horas !== '' ? `${r.horas}h` : '-'}</td>
                      <td className="py-2 px-3 text-slate-500 italic text-[11px] max-w-[200px] break-words">{r.observacoes || '-'}</td>
                    </tr>
                  ))}
                  {relatoriosDoMes.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-4 text-center italic text-slate-400">Nenhum relatório arquivado para este mês.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* List of pending brothers printed */}
            {listPendentes.length > 0 && (
              <div className="border border-dashed border-red-300 bg-rose-50/20 p-3 rounded mb-8 print:border-slate-300 print:bg-white text-xs">
                <h4 className="font-bold text-rose-800 print:text-slate-800 uppercase tracking-wider text-[10px] mb-1.5Packed">
                  Irmãos que ainda não relataram ({listPendentes.length}):
                </h4>
                <div className="text-slate-600 font-semibold space-x-1.5 flex flex-wrap gap-1.5">
                  {listPendentes.map((m, idx) => (
                    <span key={m.id} className="bg-white border border-slate-300 px-2 py-0.5 rounded text-[11px]">
                      {m.nome} ({m.categoria})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Signature Area (Essential for official spiritual reports) */}
            <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Data da Emissão</p>
                <div className="mt-6 border-b border-slate-400 w-48 mx-auto"></div>
                <p className="mt-1 text-slate-600 font-medium">{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Dirigente do Grupo 2</p>
                <div className="mt-6 border-b border-slate-400 w-48 mx-auto"></div>
                <p className="mt-1 text-slate-600 font-semibold text-slate-800">Responsável pelo Registro</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
