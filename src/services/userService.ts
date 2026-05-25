import apiClient from './apiClient';
import { User, UserRole } from '@/src/types.ts';

export const userService = {
  /**
   * Fetch and parse the users list from the backend
   */
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get('/admin/users', {
      params: {
        _cb: Date.now(),
        page: 0,
        size: 100,
      },
    });

    const data = response.data;
    
    // Resilient parsing logic to handle diverse potential backend list formats
    let rawList: any[] = [];
    if (data) {
      if (data.data?.content && Array.isArray(data.data.content)) {
        rawList = data.data.content;
      } else if (data.content && Array.isArray(data.content)) {
        rawList = data.content;
      } else if (Array.isArray(data.data)) {
        rawList = data.data;
      } else if (Array.isArray(data)) {
        rawList = data;
      } else if (data.users && Array.isArray(data.users)) {
        rawList = data.users;
      } else if (data.employees && Array.isArray(data.employees)) {
        rawList = data.employees;
      }
    }

    // Map raw list objects to the structured User interface
    return rawList.map((item: any, idx: number) => {
      const id = item.id || item._id || String(idx + 1);
      const firstName = item.firstName || '';
      const lastName = item.lastName || '';
      const name = item.name || `${firstName} ${lastName}`.trim() || item.email?.split('@')[0] || `Staff #${id}`;
      const email = item.email || '';
      const userId = item.userId || item.employeeId || item.id || `US-${id}`;
      
      let role = UserRole.USER;
      if (item.role) {
        const r = String(item.role).toUpperCase();
        if (r === 'SUPER_ADMIN' || r === 'SUPERADMIN') {
          role = UserRole.SUPER_ADMIN;
        } else if (r === 'ADMIN') {
          role = UserRole.ADMIN;
        } else if (r === 'SITE_ADMIN' || r === 'SITEADMIN') {
          role = UserRole.SITE_ADMIN;
        } else if (r === 'HO_USER' || r === 'HOUSER') {
          role = UserRole.HO_USER;
        }
      }

      return {
        id,
        userId,
        name,
        email,
        role,
        status: item.isActive === false || item.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      };
    });
  },
};
