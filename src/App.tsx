/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Membro, Relatorio, CategoriaMembro } from './types';
import { MEMBROS_INICIAIS, RELATORIOS_INICIAIS } from './initialData';
import { exportToCSV, exportToJSON } from './utils/fileExport';
import DashboardStats from './components/DashboardStats';
import RegistroRelatorio from './components/RegistroRelatorio';
import ListaControle from './components/ListaControle';
import RelatoriosTabela from './components/RelatoriosTabela';
import GerenciarMembros from './components/GerenciarMembros';
import PrinterFriendlyReport from './components/PrinterFriendlyReport';

import {
  FileText,
  Users,
  Settings,
  Download,
  Upload,
  RotateCcw,
  BookOpen,
  Church,
  Calendar,
  Layers,
  HeartHandshake,
  CheckCircle,
  XCircle,
  Inbox,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. Core States loaded dynamically from backend Supabase/Local proxy
  const [membros, setMembros] = useState<Membro[]>([]);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [supabaseHasTables, setSupabaseHasTables] = useState<boolean | null>(null);
  const [supabaseError, setSupabaseError] = useState<{ message: string; code?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // PWA Install Prompter State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Selected Month (Defaulting to June 2026 as current workspace)
  const [selectedMesAno, setSelectedMesAno] = useState('2026-06');
  
  // Member selected from list shortcut to the form
  const [selectedMembroId, setSelectedMembroId] = useState('');

  // Active view tab layout
  const [activeTab, setActiveTab] = useState<'lancamento' | 'relatorios' | 'membros'>('lancamento');

  // Print PDF Preview modal visibility
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Success / Info / Warning Alerts notifications
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Custom IFrame-safe confirmation dialog state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  // Dynamic check config helper
  const checkConfig = () => {
    return fetch('/api/config')
      .then(r => r.json())
      .then(data => {
        setSupabaseConnected(data.supabaseConfigured);
        setSupabaseHasTables(data.hasTables);
        setSupabaseError(data.connectionError);
        return data;
      })
      .catch(() => {
        setSupabaseConnected(false);
        setSupabaseHasTables(false);
      });
  };

  // Dynamic reload helper
  const loadData = () => {
    setLoading(true);
    const p1 = fetch('/api/membros')
      .then(r => r.json())
      .then(data => {
        setMembros(data);
      })
      .catch(err => {
        console.error('Falha ao obter membros do servidor:', err);
      });

    const p2 = fetch('/api/relatorios')
      .then(r => r.json())
      .then(data => {
        setRelatorios(data);
      })
      .catch(err => {
        console.error('Falha ao obter relatórios do servidor:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    return Promise.all([p1, p2]);
  };

  // Bootstrap data on load
  useEffect(() => {
    checkConfig().then(() => {
      loadData();
    });

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Se já estiver abrindo como Standalone instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Trigger modern App PWA installation flow
  const handleInstallApp = () => {
    if (!deferredPrompt) {
      triggerToast('A instalação direta via um clique não está disponível neste navegador. Use a opção "Adicionar à tela de início" na barra de ferramentas do seu navegador!', 'info');
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        triggerToast('Pronto! O aplicativo está sendo instalado no seu dispositivo.', 'success');
        setShowInstallBtn(false);
      } else {
        triggerToast('Instalação ignorada.', 'info');
      }
      setDeferredPrompt(null);
    });
  };

  // Show quick notification
  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Convert month key to Portuguese string for visuals (e.g. "Junho de 2026")
  const getMesNomeCompleto = (mesAnoStr: string) => {
    const [ano, mes] = mesAnoStr.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[parseInt(mes) - 1]} de ${ano}`;
  };

  // 3. Database operations
  
  // Register or edit a report (CRUD endpoints save/update pipeline)
  const handleSaveRelatorio = (newRelData: Omit<Relatorio, 'id' | 'dataRegistro'> & { id?: string }) => {
    if (newRelData.id) {
      // Edit existing
      const updatedRel = {
        ...newRelData,
        dataRegistro: new Date().toISOString()
      } as Relatorio;

      setRelatorios((prev) =>
        prev.map((r) => r.id === newRelData.id ? updatedRel : r)
      );

      fetch('/api/relatorios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRel)
      })
      .then(res => res.json())
      .then(() => triggerToast('Relatório atualizado no banco de dados!', 'success'))
      .catch((err) => {
        console.error(err);
        triggerToast('Sincronizando com o servidor...', 'info');
      });

    } else {
      // Create new
      const id = 'rel_' + Math.random().toString(36).substring(2, 11);
      const fullRel: Relatorio = {
        ...newRelData,
        id,
        dataRegistro: new Date().toISOString()
      };

      setRelatorios((prev) => [...prev, fullRel]);

      fetch('/api/relatorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullRel)
      })
      .then(res => res.json())
      .then(() => triggerToast(`Relatório de ${newRelData.nomeIrmao} salvo com sucesso!`, 'success'))
      .catch((err) => {
        console.error(err);
        triggerToast('Sincronizando com o servidor...', 'info');
      });
    }
    // Deselect member from form
    setSelectedMembroId('');
  };

  // Delete a recorded report
  const handleDeleteRelatorio = (id: string) => {
    const reportToDelete = relatorios.find(r => r.id === id);
    const brotherName = reportToDelete ? reportToDelete.nomeIrmao : 'Membro';

    setConfirmModal({
      isOpen: true,
      title: 'Excluir Relatório',
      message: `Tem certeza de que deseja excluir o relatório de ${brotherName}?`,
      confirmText: 'Sim, Excluir',
      onConfirm: () => {
        setRelatorios((prev) => prev.filter((r) => r.id !== id));
        fetch(`/api/relatorios/${id}`, {
          method: 'DELETE'
        })
        .then(() => triggerToast(`Relatório de ${brotherName} foi removido do banco.`, 'info'))
        .catch((err) => {
          console.error(err);
          triggerToast('Sincronizando exclusão...', 'info');
        });
        setConfirmModal(null);
      }
    });
  };

  // Add new group member
  const handleAddMembro = (newMembroData: Omit<Membro, 'id'>) => {
    // Check if name already exists
    const duplicate = membros.find(m => m.nome.toLowerCase().trim() === newMembroData.nome.toLowerCase().trim());
    if (duplicate) {
      triggerToast(`O nome "${newMembroData.nome}" já está registrado no grupo!`, 'error');
      return;
    }

    const id = 'mem_' + Math.random().toString(36).substring(2, 11);
    const fullMembro: Membro = {
      ...newMembroData,
      id
    };
    
    setMembros((prev) => [...prev, fullMembro]);

    fetch('/api/membros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullMembro)
    })
    .then(res => res.json())
    .then(() => triggerToast(`${newMembroData.nome} adicionado ao grupo!`, 'success'))
    .catch((err) => {
      console.error(err);
      triggerToast('Sincronizando novo membro...', 'info');
    });
  };

  // Update existing member details
  const handleUpdateMembro = (updatedMembro: Membro) => {
    setMembros((prev) =>
      prev.map((m) => (m.id === updatedMembro.id ? updatedMembro : m))
    );
    
    // Also cascade Name change to existing monthly reports if needed
    setRelatorios((prev) =>
      prev.map((r) =>
        r.membroId === updatedMembro.id
          ? { ...r, nomeIrmao: updatedMembro.nome, categoria: updatedMembro.categoria }
          : r
      )
    );

    fetch('/api/membros', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMembro)
    })
    .then(res => res.json())
    .then(() => triggerToast(`Cadastro de ${updatedMembro.nome} atualizado no servidor.`, 'success'))
    .catch((err) => {
      console.error(err);
      triggerToast('Sincronizando alterações...', 'info');
    });
  };

  // Delete a member
  const handleDeleteMembro = (membroId: string) => {
    const membro = membros.find(m => m.id === membroId);
    if (!membro) return;

    setConfirmModal({
      isOpen: true,
      title: 'Remover Membro',
      message: `Deseja mesmo remover ${membro.nome} do Grupo? Os históricos de relatórios anteriores serão preservados.`,
      confirmText: 'Sim, Excluir',
      onConfirm: () => {
        setMembros((prev) => prev.filter((m) => m.id !== membroId));

        fetch(`/api/membros/${membroId}`, {
          method: 'DELETE'
        })
        .then(() => triggerToast(`${membro.nome} excluído do banco.`, 'info'))
        .catch((err) => {
          console.error(err);
          triggerToast('Sincronizando exclusão...', 'info');
        });
        setConfirmModal(null);
      }
    });
  };

  // 4. Export mechanisms
  const handleExportCSV = () => {
    const relatoriosDoMes = relatorios.filter(r => r.mesAno === selectedMesAno);
    if (relatoriosDoMes.length === 0) {
      triggerToast('Nenhum relatório para exportar neste mês!', 'error');
      return;
    }

    const headers = [
      'Nome do Irmao',
      'Categoria',
      'Participou do Ministerio',
      'Quantidade de Estudos',
      'Horas (Pioneiros)',
      'Observacoes',
      'Data de Registro'
    ];

    const rows = relatoriosDoMes.map(r => [
      r.nomeIrmao,
      r.categoria,
      r.categoria === CategoriaMembro.PUBLICADOR ? (r.participouMinisterio ? 'Sim' : 'Não') : 'Sim',
      r.quantidadeEstudos,
      r.horas !== '' ? r.horas : '-',
      r.observacoes || '',
      new Date(r.dataRegistro).toLocaleString('pt-BR')
    ]);

    const cleanMesDisplay = selectedMesAno.replace('-', '_');
    exportToCSV(headers, rows, `Relatorio_Atividades_Grupo2_${cleanMesDisplay}.csv`);
    triggerToast('Planilha Excel (CSV) baixada com sucesso!', 'success');
  };

  // backup save download
  const handleDownloadBackup = () => {
    exportToJSON({ membros, relatorios }, 'Backup_Atividades_Grupo2.json');
    triggerToast('Backup do banco de dados baixado!', 'success');
  };

  // backup load trigger
  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.membros && parsed.relatorios) {
          setMembros(parsed.membros);
          setRelatorios(parsed.relatorios);
          triggerToast('Backup carregado na tela. Salve os dados registrando novos relatórios.', 'info');
        } else {
          triggerToast('Formato de backup inválido.', 'error');
        }
      } catch (err) {
        triggerToast('Erro de sintaxe no arquivo de backup.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Clean input
  };

  // restart database defaults
  const handleResetDatabase = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Redefinir Dados',
      message: 'Tem certeza de que deseja apagar as alterações atuais e restaurar os dados de demonstração padrão?',
      confirmText: 'Sim, Redefinir',
      onConfirm: () => {
        setMembros(MEMBROS_INICIAIS);
        setRelatorios(RELATORIOS_INICIAIS);
        setSelectedMesAno('2026-06');
        setActiveTab('lancamento');
        triggerToast('Banco de dados redefinido para o padrão!', 'info');
        setConfirmModal(null);
      }
    });
  };

  // 5. Overall statistics calculation (only for active members)
  const membrosAtivos = membros.filter(m => m.ativo);
  const totalMembrosAtivos = membrosAtivos.length;
  
  const relatoriosDoMes = relatorios.filter(r => r.mesAno === selectedMesAno);
  const quantosRelataram = membrosAtivos.filter(m =>
    relatoriosDoMes.some(r => r.membroId === m.id)
  ).length;

  const quantosFaltam = totalMembrosAtivos - quantosRelataram;
  const percentualRelatado = totalMembrosAtivos > 0 ? (quantosRelataram / totalMembrosAtivos) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased pb-12" id="app-root-container">
      {/* Dynamic Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -45, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-5 py-3 shadow-lg flex items-center gap-2.5 font-semibold text-xs border ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : toast.type === 'error'
                  ? 'bg-rose-50 border-rose-150 text-rose-800'
                  : 'bg-blue-50 border-blue-100 text-blue-800'
            }`}
            id="toast-notification"
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bold Typography Header Banner */}
      <header className="border-b-2 border-black pb-5 pt-8 mb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print-hide" id="app-header">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none text-slate-950 uppercase">
              GRUPO 02
            </h1>
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase opacity-60">
              RELATÓRIO DE ATIVIDADES ESPIRITUAIS
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Interactive selector block for month with period metadata label */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">MÊS DE REFERÊNCIA</span>
              <div className="flex items-center gap-1 bg-white border-2 border-black px-3 py-1 mt-1">
                <Calendar size={14} className="text-slate-900" />
                <input
                  type="month"
                  value={selectedMesAno}
                  onChange={(e) => setSelectedMesAno(e.target.value)}
                  className="bg-transparent border-none text-sm font-black text-slate-950 uppercase outline-hidden cursor-pointer"
                  id="selected-month-picker"
                  title="Trocar mês de referência"
                />
              </div>
            </div>

            {/* Quick action buttons designed with Bold border-2 border-black style */}
            <div className="flex items-center gap-2 pt-4 md:pt-0">
              <button
                onClick={() => setShowPrintModal(true)}
                className="px-4 py-2 border-2 border-black font-black text-xs uppercase bg-white hover:bg-black hover:text-white transition-all cursor-pointer"
                title="Visualizar e Imprimir Relatório Oficial"
                id="header-btn-pdf"
              >
                PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 border-2 border-black font-black text-xs uppercase bg-white hover:bg-black hover:text-white transition-all cursor-pointer"
                title="Exportar para Excel"
                id="header-btn-excel"
              >
                Planilha (CSV)
              </button>

              {/* Install PWA Option */}
              <button
                onClick={handleInstallApp}
                className="px-3 py-2 border-2 border-indigo-600 font-black text-xs uppercase bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 transition-all cursor-pointer flex items-center gap-1.5"
                title="Instalar aplicativo móvel ou desktop (PWA)"
                id="header-btn-install"
              >
                <Smartphone size={14} className="stroke-[2.5]" />
                Instalar App
              </button>
            </div>

            {/* Compact Admin Settings panel style with stout black borders */}
            <div className="flex items-center border-2 border-black bg-white p-0.5 divide-x-2 divide-black">
              {/* Reset seed */}
              <button
                onClick={handleResetDatabase}
                className="p-2 text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                title="Redefinir para dados de teste"
                id="btn-settings-reset"
              >
                <RotateCcw size={13} className="stroke-[2.5]" />
              </button>

              {/* Data Import trigger */}
              <label 
                className="p-2 text-slate-900 hover:bg-slate-100 transition-all cursor-pointer inline-flex items-center" 
                title="Importar Backup (.json)"
                style={{ margin: 0 }}
              >
                <Upload size={13} className="stroke-[2.5]" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleUploadBackup}
                  className="hidden"
                />
              </label>

              {/* Data Export download */}
              <button
                onClick={handleDownloadBackup}
                className="p-2 text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                title="Baixar Backup (.json)"
                id="btn-settings-backup"
              >
                <Download size={13} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* BANCO DE DADOS STATUS BAR */}
        {supabaseConnected !== null && (
          <div className="space-y-4 print-hide">
            {/* Connection Standard Info */}
            <div className="border-2 border-black bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-bold text-xs">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full inline-block animate-pulse shrink-0 ${supabaseConnected ? (supabaseHasTables ? 'bg-emerald-600' : 'bg-amber-500') : 'bg-amber-500'}`} />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="uppercase text-slate-900">
                    Banco de Dados:
                  </span>
                  <span className={`uppercase font-black ${supabaseConnected ? (supabaseHasTables ? 'text-emerald-700' : 'text-amber-600') : 'text-amber-600'}`}>
                    {supabaseConnected ? (supabaseHasTables ? 'REAL_CONECTADO_SUPABASE' : 'SUPABASE_CONECTADO_SEM_TABELAS') : 'MODO_DEMONSTRACAO_LOCAL'}
                  </span>
                </div>
              </div>

              {!supabaseConnected ? (
                <span className="text-slate-500 font-medium text-center sm:text-right">
                  Adicione <strong>SUPABASE_URL</strong> e <strong>SUPABASE_ANON_KEY</strong> nos Segredos para conectar seu banco de dados real.
                </span>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {supabaseHasTables ? (
                    <span className="text-emerald-800 font-medium text-center sm:text-right">
                      Os dados de relatórios e membros estão sincronizados diretamente com o Supabase.
                    </span>
                  ) : (
                    <span className="text-amber-800 font-medium text-center sm:text-right">
                      Banco autenticado, mas as tabelas ainda não foram detectadas.
                    </span>
                  )}
                  <button
                    onClick={() => {
                      triggerToast('Sincronizando com o Supabase...', 'info');
                      checkConfig().then(() => {
                        loadData().then(() => {
                          triggerToast('Sincronização e tabelas atualizadas!', 'success');
                        });
                      });
                    }}
                    className="px-3 py-1.5 border-2 border-black bg-slate-950 text-white hover:bg-white hover:text-slate-950 font-black text-[10px] uppercase cursor-pointer transition-all shrink-0"
                  >
                    🔄 Recarregar e Sincronizar
                  </button>
                </div>
              )}
            </div>

            {/* Missing Tables Action Alert Warning Box */}
            {supabaseConnected && supabaseHasTables === false && (
              <div className="border-2 border-red-600 bg-red-50 p-5 flex flex-col gap-3 font-bold text-xs text-red-950">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-red-600 animate-pulse shrink-0" />
                  <span className="uppercase font-black text-red-700 text-sm">
                    ⚠️ Tabelas não encontradas no seu Supabase
                  </span>
                </div>
                
                <p className="font-normal text-slate-700 leading-relaxed text-xs">
                  Sua conexão com o Supabase está tecnicamente correta! No entanto, as tabelas <code className="bg-white px-1 border py-0.5 rounded text-red-700 font-mono">membros</code> e <code className="bg-white px-1 border py-0.5 rounded text-red-700 font-mono">relatorios</code> não foram encontradas.
                  Você precisa criar a estrutura de dados (schema) abaixo para que o aplicativo possa gravar registros.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 sm:mt-1">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/supabase_schema.sql');
                        const text = await response.text();
                        await navigator.clipboard.writeText(text);
                        triggerToast('Copiado! Acesse seu Supabase Dashboard para colar e executar.', 'success');
                      } catch (e) {
                        triggerToast('Erro ao copiar. Consulte o arquivo supabase_schema.sql no editor.', 'error');
                      }
                    }}
                    className="px-4 py-2 border-2 border-red-600 font-black text-xs uppercase bg-white hover:bg-red-600 hover:text-white transition-all cursor-pointer text-red-700"
                    title="Copiar SQL completo para o Clipboard"
                  >
                    Copiar Script de Criação (SQL)
                  </button>
                  <span className="text-slate-500 font-medium">
                    Cole o script no SQL Editor do seu dashboard da Supabase e execute para criar as tabelas!
                  </span>
                </div>

                {supabaseError && (
                  <div className="bg-white/75 border border-red-200 p-2 mt-2 rounded font-mono text-[10px] text-red-800 font-normal">
                    <strong>Mensagem técnica de erro:</strong> {supabaseError.message}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        
        {/* TOP LEVEL REALTIME DASHBOARD PANELS */}
        <DashboardStats
          totalMembros={totalMembrosAtivos}
          relataramCount={quantosRelataram}
          faltamCount={quantosFaltam}
          percentual={percentualRelatado}
          mesSelecionadoNome={getMesNomeCompleto(selectedMesAno)}
        />

        {/* COMPREHENSIVE TAB DIRECTORY NAVIGATION ROW */}
        <div className="flex border-b border-slate-200" id="tabs-nav">
          <button
            onClick={() => { setActiveTab('lancamento'); setSelectedMembroId(''); }}
            className={`py-3 px-5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'lancamento'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers size={14} />
            Lançar & Listagem
          </button>
          
          <button
            onClick={() => setActiveTab('relatorios')}
            className={`py-3 px-5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'relatorios'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText size={14} />
            Histórico & Totais
          </button>
          
          <button
            onClick={() => setActiveTab('membros')}
            className={`py-3 px-5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'membros'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users size={14} />
            Gerenciar Membros
          </button>
        </div>

        {/* DYNAMIC VIEWPORTS DISPLAY */}
        <div id="tab-viewport-container">
          <AnimatePresence mode="wait">
            {activeTab === 'lancamento' && (
              <motion.div
                key="lancamento-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Visual Checklist Column (Left on Large screens) */}
                <div className="lg:col-span-2">
                  <ListaControle
                    membros={membros}
                    relatorios={relatorios}
                    selectedMesAno={selectedMesAno}
                    onSelectMembroParaRelatorio={(membroId) => setSelectedMembroId(membroId)}
                  />
                </div>

                {/* Recording Dynamic Form (Right Side) */}
                <div>
                  <RegistroRelatorio
                    membros={membros}
                    relatorios={relatorios}
                    selectedMesAno={selectedMesAno}
                    selectedMembroId={selectedMembroId}
                    onSaveRelatorio={handleSaveRelatorio}
                    onChangeSelectedMembro={(mId) => setSelectedMembroId(mId)}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'relatorios' && (
              <motion.div
                key="relatorios-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <RelatoriosTabela
                  membros={membros}
                  relatorios={relatorios}
                  onEditRelatorio={(mId) => {
                    setSelectedMembroId(mId);
                    setActiveTab('lancamento');
                  }}
                  onDeleteRelatorio={handleDeleteRelatorio}
                  selectedMesAno={selectedMesAno}
                  onExportCSV={handleExportCSV}
                  onPrintReport={() => setShowPrintModal(true)}
                />
              </motion.div>
            )}

            {activeTab === 'membros' && (
              <motion.div
                key="membros-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <GerenciarMembros
                  membros={membros}
                  onAddMembro={handleAddMembro}
                  onUpdateMembro={handleUpdateMembro}
                  onDeleteMembro={handleDeleteMembro}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER AND ACCESSIBLE META */}
      <footer className="mt-16 text-center text-[11px] text-slate-400 border-t border-slate-100 pt-6" id="app-footer">
        <p className="font-semibold text-slate-500 flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <HeartHandshake size={12} className="text-emerald-600" />
          Relatórios Grupo 2 • Gestão Ministerial
        </p>
        <p className="text-slate-400 mt-1">Todos os dados são armazenados localmente e de forma privada no seu dispositivo.</p>
        
        {/* Mobile quick actions banner wrapper */}
        <div className="flex sm:hidden mt-4 items-center justify-center gap-4 text-xs font-bold text-slate-500 px-4 print-hide">
          <button onClick={handleResetDatabase} className="hover:text-amber-600 transition-colors">Redefinir</button>
          <span>•</span>
          <button onClick={handleDownloadBackup} className="hover:text-blue-600 transition-colors">Baixar Backup</button>
        </div>
      </footer>

      {/* PRINT DIALOG / SAVING TO PDF PREVIEW WINDOW */}
      <AnimatePresence>
        {showPrintModal && (
          <PrinterFriendlyReport
            membros={membros}
            relatorios={relatorios}
            selectedMesAno={selectedMesAno}
            onClose={() => setShowPrintModal(false)}
          />
        )}

        {/* CUSTOM CONFIRMATION DIALOG MODAL (Iframe Safe) */}
        {confirmModal && confirmModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 print-hide"
            id="custom-confirm-modal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border-4 border-black max-w-sm w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
            >
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                ⚠️ CONFIRMAÇÃO NECESSÁRIA
              </h3>
              <p className="text-xs text-slate-700 font-bold mb-6 leading-relaxed">
                {confirmModal.message}
              </p>
              <div className="flex items-center justify-end gap-3 font-black text-xs uppercase">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border-2 border-black hover:bg-slate-100 text-slate-900 transition-all cursor-pointer bg-white"
                  id="confirm-modal-cancel"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                  }}
                  className="px-4 py-2 border-2 border-rose-600 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-all cursor-pointer font-black"
                  id="confirm-modal-agree"
                >
                  {confirmModal.confirmText || 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
