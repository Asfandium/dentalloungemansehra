import React, { useState, useEffect } from 'react';
import { adminApi, type AdminService } from '../../services/adminApi';
import { getFullImageUrl } from '../../utils/imageUrl';
import {
  Edit3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  DollarSign,
  Upload,
  X,
  Info
} from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [editFormData, setEditFormData] = useState<{
    shortDescription: string;
    fullDescription: string;
    whoItIsFor: string;
    generalBenefits: string[];
    priceAmount: number | undefined;
    currencyCode: string;
    priceDisplayMode: number;
    priceNote: string;
    imageUrl: string;
    imageAltText: string;
    isPublished: boolean;
  }>({
    shortDescription: '',
    fullDescription: '',
    whoItIsFor: '',
    generalBenefits: [],
    priceAmount: undefined,
    currencyCode: 'PKR',
    priceDisplayMode: 1,
    priceNote: '',
    imageUrl: '',
    imageAltText: '',
    isPublished: true,
  });

  const [benefitsInput, setBenefitsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getServices();
      // Ensure strict sort by displayOrder
      const sorted = [...data].sort((a, b) => a.displayOrder - b.displayOrder);
      setServices(sorted);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenEdit = (svc: AdminService) => {
    setEditingService(svc);
    setEditFormData({
      shortDescription: svc.shortDescription || '',
      fullDescription: svc.fullDescription || '',
      whoItIsFor: svc.whoItIsFor || '',
      generalBenefits: svc.generalBenefits || [],
      priceAmount: svc.priceAmount,
      currencyCode: svc.currencyCode || 'PKR',
      priceDisplayMode: svc.priceDisplayMode ?? 1,
      priceNote: svc.priceNote || '',
      imageUrl: svc.imageUrl || '',
      imageAltText: svc.imageAltText || '',
      isPublished: svc.isPublished,
    });
    setBenefitsInput((svc.generalBenefits || []).join('\n'));
    setModalFeedback(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setModalFeedback(null);
    try {
      const uploaded = await adminApi.uploadMedia(file, editFormData.imageAltText || editingService?.name, editingService?.id);
      setEditFormData((prev) => ({
        ...prev,
        imageUrl: uploaded.publicUrl,
        imageAltText: prev.imageAltText || uploaded.altText || editingService?.name || '',
      }));
      setModalFeedback({ type: 'success', message: 'Image uploaded and linked successfully.' });
    } catch (err: unknown) {
      setModalFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Image upload failed.',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSaving(true);
    setModalFeedback(null);

    const benefitsArray = benefitsInput
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const payload = {
      shortDescription: editFormData.shortDescription,
      fullDescription: editFormData.fullDescription,
      whoItIsFor: editFormData.whoItIsFor,
      generalBenefits: benefitsArray,
      priceAmount: editFormData.priceAmount ? Number(editFormData.priceAmount) : undefined,
      currencyCode: editFormData.currencyCode,
      priceDisplayMode: Number(editFormData.priceDisplayMode),
      priceNote: editFormData.priceNote.trim() || undefined,
      imageUrl: editFormData.imageUrl.trim() || undefined,
      imageAltText: editFormData.imageAltText.trim() || undefined,
      isPublished: editFormData.isPublished,
    };

    try {
      await adminApi.updateService(editingService.id, payload);
      setModalFeedback({ type: 'success', message: 'Service updated successfully!' });
      // Refresh list
      await fetchServices();
      setTimeout(() => {
        setEditingService(null);
      }, 700);
    } catch (err: unknown) {
      setModalFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save changes.',
      });
    } finally {
      setSaving(false);
    }
  };

  const getComputedPriceLabel = () => {
    const mode = Number(editFormData.priceDisplayMode);
    const amt = editFormData.priceAmount;
    const cur = editFormData.currencyCode || 'PKR';
    if (mode === 2 && amt) return `${cur} ${amt.toLocaleString()}`;
    if (mode === 3 && amt) return `Starting from ${cur} ${amt.toLocaleString()}`;
    if (mode === 1) return 'Consultation Required';
    return 'Contact Clinic';
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif-editorial font-bold text-slate-900 tracking-tight">
            Services & Pricing Management
          </h1>
          <p className="text-sm text-slate-500">
            Control the 10 canonical dental procedures, live pricing, clinical details, and photo assets displayed on the public website.
          </p>
        </div>
        <button
          onClick={fetchServices}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Notice on Canonical Service Integrity */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Canonical 10-Service Integrity</p>
          <p className="text-blue-700 mt-0.5">
            The clinic’s 10 dental offerings maintain strict ordering and stable system identifiers. You can safely modify prices, display modes, clinical descriptions, and high-resolution imagery without breaking appointment booking ties.
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to load services</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <div className="inline-flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Loading dental catalogue...</span>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            No services found. Ensure database migrations and canonical seeding have run.
          </div>
        ) : (
          services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-blue-400 transition-all group"
            >
              <div>
                {/* Card Top Banner with Image & Order Badge (Bright & clean, no heavy black overlay) */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={getFullImageUrl(svc.imageUrl)}
                    alt={svc.imageAltText || svc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-black shadow">
                      #{svc.displayOrder}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur text-slate-200 text-xs font-semibold border border-white/10">
                      {svc.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {svc.isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur text-white text-xs font-bold shadow">
                        <CheckCircle className="w-3.5 h-3.5" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/90 backdrop-blur text-white text-xs font-bold shadow">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-serif-editorial font-bold text-white leading-tight">
                      {svc.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {svc.shortDescription}
                  </p>

                  {/* Pricing Pill */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Website Pricing Display
                      </span>
                      <div className="text-sm font-extrabold text-blue-900 mt-0.5">
                        {svc.priceDisplay || 'Consultation Required'}
                      </div>
                      {svc.priceNote && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5">
                          {svc.priceNote}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Mode
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {svc.priceDisplayModeName}
                      </span>
                    </div>
                  </div>

                  {/* Benefits */}
                  {svc.generalBenefits && svc.generalBenefits.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {svc.generalBenefits.slice(0, 3).map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded-md"
                        >
                          ✓ {b}
                        </span>
                      ))}
                      {svc.generalBenefits.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[11px] rounded-md">
                          +{svc.generalBenefits.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-400">
                  Key: {svc.stableKey}
                </span>

                <button
                  onClick={() => handleOpenEdit(svc)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Pricing & Media
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                  Service #{editingService.displayOrder} Configuration
                </span>
                <h3 className="text-xl font-serif-editorial font-bold text-white mt-0.5">
                  {editingService.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {modalFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    modalFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {modalFeedback.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{modalFeedback.message}</span>
                </div>
              )}

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row items-center gap-4 shadow-inner">
                {editFormData.imageUrl ? (
                  <img
                    src={getFullImageUrl(editFormData.imageUrl)}
                    alt="Preview"
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-white/20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold text-blue-400">
                    Live Public Website Preview
                  </span>
                  <h4 className="text-base font-bold text-white">{editingService.name}</h4>
                  <div className="text-sm font-extrabold text-amber-300 mt-0.5">
                    {getComputedPriceLabel()}
                    {editFormData.priceNote && (
                      <span className="text-xs text-slate-300 font-normal ml-1.5">
                        ({editFormData.priceNote})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-600" /> Pricing Architecture
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Display Mode
                    </label>
                    <select
                      value={editFormData.priceDisplayMode}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, priceDisplayMode: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>Consultation Required</option>
                      <option value={2}>Fixed Amount</option>
                      <option value={3}>Starting From</option>
                      <option value={0}>Contact Clinic / Unset</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price Amount (PKR)
                    </label>
                    <input
                      type="number"
                      step="500"
                      min="0"
                      value={editFormData.priceAmount !== undefined ? editFormData.priceAmount : ''}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          priceAmount: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="e.g. 5000"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price Note / Details
                    </label>
                    <input
                      type="text"
                      value={editFormData.priceNote}
                      onChange={(e) => setEditFormData({ ...editFormData, priceNote: e.target.value })}
                      placeholder="e.g. Per jaw, Per tooth"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Imagery Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" /> Photo & Asset Configuration
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Upload New Image from Computer
                    </label>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-dashed border-blue-400 rounded-xl text-xs font-semibold text-blue-700 cursor-pointer hover:bg-blue-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading image...' : 'Choose JPEG, PNG or WebP'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Public Image URL
                    </label>
                    <input
                      type="text"
                      value={editFormData.imageUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                      placeholder="/services/service1.jpg"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Image Accessibility Alt Text
                  </label>
                  <input
                    type="text"
                    value={editFormData.imageAltText}
                    onChange={(e) => setEditFormData({ ...editFormData, imageAltText: e.target.value })}
                    placeholder="Clinical dental photography of procedure..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Descriptions & Clinical Copy */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Short Description (Used in cards & previews)
                  </label>
                  <textarea
                    rows={2}
                    value={editFormData.shortDescription}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, shortDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Clinical Description (Used on detailed Services page)
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.fullDescription}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, fullDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Who It Is For (Patient Eligibility / Symptoms)
                  </label>
                  <input
                    type="text"
                    value={editFormData.whoItIsFor}
                    onChange={(e) => setEditFormData({ ...editFormData, whoItIsFor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinical Benefits (One benefit per line)
                  </label>
                  <textarea
                    rows={3}
                    value={benefitsInput}
                    onChange={(e) => setBenefitsInput(e.target.value)}
                    placeholder="Painless modern technique&#10;Preserves natural bone structure&#10;Immediate aesthetic improvement"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isPublishedCheck"
                    checked={editFormData.isPublished}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, isPublished: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="isPublishedCheck" className="text-xs font-semibold text-slate-700">
                    Publish this service publicly on the website
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving Changes...' : 'Save & Update Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
