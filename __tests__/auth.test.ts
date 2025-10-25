/**
 * @jest-environment node
 */

import { NextResponse } from 'next/server';
import { isAuthenticated, requireAuth } from '@/lib/auth';

// Mock iron-session
jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

describe('Authentication Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', async () => {
      const mockCookies = {};
      const mockSession = { isLoggedIn: true };

      (cookies as jest.Mock).mockResolvedValue(mockCookies);
      (getIronSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await isAuthenticated();

      expect(result).toBe(true);
      expect(cookies).toHaveBeenCalled();
      expect(getIronSession).toHaveBeenCalledWith(mockCookies, expect.any(Object));
    });

    it('should return false when user is not logged in', async () => {
      const mockCookies = {};
      const mockSession = { isLoggedIn: false };

      (cookies as jest.Mock).mockResolvedValue(mockCookies);
      (getIronSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false when session is undefined', async () => {
      const mockCookies = {};
      const mockSession = {};

      (cookies as jest.Mock).mockResolvedValue(mockCookies);
      (getIronSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      (cookies as jest.Mock).mockRejectedValue(new Error('Cookie error'));

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('requireAuth', () => {
    it('should return null when user is authenticated', async () => {
      const mockCookies = {};
      const mockSession = { isLoggedIn: true };

      (cookies as jest.Mock).mockResolvedValue(mockCookies);
      (getIronSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await requireAuth();

      expect(result).toBeNull();
    });

    it('should return 401 response when user is not authenticated', async () => {
      const mockCookies = {};
      const mockSession = { isLoggedIn: false };

      (cookies as jest.Mock).mockResolvedValue(mockCookies);
      (getIronSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await requireAuth();

      expect(result).toBeInstanceOf(NextResponse);

      if (result) {
        expect(result.status).toBe(401);
        const json = await result.json();
        expect(json.error).toBe('Unauthorized');
      }
    });
  });
});
