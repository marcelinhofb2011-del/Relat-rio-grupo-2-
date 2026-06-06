/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, FileCheck, AlertCircle, Percent } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardStatsProps {
  totalMembros: number;
  relataramCount: number;
  faltamCount: number;
  percentual: number;
  mesSelecionadoNome: string;
}

export default function DashboardStats({
  totalMembros,
  relataramCount,
  faltamCount,
  percentual,
  mesSelecionadoNome
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-stats-grid">
      {/* Total Membros Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        id="card-total-membros"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total do Grupo</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1 font-sans">{totalMembros}</h3>
          <p className="text-xs text-slate-500 mt-1">Membros ativos</p>
        </div>
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
          <Users size={24} />
        </div>
      </motion.div>

      {/* Relataram Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        id="card-relataram"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Já Relataram</p>
          <h3 className="text-3xl font-bold text-teal-600 mt-1 font-sans">{relataramCount}</h3>
          <p className="text-xs text-slate-500 mt-1">{mesSelecionadoNome}</p>
        </div>
        <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl">
          <FileCheck size={24} />
        </div>
      </motion.div>

      {/* Faltam Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        id="card-faltam"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Faltam Relatar</p>
          <h3 className="text-3xl font-bold text-rose-500 mt-1 font-sans">{faltamCount}</h3>
          <p className="text-xs text-rose-400 font-medium mt-1">Relatórios pendentes</p>
        </div>
        <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl">
          <AlertCircle size={24} />
        </div>
      </motion.div>

      {/* Percentual Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
        id="card-percentual"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Participação</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1 font-sans">
              {percentual.toFixed(0)}%
            </h3>
          </div>
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
            <Percent size={22} />
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-teal-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentual}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
