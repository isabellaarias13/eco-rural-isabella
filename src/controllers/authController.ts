import { modelStore } from '../models/store';
import { User, UserRole } from '../types';

export class AuthController {
  public static login(emailOrDocument: string, _password?: string): { success: boolean; user?: User; message?: string } {
    const cleanQuery = emailOrDocument.trim().toLowerCase();
    const users = modelStore.getUsers();

    const matchedUser = users.find(
      u => u.email.toLowerCase() === cleanQuery || u.documentId.replace(/\D/g, '') === cleanQuery.replace(/\D/g, '')
    );

    if (matchedUser) {
      modelStore.setCurrentUser(matchedUser);
      return { success: true, user: matchedUser };
    }

    // Default fallback demo user creation if not found
    const demoUser: User = {
      id: `usr-${Date.now()}`,
      name: emailOrDocument.includes('@') ? emailOrDocument.split('@')[0] : `Usuario Rural ${emailOrDocument}`,
      email: emailOrDocument.includes('@') ? emailOrDocument : `${emailOrDocument}@purificacion.gov.co`,
      documentId: '1.108.923.400',
      vereda: 'Chenche Asoleado',
      phone: '314 555 0192',
      role: 'habitante'
    };
    modelStore.addUser(demoUser);
    return { success: true, user: demoUser };
  }

  public static register(data: {
    name: string;
    email: string;
    documentId: string;
    vereda: string;
    phone: string;
    role: UserRole;
  }): { success: boolean; user: User } {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      documentId: data.documentId.trim(),
      vereda: data.vereda,
      phone: data.phone.trim(),
      role: data.role
    };

    modelStore.addUser(newUser);
    return { success: true, user: newUser };
  }

  public static logout(): void {
    modelStore.setCurrentUser(null);
  }

  public static switchDemoRole(role: UserRole): User | undefined {
    const users = modelStore.getUsers();
    const userWithRole = users.find(u => u.role === role);
    if (userWithRole) {
      modelStore.setCurrentUser(userWithRole);
      return userWithRole;
    }
    return undefined;
  }
}
