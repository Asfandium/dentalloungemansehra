import { clinicConfig } from '../config/clinicConfig';

const API_BASE = clinicConfig.apiBaseUrl
  ? clinicConfig.apiBaseUrl.replace(/\/$/, '')
  : ''; // Use relative root with Vite proxy or production reverse proxy

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'SuperAdmin' | 'Admin' | 'Helper';
  isActive: boolean;
  createdAtUtc: string;
  lastLoginAtUtc?: string;
}

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  contactedAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  notificationFailures: number;
  totalPublishedServices: number;
  recentAppointments: Array<{
    id: string;
    name: string;
    appointmentDate: string;
    contactNumber: string;
    status: string;
    services: string[];
    createdAtUtc: string;
  }>;
}

export interface AdminAppointment {
  id: string;
  name: string;
  gender: string;
  appointmentDate: string;
  contactNumber: string;
  email?: string;
  message?: string;
  status: number;
  statusName: string;
  services: string[];
  createdAtUtc: string;
  notificationStatus: number;
  notifications?: Array<{
    id: string;
    channel: string;
    recipient: string;
    status: number;
    attemptCount: number;
    lastAttemptUtc?: string;
    errorMessage?: string;
  }>;
}

export interface AdminService {
  id: string;
  stableKey: string;
  displayOrder: number;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  whoItIsFor: string;
  generalBenefits: string[];
  priceAmount?: number;
  currencyCode: string;
  priceDisplayMode: number;
  priceDisplayModeName: string;
  priceDisplay: string;
  priceNote?: string;
  imageUrl: string;
  imageAltText: string;
  isPublished: boolean;
}

export interface MediaItem {
  id: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  width?: number;
  height?: number;
  altText: string;
  publicUrl: string;
  createdAtUtc: string;
  serviceName?: string;
}

export interface AuditLogItem {
  id: string;
  userEmail?: string;
  action: string;
  entityName: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  timestampUtc: string;
}

export interface ClinicSettings {
  clinicName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  openingHours: string;
  googleMapsDirectUrl: string;
  smtpConfigured: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSender: string;
  notificationRecipient: string;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('dl_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const headers = {
    Accept: 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('dl_admin_token');
    localStorage.removeItem('dl_admin_user');
    if (!window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = json?.message || json?.title || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return (json?.data !== undefined ? json.data : json) as T;
}

export const adminApi = {
  // Auth
  async login(email: string, password: string) {
    const res = await request<{ token: string; user: AdminUser }>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('dl_admin_token', res.token);
    localStorage.setItem('dl_admin_user', JSON.stringify(res.user));
    return res;
  },

  async getMe() {
    return request<AdminUser>('/api/auth/me');
  },

  logout() {
    request('/api/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('dl_admin_token');
    localStorage.removeItem('dl_admin_user');
  },

  // Dashboard
  async getDashboard() {
    return request<DashboardStats>('/api/admin/dashboard');
  },

  // Appointments
  async getAppointments(params: {
    search?: string;
    status?: number;
    pageNumber?: number;
    pageSize?: number;
  } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status.toString());
    if (params.pageNumber) query.set('pageNumber', params.pageNumber.toString());
    if (params.pageSize) query.set('pageSize', params.pageSize.toString());

    return request<{
      items: AdminAppointment[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>(`/api/admin/appointments?${query.toString()}`);
  },

  async getAppointment(id: string) {
    return request<AdminAppointment>(`/api/admin/appointments/${id}`);
  },

  async updateAppointmentStatus(id: string, status: number, notes?: string) {
    return request(`/api/admin/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
  },

  async deleteAppointment(id: string) {
    return request(`/api/admin/appointments/${id}`, { method: 'DELETE' });
  },

  async retryNotification(id: string) {
    return request(`/api/admin/appointments/${id}/retry-notification`, { method: 'POST' });
  },

  // Services
  async getServices() {
    return request<AdminService[]>('/api/admin/services');
  },

  async updateService(id: string, payload: {
    shortDescription: string;
    fullDescription: string;
    whoItIsFor: string;
    generalBenefits: string[];
    priceAmount?: number;
    currencyCode: string;
    priceDisplayMode: number;
    priceNote?: string;
    imageUrl?: string;
    imageAltText?: string;
    isPublished: boolean;
  }) {
    return request(`/api/admin/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  // Media
  async uploadMedia(file: File, altText?: string, serviceId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('altText', altText);
    if (serviceId) formData.append('serviceId', serviceId);

    const token = localStorage.getItem('dl_admin_token');
    const response = await fetch(`${API_BASE}/api/admin/media/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.message || 'File upload failed');
    }
    return json?.data;
  },

  async getMediaList(pageNumber = 1, pageSize = 20) {
    return request<{
      items: MediaItem[];
      totalCount: number;
      pageNumber: number;
      totalPages: number;
    }>(`/api/admin/media?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },

  async deleteMedia(id: string) {
    return request(`/api/admin/media/${id}`, { method: 'DELETE' });
  },

  // Staff (SuperAdmin)
  async getStaff() {
    return request<AdminUser[]>('/api/admin/staff');
  },

  async createStaff(payload: { email: string; fullName: string; password: string; role: string }) {
    return request('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  async toggleStaffStatus(id: string, isActive: boolean, fullName: string, role: string) {
    return request(`/api/admin/staff/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive, fullName, role }),
    });
  },

  async resetStaffPassword(id: string, newPassword: string) {
    return request(`/api/admin/staff/${id}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });
  },

  async deleteStaff(id: string) {
    return request(`/api/admin/staff/${id}`, { method: 'DELETE' });
  },

  // Audit Logs (SuperAdmin)
  async getAuditLogs(pageNumber = 1, pageSize = 20) {
    return request<{
      items: AuditLogItem[];
      totalCount: number;
      pageNumber: number;
      totalPages: number;
    }>(`/api/admin/audit-logs?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },

  // Settings
  async getSettings() {
    return request<ClinicSettings>('/api/admin/settings');
  },

  async testEmail(recipientEmail: string) {
    return request('/api/admin/settings/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail }),
    });
  },
};
