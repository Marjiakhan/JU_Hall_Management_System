/**
 * API Service Layer for JU Hall Management
 * Configure API_BASE_URL to your external backend endpoint
 */

// Configure this to your external backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP Error: ${response.status}`,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

// =====================================================
// AUTH ENDPOINTS
// =====================================================

export const authApi = {
  // Register student
  registerStudent: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    password: string;
    role: 'student';
  }) => apiRequest('/auth/register/student', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Register supervisor
  registerSupervisor: (data: {
    fullName: string;
    email: string;
    phone: string;
    hallName: string;
    password: string;
    role: 'supervisor';
  }) => apiRequest('/auth/register/supervisor', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Login
  login: (data: {
    email: string;
    password: string;
    role: 'student' | 'supervisor';
  }) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Google OAuth login/register
  googleAuth: (data: {
    googleToken: string;
    role: 'student' | 'supervisor';
  }) => apiRequest('/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get current user
  getCurrentUser: () => apiRequest('/auth/me', {
    method: 'GET',
  }),

  // Logout
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
};

// =====================================================
// FLOORS ENDPOINTS
// =====================================================

export const floorsApi = {
  // Get all floors
  getAll: () => apiRequest('/floors', { method: 'GET' }),

  // Get floors by block
  getByBlock: (blockId: string) => apiRequest(`/floors/block/${blockId}`, { method: 'GET' }),

  // Get single floor
  getById: (floorId: number) => apiRequest(`/floors/${floorId}`, { method: 'GET' }),

  // Create floor (supervisor only)
  create: (data: { name: string; blockId: string }) => 
    apiRequest('/floors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update floor (supervisor only)
  update: (floorId: number, data: { name: string }) =>
    apiRequest(`/floors/${floorId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete floor (supervisor only)
  delete: (floorId: number) => apiRequest(`/floors/${floorId}`, { method: 'DELETE' }),
};

// =====================================================
// ROOMS ENDPOINTS
// =====================================================

export const roomsApi = {
  // Get all rooms
  getAll: () => apiRequest('/rooms', { method: 'GET' }),

  // Get rooms by floor
  getByFloor: (floorId: number) => apiRequest(`/rooms/floor/${floorId}`, { method: 'GET' }),

  // Get single room
  getById: (roomId: number) => apiRequest(`/rooms/${roomId}`, { method: 'GET' }),

  // Create room (supervisor only)
  create: (data: { floorId: number; roomNumber: number; capacity?: number }) =>
    apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update room (supervisor only)
  update: (roomId: number, data: { capacity?: number; isActive?: boolean }) =>
    apiRequest(`/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete room (supervisor only)
  delete: (roomId: number) => apiRequest(`/rooms/${roomId}`, { method: 'DELETE' }),
};

// =====================================================
// STUDENTS ENDPOINTS
// =====================================================

export const studentsApi = {
  // Get all students
  getAll: () => apiRequest('/students', { method: 'GET' }),

  // Search students
  search: (params: {
    query?: string;
    department?: string;
    district?: string;
    batch?: string;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    return apiRequest(`/students/search?${searchParams.toString()}`, { method: 'GET' });
  },

  // Get student by ID
  getById: (studentId: string) => apiRequest(`/students/${studentId}`, { method: 'GET' }),

  // Update student
  update: (studentId: string, data: Partial<{
    name: string;
    phone: string;
    department: string;
    batch: string;
    district: string;
    bloodGroup: string;
    roomId: number;
  }>) => apiRequest(`/students/${studentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete student (supervisor only)
  delete: (studentId: string) => apiRequest(`/students/${studentId}`, { method: 'DELETE' }),
};

// =====================================================
// BLOCKS ENDPOINTS
// =====================================================

export const blocksApi = {
  // Get all blocks
  getAll: () => apiRequest('/blocks', { method: 'GET' }),

  // Get single block
  getById: (blockId: string) => apiRequest(`/blocks/${blockId}`, { method: 'GET' }),

  // Create block (supervisor only)
  create: (data: { name: string; description?: string }) =>
    apiRequest('/blocks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update block (supervisor only)
  update: (blockId: string, data: { name: string; description?: string }) =>
    apiRequest(`/blocks/${blockId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete block (supervisor only)
  delete: (blockId: string) => apiRequest(`/blocks/${blockId}`, { method: 'DELETE' }),
};

// =====================================================
// NOTICES ENDPOINTS
// =====================================================

export const noticesApi = {
  // Get all notices
  getAll: () => apiRequest('/notices', { method: 'GET' }),

  // Get single notice
  getById: (noticeId: number) => apiRequest(`/notices/${noticeId}`, { method: 'GET' }),

  // Create notice (supervisor only)
  create: (data: { title: string; content: string; priority?: string }) =>
    apiRequest('/notices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update notice (supervisor only)
  update: (noticeId: number, data: { title?: string; content?: string; priority?: string }) =>
    apiRequest(`/notices/${noticeId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete notice (supervisor only)
  delete: (noticeId: number) => apiRequest(`/notices/${noticeId}`, { method: 'DELETE' }),
};

// =====================================================
// NOTIFICATIONS ENDPOINTS
// =====================================================

export const notificationsApi = {
  // Get all notifications
  getAll: () => apiRequest('/notifications', { method: 'GET' }),

  // Get unread count for student
  getUnreadCount: (studentId: string) => 
    apiRequest(`/notifications/unread-count/${studentId}`, { method: 'GET' }),

  // Mark notification as read
  markAsRead: (studentId: string, notificationId: number) =>
    apiRequest('/notifications/mark-read', {
      method: 'POST',
      body: JSON.stringify({ studentId, notificationId }),
    }),

  // Mark all as read
  markAllAsRead: (studentId: string) =>
    apiRequest('/notifications/mark-all-read', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    }),
};

// =====================================================
// ATTENDANCE ENDPOINTS
// =====================================================

export const attendanceApi = {
  // Get attendance by student
  getByStudent: (studentId: string, month?: string) => {
    const params = month ? `?month=${month}` : '';
    return apiRequest(`/attendance/student/${studentId}${params}`, { method: 'GET' });
  },

  // Get attendance by date
  getByDate: (date: string, floorId?: number) => {
    const params = floorId ? `?floorId=${floorId}` : '';
    return apiRequest(`/attendance/date/${date}${params}`, { method: 'GET' });
  },

  // Mark attendance (supervisor only)
  mark: (data: {
    studentId: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    remarks?: string;
  }) => apiRequest('/attendance/mark', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Bulk mark attendance (supervisor only)
  bulkMark: (data: {
    date: string;
    attendance: Array<{
      studentId: string;
      status: 'present' | 'absent' | 'late';
      remarks?: string;
    }>;
  }) => apiRequest('/attendance/bulk-mark', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get attendance summary
  getSummary: (studentId: string) => 
    apiRequest(`/attendance/summary/${studentId}`, { method: 'GET' }),
};

// =====================================================
// EMERGENCY ENDPOINTS
// =====================================================

export const emergencyApi = {
  // Submit emergency request
  submit: (data: {
    studentId?: string;
    studentName?: string;
    emergencyType: string;
    location: string;
    roomNumber?: string;
    floor?: string;
    contactNumber: string;
    description?: string;
  }) => apiRequest('/emergency/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get all emergencies (supervisor only)
  getAll: () => apiRequest('/emergency', { method: 'GET' }),

  // Update emergency status (supervisor only)
  updateStatus: (emergencyId: number, data: { status: string; resolvedBy?: string }) =>
    apiRequest(`/emergency/${emergencyId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// =====================================================
// CONTACT ENDPOINTS
// =====================================================

export const contactApi = {
  // Submit contact form
  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => apiRequest('/contact/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get all submissions (supervisor only)
  getAll: () => apiRequest('/contact', { method: 'GET' }),

  // Respond to submission (supervisor only)
  respond: (submissionId: number, data: { response: string }) =>
    apiRequest(`/contact/${submissionId}/respond`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export default {
  auth: authApi,
  floors: floorsApi,
  rooms: roomsApi,
  students: studentsApi,
  blocks: blocksApi,
  notices: noticesApi,
  notifications: notificationsApi,
  attendance: attendanceApi,
  emergency: emergencyApi,
  contact: contactApi,
};
