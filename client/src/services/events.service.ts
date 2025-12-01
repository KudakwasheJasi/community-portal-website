import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  maxAttendees: number;
  organizerId: string;
  organizer?: {
    id: string;
    name: string;
    email: string;
  };
  registrations?: {
    id: string;
    userId: string;
    registeredAt: string;
  }[];
  status?: 'open' | 'registered' | 'closed';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  event?: Event;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateEventData {
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
  description?: string;
  maxAttendees?: number;
  imageUrl?: string;
}

export const eventsService = {
  async getAll(): Promise<Event[]> {
    const response = await api.get('/events');
    return response.data;
  },

  async getById(id: string): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async create(data: CreateEventData): Promise<Event> {
    const response = await api.post('/events', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateEventData>): Promise<Event> {
    const response = await api.patch(`/events/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },

  async registerForEvent(eventId: string): Promise<EventRegistration> {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  async unregisterFromEvent(eventId: string): Promise<void> {
    await api.delete(`/events/${eventId}/register`);
  },

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  },

  async getUserRegistrations(): Promise<EventRegistration[]> {
    const response = await api.get('/events/user/registrations');
    return response.data;
  },
};

export default eventsService;