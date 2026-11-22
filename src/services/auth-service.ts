/**
 * Admin Authentication Boundary & Role-Based Authorization
 * Architecture-ready integration layer for NextAuth.js / Auth.js / Supabase Auth.
 */

export type AdminRole = "owner" | "admin" | "operator" | "viewer";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatarUrl?: string;
}

export interface AdminSession {
  user: AdminUser;
  expiresAt: number;
  isDevelopmentPrototype: boolean;
}

const SESSION_STORAGE_KEY = "newtronlabs_admin_dev_session";

export interface IAuthService {
  getCurrentSession(): Promise<AdminSession | null>;
  loginDevelopment(email: string, role?: AdminRole): Promise<AdminSession>;
  logout(): Promise<void>;
  hasPermission(role: AdminRole, requiredRole: AdminRole): boolean;
}

class AuthService implements IAuthService {
  async getCurrentSession(): Promise<AdminSession | null> {
    if (typeof window === "undefined") return null;

    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;
      const session = JSON.parse(stored) as AdminSession;
      if (session.expiresAt < Date.now()) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  async loginDevelopment(email: string, role: AdminRole = "admin"): Promise<AdminSession> {
    const session: AdminSession = {
      user: {
        id: `usr-${Date.now().toString(36)}`,
        email: email.trim().toLowerCase(),
        name: email.split("@")[0] || "Workshop Admin",
        role,
      },
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
      isDevelopmentPrototype: true,
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }

    return session;
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  hasPermission(currentRole: AdminRole, requiredRole: AdminRole): boolean {
    const hierarchy: Record<AdminRole, number> = {
      owner: 4,
      admin: 3,
      operator: 2,
      viewer: 1,
    };
    return (hierarchy[currentRole] || 0) >= (hierarchy[requiredRole] || 0);
  }
}

export const authService = new AuthService();
