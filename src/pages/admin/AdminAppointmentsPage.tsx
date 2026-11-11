import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi, type AdminAppointment } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Send,
  X,
  AlertTriangle
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: '0', label: 'Pending' },
  { value: '1', label: 'Contacted' },
  { value: '2', label: 'Confirmed' },
  { value: '3', label: 'Completed' },
  { value: '4', label: 'Cancelled' },
];

export const AdminAppointmentsPage: React.FC = () => {
  const { isSuperAdmin, isAdmin } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected appointment for details modal
  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<number>(0);
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [retryingEmail, setRetryingEmail] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Delete modal state
  const [appointmentToDelete, setAppointmentToDelete] = useState<AdminAppointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAppointments({
        search: searchTerm.trim() || undefined,
        status: statusFilter !== '' ? parseInt(statusFilter, 10) : undefined,
        pageNumber,
        pageSize,
      });
      setAppointments(res.items);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, pageNumber, pageSize]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Sync search URL query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    const params: Record<string, string> = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (statusFilter) params.status = statusFilter;
    setSearchParams(params);
    fetchAppointments();
  };

  const handleOpenDetail = async (appt: AdminAppointment) => {
    setSelectedAppointment(appt);
    setNewStatus(appt.status);
    setStatusNotes('');
    setModalFeedback(null);
    setIsDetailOpen(true);

    // Fetch full appointment with notifications outbox
    try {
      const full = await adminApi.getAppointment(appt.id);
      setSelectedAppointment(full);
      setNewStatus(full.status);
    } catch {
      // ignore
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedAppointment) return;
    setUpdatingStatus(true);
    setModalFeedback(null);
    try {
      await adminApi.updateAppointmentStatus(selectedAppointment.id, newStatus, statusNotes.trim() || undefined);
      setModalFeedback({ type: 'success', message: 'Appointment status updated successfully.' });
      // Update in state
      setAppointments((prev) =>
        prev.map((a) => (a.id === selectedAppointment.id ? { ...a, status: newStatus } : a))
      );
      setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err: unknown) {
      setModalFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update status.',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRetryEmail = async () => {
    if (!selectedAppointment) return;
    setRetryingEmail(true);
    setModalFeedback(null);
    try {
      await adminApi.retryNotification(selectedAppointment.id);
      setModalFeedback({ type: 'success', message: 'Notification queued for retry delivery.' });
      // Refresh appointment
      const full = await adminApi.getAppointment(selectedAppointment.id);
      setSelectedAppointment(full);
    } catch (err: unknown) {
      setModalFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to retry notification.',
      });
    } finally {
      setRetryingEmail(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteAppointment(appointmentToDelete.id);
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentToDelete.id));
      setTotalCount((c) => Math.max(0, c - 1));
      setAppointmentToDelete(null);
      if (selectedAppointment?.id === appointmentToDelete.id) {
        setIsDetailOpen(false);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete record.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Pending</span>;
      case 1:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Contacted</span>;
      case 2:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Confirmed</span>;
      case 3:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">Completed</span>;
      case 4:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">Unknown</span>;
    }
  };

  const getNotificationBadge = (status: number) => {
    switch (status) {
      case 2: // NotificationStatus.Sent
        return <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium"><CheckCircle className="w-3.5 h-3.5" /> Sent</span>;
      case 3: // NotificationStatus.Failed
        return <span className="inline-flex items-center gap-1 text-xs text-rose-700 font-medium"><AlertCircle className="w-3.5 h-3.5" /> Failed</span>;
      default: // NotificationStatus.Pending (1)
        return <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium"><Clock className="w-3.5 h-3.5" /> Outbox</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif-editorial font-bold text-slate-900 tracking-tight">
            Patient Appointments
          </h1>
          <p className="text-sm text-slate-500">
            Review, filter, confirm, and update clinical bookings submitted by patients.
          </p>
        </div>
        <button
          onClick={fetchAppointments}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Toolbar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, phone number, or notes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[160px]">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPageNumber(1);
              }}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition-colors"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Failed to retrieve appointments</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Preferred Slot</th>
                <th className="px-5 py-3.5">Services</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Notification</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading patient records...</span>
                    </div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No appointments match the current search filters.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{appt.name}</span>
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {appt.gender || 'Not specified'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <a
                            href={`tel:${appt.contactNumber}`}
                            className="font-mono text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {appt.contactNumber}
                          </a>
                          {appt.email && (
                            <span className="truncate max-w-[150px] flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {appt.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-700 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {appt.appointmentDate}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Booked: {new Date(appt.createdAtUtc).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {appt.services && appt.services.length > 0 ? (
                          appt.services.map((svc, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium"
                            >
                              {svc}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">General Consultation</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(appt.status)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getNotificationBadge(appt.notificationStatus)}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(appt)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Manage
                        </button>

                        {(isAdmin || isSuperAdmin) && (
                          <button
                            onClick={() => setAppointmentToDelete(appt)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Appointment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{appointments.length}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalCount}</span> total bookings
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1 || loading}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700">
              Page {pageNumber} of {totalPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
              disabled={pageNumber >= totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Detail & Status Update Drawer / Modal */}
      {isDetailOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                  Patient Booking Record
                </span>
                <h3 className="text-xl font-serif-editorial font-bold text-white mt-0.5">
                  {selectedAppointment.name}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
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

              {/* Patient Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Contact Phone</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <a href={`tel:${selectedAppointment.contactNumber}`} className="hover:underline">
                      {selectedAppointment.contactNumber}
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Preferred Slot</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {selectedAppointment.appointmentDate}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Patient Gender</span>
                  <div className="font-medium text-slate-900 text-sm mt-0.5">
                    {selectedAppointment.gender || 'Not specified'}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Email Address</span>
                  <div className="font-medium text-slate-900 text-sm mt-0.5 truncate">
                    {selectedAppointment.email || 'None provided'}
                  </div>
                </div>
              </div>

              {/* Message / Complaint */}
              {selectedAppointment.message && (
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Patient Chief Complaint / Notes
                  </span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 italic">
                    "{selectedAppointment.message}"
                  </div>
                </div>
              )}

              {/* Requested Services */}
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">
                  Requested Clinical Treatments ({selectedAppointment.services?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedAppointment.services && selectedAppointment.services.length > 0 ? (
                    selectedAppointment.services.map((svc, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold"
                      >
                        {svc}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">General Consultation</span>
                  )}
                </div>
              </div>

              {/* Notification Outbox Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Notification Dispatch
                  </span>
                  <button
                    onClick={handleRetryEmail}
                    disabled={retryingEmail}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${retryingEmail ? 'animate-spin' : ''}`} />
                    <span>{retryingEmail ? 'Queuing...' : 'Re-send / Retry Email'}</span>
                  </button>
                </div>
                {selectedAppointment.notifications && selectedAppointment.notifications.length > 0 ? (
                  selectedAppointment.notifications.map((n) => (
                    <div key={n.id} className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-slate-800 font-medium">{n.recipient}</span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Attempts: {n.attemptCount} {n.lastAttemptUtc && `• Last tried: ${new Date(n.lastAttemptUtc).toLocaleTimeString()}`}
                        </div>
                        {n.errorMessage && (
                          <div className="text-[11px] text-rose-600 mt-0.5">{n.errorMessage}</div>
                        )}
                      </div>
                      <div>
                        {n.status === 2 ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Delivered</span>
                        ) : n.status === 3 ? (
                          <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Failed</span>
                        ) : (
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Queued</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No outbox dispatches recorded.</p>
                )}
              </div>

              {/* Status Update Form */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Update Booking Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Current Lifecycle Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Pending Action</option>
                      <option value={1}>Patient Contacted (Phone/WhatsApp)</option>
                      <option value={2}>Appointment Confirmed</option>
                      <option value={3}>Visit Completed</option>
                      <option value={4}>Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Staff Notes (Recorded in Audit Ledger)
                    </label>
                    <input
                      type="text"
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                      placeholder="e.g. Confirmed over call for 4:30 PM..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDetailOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition-all disabled:opacity-50"
                  >
                    {updatingStatus ? 'Saving...' : 'Save Status Change'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Appointment Record</h3>
            <p className="text-sm text-slate-600 mt-2">
              Are you sure you want to permanently remove the booking for{' '}
              <span className="font-bold text-slate-900">{appointmentToDelete.name}</span> (
              {appointmentToDelete.contactNumber})? This action will be logged in the administrative audit log.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setAppointmentToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
