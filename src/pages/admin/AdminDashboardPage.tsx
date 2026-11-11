import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, type DashboardStats } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  MailWarning,
  Eye,
  ShieldAlert
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getDashboard();
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('pending')) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">Pending</span>;
    }
    if (s.includes('contacted')) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">Contacted</span>;
    }
    if (s.includes('confirmed')) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">Confirmed</span>;
    }
    if (s.includes('completed')) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">Completed</span>;
    }
    if (s.includes('cancelled')) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">Cancelled</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif-editorial font-bold text-slate-900 tracking-tight">
            Clinic Overview
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back, <span className="font-semibold text-slate-800">{user?.fullName}</span>. Here is today's practice summary for Mansehra Dental Lounge.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Notification Outbox Failure Alert Banner */}
      {stats && stats.notificationFailures > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-200 rounded-xl text-amber-800">
              <MailWarning className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-900">
                {stats.notificationFailures} Email Alert{stats.notificationFailures > 1 ? 's' : ''} Pending Delivery
              </h2>
              <p className="text-xs text-amber-700 mt-0.5">
                The appointment records are saved safely in the database. SMTP notification attempts will automatically retry or can be re-triggered manually.
              </p>
            </div>
          </div>
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl shadow transition-colors shrink-0"
          >
            View Appointments
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to fetch dashboard statistics</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Bookings
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalAppointments ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Lifetime patient requests recorded</p>
          </div>
        </div>

        {/* Pending Action */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 font-bold">
              Pending Action
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-600">
              {loading ? '...' : stats?.pendingAppointments ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Awaiting clinic staff confirmation</p>
          </div>
        </div>

        {/* Confirmed / Contacted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Confirmed / Ready
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-700">
              {loading ? '...' : stats?.confirmedAppointments ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              +{stats?.contactedAppointments ?? 0} patient(s) contacted
            </p>
          </div>
        </div>

        {/* Services Active */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Catalogue Active
            </span>
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-indigo-900">
              {loading ? '...' : stats?.totalPublishedServices ?? 10} / 10
            </div>
            <p className="text-xs text-slate-500 mt-1">Published clinical dental services</p>
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Appointment Requests</h2>
            <p className="text-xs text-slate-500">Latest online bookings submitted through the public website.</p>
          </div>
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">Preferred Date</th>
                <th className="px-5 py-3.5">Contact Phone</th>
                <th className="px-5 py-3.5">Requested Treatments</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading recent records...</span>
                    </div>
                  </td>
                </tr>
              ) : !stats?.recentAppointments || stats.recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No appointments recorded yet. New submissions will appear here automatically.
                  </td>
                </tr>
              ) : (
                stats.recentAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      {appt.name}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-700 whitespace-nowrap">
                      {appt.appointmentDate}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                      {appt.contactNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {appt.services && appt.services.length > 0 ? (
                          appt.services.map((svc, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
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
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/appointments?search=${encodeURIComponent(appt.contactNumber)}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
