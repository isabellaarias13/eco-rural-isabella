import { modelStore } from '../models/store';
import { User, UserRole } from '../types';

export class AuthController {
  public static login(emailOrDocument: string, password?: string): { success: boolean; user?: User; message?: string } {
    const cleanQuery = emailOrDocument.trim().toLowerCase();
    const cleanNumbers = cleanQuery.replace(/\D/g, '');
    const users = modelStore.getUsers();

    const matchedUser = users.find(u => {
      const uEmail = (u.email || '').toLowerCase();
      const uDocNumbers = u.documentId.replace(/\D/g, '');
      const uPhone = u.phone.replace(/\D/g, '');

      return (
        (cleanQuery && uEmail === cleanQuery) ||
        (cleanNumbers.length > 3 && (uDocNumbers === cleanNumbers || uPhone === cleanNumbers)) ||
        (cleanQuery && u.name.toLowerCase() === cleanQuery)
      );
    });

    if (!matchedUser) {
      return { 
        success: false, 
        message: 'No se encontró ningún usuario con ese documento o correo. Por favor verifica los datos o crea una cuenta.' 
      };
    }

    // Verify password if provided
    if (password !== undefined && password !== '') {
      if (matchedUser.password && matchedUser.password !== password) {
        return {
          success: false,
          message: 'La contraseña es incorrecta. Haz clic en "¿Olvidaste tu contraseña?" si necesitas recuperarla.'
        };
      }
    }

    modelStore.setCurrentUser(matchedUser);
    return { success: true, user: matchedUser };
  }

  public static register(data: {
    name: string;
    email?: string;
    documentId: string;
    vereda: string;
    phone: string;
    role: UserRole;
    password: string;
  }): { success: boolean; user: User; message?: string } {
    const rawName = data.name.trim();
    if (!rawName) {
      return { success: false, user: null as any, message: 'El nombre es obligatorio.' };
    }

    const cleanPass = data.password.replace(/\s/g, '').slice(0, 10);
    if (!cleanPass) {
      return { success: false, user: null as any, message: 'La contraseña es obligatoria (hasta 10 caracteres, sin espacios).' };
    }

    // Check if user already exists
    const users = modelStore.getUsers();
    const cleanDoc = data.documentId.replace(/\D/g, '');
    const alreadyExists = users.some(u => u.documentId.replace(/\D/g, '') === cleanDoc);

    if (alreadyExists) {
      return { success: false, user: null as any, message: 'Ya existe un usuario registrado con este número de documento.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: rawName, // Preserved exactly as user typed
      email: data.email ? data.email.trim() : undefined,
      documentId: data.documentId.trim(),
      vereda: data.vereda,
      phone: data.phone.trim(),
      role: data.role,
      password: cleanPass,
      createdAt: new Date().toISOString().split('T')[0]
    };

    modelStore.addUser(newUser);
    return { success: true, user: newUser };
  }

  public static recoverPassword(documentOrEmailOrPhone: string, newPassword: string): { success: boolean; message: string; user?: User } {
    return modelStore.updateUserPassword(documentOrEmailOrPhone, newPassword);
  }

  public static findUserByQuery(query: string): User | undefined {
    const clean = query.trim().toLowerCase();
    const cleanNumbers = clean.replace(/\D/g, '');
    const users = modelStore.getUsers();

    return users.find(u => {
      const uEmail = (u.email || '').toLowerCase();
      const uDocNumbers = u.documentId.replace(/\D/g, '');
      const uPhone = u.phone.replace(/\D/g, '');
      return (
        (clean.length > 3 && uEmail === clean) ||
        (cleanNumbers.length > 3 && (uDocNumbers === cleanNumbers || uPhone === cleanNumbers))
      );
    });
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
