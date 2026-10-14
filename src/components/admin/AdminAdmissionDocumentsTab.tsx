import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  AlertTriangle,
  FolderOpen,
  Calendar,
  Lock,
  Search,
  FileCheck,
} from 'lucide-react';
import { AdmissionDocument } from '../../types';
import {
  getAllAdmissionDocuments,
  createAdmissionDocument,
  updateAdmissionDocument,
  togglePublishAdmissionDocument,
  deleteAdmissionDocument,
  downloadAdmissionDocument,
  validateAdmissionFile,
} from '../../services/admissionDocumentsService';

export const AdminAdmissionDocumentsTab: React.FC = () => {
  const [documents, setDocuments] = useState<AdmissionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<AdmissionDocument | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [titleSw, setTitleSw] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionSw, setDescriptionSw] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [category, setCategory] = useState<AdmissionDocument['category']>('admission');
  const [academicYear, setAcademicYear] = useState('2026/2027');
  const [published, setPublished] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Feedback State
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load all documents
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await getAllAdmissionDocuments();
      setDocuments(data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Hitilafu wakati wa kupakia nyaraka za udahili.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const openAddModal = () => {
    setEditingDoc(null);
    setCode(`UOM-ADM-0${documents.length + 1}`);
    setTitleSw('');
    setTitleEn('');
    setDescriptionSw('');
    setDescriptionEn('');
    setCategory('admission');
    setAcademicYear('2026/2027');
    setPublished(true);
    setSelectedFile(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (docItem: AdmissionDocument) => {
    setEditingDoc(docItem);
    setCode(docItem.code || '');
    setTitleSw(docItem.titleSw || '');
    setTitleEn(docItem.titleEn || '');
    setDescriptionSw(docItem.descriptionSw || '');
    setDescriptionEn(docItem.descriptionEn || '');
    setCategory(docItem.category || 'admission');
    setAcademicYear(docItem.academicYear || '2026/2027');
    setPublished(docItem.published);
    setSelectedFile(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateAdmissionFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.error || 'Faili halikubaliwi');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
      if (!titleSw) {
        setTitleSw(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      if (!titleSw.trim()) {
        throw new Error('Tafadhali jaza Jina la Nyaraka (Kiswahili).');
      }

      if (editingDoc) {
        // Update existing document
        await updateAdmissionDocument(
          editingDoc.id,
          {
            code: code.trim(),
            titleSw: titleSw.trim(),
            titleEn: titleEn.trim() || titleSw.trim(),
            descriptionSw: descriptionSw.trim(),
            descriptionEn: descriptionEn.trim() || descriptionSw.trim(),
            category,
            academicYear,
            published,
          },
          selectedFile || undefined
        );
        setSuccessMessage('Nyaraka imesasishwa kikamilifu!');
      } else {
        // Create new document
        await createAdmissionDocument(
          {
            code: code.trim() || `UOM-ADM-${Date.now().toString().slice(-4)}`,
            titleSw: titleSw.trim(),
            titleEn: titleEn.trim() || titleSw.trim(),
            descriptionSw: descriptionSw.trim(),
            descriptionEn: descriptionEn.trim() || descriptionSw.trim(),
            category,
            academicYear,
            fileType: selectedFile?.name.endsWith('.docx') ? 'DOCX' : 'PDF',
            fileSize: selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : '200 KB',
            fileName: selectedFile?.name || `${code}.pdf`,
            downloadType: selectedFile ? 'uploaded' : 'generator',
            generatorKey: selectedFile ? undefined : 'admission_form',
            published,
            featured: false,
          },
          selectedFile || undefined
        );
        setSuccessMessage('Nyaraka mpya imeongezwa kikamilifu!');
      }

      setIsModalOpen(false);
      await loadDocuments();
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Hitilafu wakati wa kuhifadhi nyaraka.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (docItem: AdmissionDocument) => {
    try {
      const nextState = !docItem.published;
      await togglePublishAdmissionDocument(docItem.id, nextState);
      setDocuments((prev) =>
        prev.map((d) => (d.id === docItem.id ? { ...d, published: nextState } : d))
      );
      setSuccessMessage(
        nextState
          ? `Nyaraka ya "${docItem.titleSw}" sasa inaonekana kwa wageni.`
          : `Nyaraka ya "${docItem.titleSw}" imesitishwa kuonekana (Draft).`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Hitilafu kubadili hadhi ya uchapishaji.');
    }
  };

  const handleDelete = async (docItem: AdmissionDocument) => {
    if (!window.confirm(`Je, una uhakika unataka kuondoa nyaraka "${docItem.titleSw}"?`)) {
      return;
    }

    setDeletingId(docItem.id);
    try {
      await deleteAdmissionDocument(docItem.id);
      setDocuments((prev) => prev.filter((d) => d.id !== docItem.id));
      setSuccessMessage('Nyaraka imeondolewa kikamilifu.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Hitilafu wakati wa kufuta nyaraka.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered list
  const filtered = documents.filter((d) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && d.published) ||
      (statusFilter === 'draft' && !d.published);

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    return (
      matchesStatus &&
      (d.titleSw?.toLowerCase().includes(q) ||
        d.titleEn?.toLowerCase().includes(q) ||
        d.code?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q))
    );
  });

  const totalPublished = documents.filter((d) => d.published).length;
  const totalDownloads = documents.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-bold text-white">{documents.length}</span>
            <span className="text-xs text-slate-400">Jumla ya Nyaraka</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-bold text-emerald-400">{totalPublished}</span>
            <span className="text-xs text-slate-400">Zilizochapishwa (Live)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-bold text-amber-400">
              {documents.length - totalPublished}
            </span>
            <span className="text-xs text-slate-400">Bado (Drafts)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-bold text-purple-300">{totalDownloads}</span>
            <span className="text-xs text-slate-400">Jumla ya Vipakuzi</span>
          </div>
        </div>
      </div>

      {/* Success & Error alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-700/60 text-red-200 text-xs sm:text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Action Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-grow max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tafuta nyaraka..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-hidden"
          >
            <option value="all">Hadhi Zote</option>
            <option value="published">Zilizochapishwa</option>
            <option value="draft">Bado (Draft)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDocuments}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ongeza / Pakia Nyaraka Mpya</span>
          </button>
        </div>
      </div>

      {/* Documents Table / Card List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Nambari &amp; Jina la Nyaraka</th>
                <th className="py-3 px-3">Kundi (Category)</th>
                <th className="py-3 px-3">Faili &amp; Ukubwa</th>
                <th className="py-3 px-3">Hadhi (Status)</th>
                <th className="py-3 px-3">Vipakuzi</th>
                <th className="py-3 px-4 text-right">Vitendo (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((docItem) => (
                <tr key={docItem.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-800 text-amber-400 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{docItem.titleSw}</span>
                        <span className="text-[11px] text-slate-400 block">{docItem.titleEn}</span>
                        <span className="text-[10px] font-mono text-amber-400 mt-0.5 inline-block">
                          {docItem.code} • {docItem.academicYear || '2026/2027'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                      {docItem.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px]">
                    <span className="block text-slate-200">{docItem.fileType || 'PDF'}</span>
                    <span className="text-[10px] text-slate-400">{docItem.fileSize}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => handleTogglePublish(docItem)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        docItem.published
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 hover:bg-emerald-900'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                      title="Bonyeza kubadili hadhi ya uchapishaji"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          docItem.published ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                        }`}
                      />
                      <span>{docItem.published ? 'Imechapishwa' : 'Draft (Bado)'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    {docItem.downloadsCount || 0}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => downloadAdmissionDocument(docItem)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        title="Jaribu Pakua (Test Download)"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button
                        onClick={() => openEditModal(docItem)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors cursor-pointer"
                        title="Hariri / Badilisha Faili (Edit)"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(docItem)}
                        disabled={deletingId === docItem.id}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition-colors cursor-pointer"
                        title="Ondoa Nyaraka (Delete)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Hakuna nyaraka za udahili zilizopatikana.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>
                  {editingDoc ? 'Hariri Nyaraka ya Udahili' : 'Ongeza / Pakia Nyaraka Mpya ya Udahili'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Form */}
            <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Nambari ya Nyaraka (Code)</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Mf. UOM-ADM-01"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Mwaka wa Masomo (Academic Year)</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2026/2027"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Jina la Nyaraka (Kiswahili) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleSw}
                  onChange={(e) => setTitleSw(e.target.value)}
                  placeholder="Mf. Fomu Rasmi ya Udahili wa Mwanafunzi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Jina la Nyaraka (English)</label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Official Student Admission Application Form"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Kundi (Category)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="admission">Udahili (Admission & Biodata)</option>
                    <option value="medical">Afya ya Mwanafunzi (Medical Examination)</option>
                    <option value="parent">Taarifa za Mzazi (Parent Agreement)</option>
                    <option value="joining">Maelekezo Kujiunga (Joining Instructions)</option>
                    <option value="rules">Sheria na Kanuni (Rules & Regulations)</option>
                    <option value="checklist">Vitu Muhimu (Essential Checklist)</option>
                    <option value="other">Nyaraka Nyingine (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Hadhi ya Uchapishaji</label>
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                      />
                      <span className="font-semibold text-white">Chapisha Sasa (Published Live)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Maelezo Mafupi (Kiswahili)</label>
                <textarea
                  rows={2}
                  value={descriptionSw}
                  onChange={(e) => setDescriptionSw(e.target.value)}
                  placeholder="Eleza madhumuni ya nyaraka hii kwa kifupi..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Maelezo Mafupi (English)</label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Brief summary in English..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              {/* Upload File / Replace File Field */}
              <div className="pt-2 border-t border-slate-800">
                <label className="font-bold text-slate-300 block mb-1.5 flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {editingDoc ? 'Pakia Faili Jipya la Kubadilisha (Replace File)' : 'Pakia Faili la Nyaraka (PDF / DOCX)'}
                  </span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Faili zilizoruhusiwa: .pdf, .docx, .doc (Ukubwa usiozidi 10MB).
                </span>
                {selectedFile && (
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                    ✓ Limechaguliwa: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </span>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  Ghairi (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingDoc ? 'Hifadhi Mabadiliko' : 'Weka Nyaraka'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
