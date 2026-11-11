import React, { useState, useEffect } from 'react';
import { adminApi, type ClinicSettings } from '../../services/adminApi';
import {
  Mail,
  Server,
  Send,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Info
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test Email State
    const [testEmailRecipient, setTestEmailRecipient] = useState('dentalloungemansehra@gmail.com');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getSettings();
      setSettings(data);
      if (data.notificationRecipient) {
        setTestEmailRecipient(data.notificationRecipient);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve clinic configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingTest(true);
    setTestResult(null);

    try {
      await adminApi.testEmail(testEmailRecipient.trim());
      setTestResult({
        type: 'success',
        message: `Test email dispatched successfully to ${testEmailRecipient.trim()}. Please inspect your inbox / spam folder.`,
      });
    } catch (err: unknown) {
      setTestResult({
        type: 'error',
        message: err instanceof Error ? err.message : 'SMTP dispatch failed. Verify Gmail App Password configuration in appsettings.json or environment variables.',
      });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif-editorial font-bold text-slate-900 tracking-tight">
            System & Clinic Settings
          </h1>
          <p className="text-sm text-slate-500">
            View practice operational details, inspect SMTP notification gateway status, and trigger test dispatches.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to load settings</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Grid: Clinic Details & SMTP Gateway */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Identity Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" /> Practice Identity & Contact
          </h2>

          <div className="space-y-3 divide-y divide-slate-100 text-sm">
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 text-xs">Official Practice Name</span>
              <span className="font-bold text-slate-900 text-xs">
                {settings?.clinicName || 'Mansehra Dental Lounge'}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 text-xs">Clinical Address</span>
              <span className="font-medium text-slate-900 text-xs text-right max-w-xs">
                {settings?.address || 'Biotech Medical Center, Opposite King Abdullah Teaching Hospital'}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 text-xs">City / Region</span>
              <span className="font-semibold text-slate-900 text-xs">
                {settings?.city || 'Mansehra, Khyber Pakhtunkhwa'}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 text-xs">Primary Phone</span>
              <a
                href={`tel:${settings?.phone || '03482226228'}`}
                className="font-mono font-bold text-blue-600 text-xs hover:underline"
              >
                {settings?.phone || '03482226228'}
              </a>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 text-xs">Public Email</span>
              <span className="font-medium text-slate-900 text-xs font-mono">
                {settings?.email || 'dentalloungemansehra@gmail.com'}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 text-xs">Operational Hours</span>
              <span className="font-medium text-slate-900 text-xs">
                {settings?.openingHours || 'Monday - Saturday: 3:00 PM – 9:00 PM'}
              </span>
            </div>
          </div>
        </div>

        {/* Email Notification Dispatch Gateway */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" /> Transactional MailKit SMTP
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  settings?.smtpConfigured
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {settings?.smtpConfigured ? 'Gateway Active' : 'Configuration Required'}
              </span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 text-sm">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 text-xs">SMTP Host Server</span>
                <span className="font-mono font-semibold text-slate-900 text-xs">
                  {settings?.smtpHost || 'smtp.gmail.com'}
                </span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 text-xs">SMTP Port</span>
                <span className="font-mono font-semibold text-slate-900 text-xs">
                  {settings?.smtpPort || 587} (STARTTLS)
                </span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 text-xs">Dispatch Sender Account</span>
                <span className="font-mono font-semibold text-slate-900 text-xs">
                  {settings?.smtpSender || 'romeobaloh003@gmail.com'}
                </span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 text-xs">Practice Notification Inbox</span>
                <span className="font-mono font-bold text-blue-900 text-xs">
                                  {settings?.notificationRecipient || 'dentalloungemansehra@gmail.com'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-start gap-2 text-[11px] text-slate-500">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                All new appointment alerts are sent directly to the practice notification recipient via resilient Transactional Outbox background processing.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive SMTP Diagnostic Tool */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-600" /> Send Live Verification Test Email
        </h2>
        <p className="text-xs text-slate-500">
          Trigger an immediate test email through MailKit to verify that your SMTP host credentials and network ports are operating smoothly.
        </p>

        {testResult && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium flex items-start gap-2.5 ${
              testResult.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{testResult.type === 'success' ? 'Delivery Succeeded' : 'Delivery Failed'}</p>
              <p className="mt-0.5 leading-relaxed">{testResult.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Test Recipient Email
            </label>
            <input
              type="email"
              required
              value={testEmailRecipient}
              onChange={(e) => setTestEmailRecipient(e.target.value)}
              placeholder="dentalloungemansehra@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={sendingTest}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {sendingTest ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Dispatching SMTP Test...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Test Email</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
