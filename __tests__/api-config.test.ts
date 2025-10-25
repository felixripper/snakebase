/**
 * @jest-environment node
 */

import { GET, PUT, POST } from '@/app/api/config/route';
import { NextRequest } from 'next/server';

// Mock auth
jest.mock('@/lib/auth', () => ({
  requireAuth: jest.fn(),
}));

import { requireAuth } from '@/lib/auth';

// Mock environment
process.env.UPSTASH_REST_URL = 'https://test.upstash.io';
process.env.UPSTASH_REST_TOKEN = 'test-token';

// Mock fetch for Upstash
global.fetch = jest.fn();

describe('/api/config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/config', () => {
    it('should return default config when Redis returns null', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [{ result: null }],
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('backgroundColor');
      expect(data).toHaveProperty('snakeColor');
      expect(data.backgroundColor).toBe('#0052FF');
    });

    it('should return stored config from Redis', async () => {
      const storedConfig = {
        backgroundColor: '#FF0000',
        snakeColor: '#00FF00',
        foodColor: '#0000FF',
        snakeSpeed: 8,
        pointsPerFood: 50,
        interfaceTitle: 'Test Game',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [{ result: JSON.stringify(storedConfig) }],
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(storedConfig);
    });
  });

  describe('POST /api/config', () => {
    it('should require authentication', async () => {
      const mockAuthError = new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
      (requireAuth as jest.Mock).mockResolvedValueOnce(mockAuthError);

      const request = new NextRequest('http://localhost:3000/api/config', {
        method: 'POST',
        body: JSON.stringify({ backgroundColor: '#FF0000' }),
      });

      const response = await POST(request);

      expect(requireAuth).toHaveBeenCalled();
      expect(response.status).toBe(401);
    });

    it('should validate and save config when authenticated', async () => {
      (requireAuth as jest.Mock).mockResolvedValueOnce(null);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [{ result: 'OK' }],
      });

      const newConfig = {
        backgroundColor: '#FF0000',
        snakeColor: '#00FF00',
        foodColor: '#0000FF',
        snakeSpeed: 8,
        pointsPerFood: 50,
        interfaceTitle: 'Test',
      };

      const request = new NextRequest('http://localhost:3000/api/config', {
        method: 'POST',
        body: JSON.stringify(newConfig),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(newConfig);
    });

    it('should reject invalid color format', async () => {
      (requireAuth as jest.Mock).mockResolvedValueOnce(null);

      const invalidConfig = {
        backgroundColor: 'invalid-color',
      };

      const request = new NextRequest('http://localhost:3000/api/config', {
        method: 'POST',
        body: JSON.stringify(invalidConfig),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should reject invalid speed', async () => {
      (requireAuth as jest.Mock).mockResolvedValueOnce(null);

      const invalidConfig = {
        snakeSpeed: 100, // Max is 30
      };

      const request = new NextRequest('http://localhost:3000/api/config', {
        method: 'POST',
        body: JSON.stringify(invalidConfig),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/config', () => {
    it('should require authentication', async () => {
      const mockAuthError = new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
      (requireAuth as jest.Mock).mockResolvedValueOnce(mockAuthError);

      const request = new NextRequest('http://localhost:3000/api/config', {
        method: 'PUT',
        body: JSON.stringify({ backgroundColor: '#FF0000' }),
      });

      const response = await PUT(request);

      expect(requireAuth).toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });
});
