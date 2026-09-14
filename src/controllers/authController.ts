import { modelStore } from '../models/store';
import { User, UserRole } from '../types';

export class AuthController {
  public static login(
    emailOrDocument: string, 
    password?: string, 
    overrideRole?: UserRole
  ): { success: boolean; user?: User; message?: string } {
    const cleanQuery = emailOrDocument.trim().toLowerCase();
    const cleanNumbers = cleanQuery.replace(/\D/g, '');
    const users = modelStore.getUsers();

    if (!cleanQuery) {
      return {
        success: false,
        message: 'Debes ingresar tu número de cédula o correo electrónico.'
      };
    }

    let matchedUser = users.find(u => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uDocNumbers = u.documentId.replace(/\D/g, '');
      const uPhone = u.phone.replace(/\D/g, '');
      const uName = u.name.toLowerCase().trim();
      const uDoc = u.documentId.toLowerCase().trim();

      return (
        (cleanQuery && uEmail === cleanQuery) ||
        (cleanNumbers.length >= 4 && (uDocNumbers === cleanNumbers || uPhone === cleanNumbers)) ||
        (cleanQuery && (uDoc === cleanQuery || uName === cleanQuery))
      );
    });

    if (!matchedUser) {
      return {
        success: false,
        message: 'No existe ningún usuario o habitante registrado con este documento o correo. Si eres un nuevo habitante, regístrate en la pestaña "Crear Cuenta".'
      };
    }

    // STRICT PASSWORD VERIFICATION:
    // Only the registered password for this user is accepted; reject if different or empty.
    const inputPass = (password || '').trim();
    if (!inputPass) {
      return {
        success: false,
        message: 'Debes ingresar tu contraseña para iniciar sesión.'
      };
    }

    const expectedPass = (matchedUser.password || '123456').trim();
    if (inputPass !== expectedPass) {
      return {
        success: false,
        message: 'Contraseña incorrecta. Debes ingresar exactamente la contraseña con la que te registraste (no se permite otra contraseña distinta). Si la olvidaste, recupérala abajo.'
      };
    }

    // If user chose a role before logging in, apply that role so it appears in their profile
    let activeUser = matchedUser;
    if (overrideRole && matchedUser.role !== overrideRole) {
      const updated = modelStore.updateUserRole(matchedUser.id, overrideRole);
      if (updated) {
        activeUser = updated;
      } else {
        activeUser = { ...matchedUser, role: overrideRole };
      }
    }

    modelStore.setCurrentUser(activeUser);
    return { success: true, user: activeUser };
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
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const alreadyExists = users.some(u => {
      const uDoc = u.documentId.replace(/\D/g, '');
      const uEmail = (u.email || '').trim().toLowerCase();
      return (cleanDoc && cleanDoc.length >= 4 && uDoc === cleanDoc) ||
             (cleanEmail && cleanEmail.includes('@') && uEmail === cleanEmail);
    });

    if (alreadyExists) {
      return { success: false, user: null as any, message: 'Ya existe un usuario o habitante registrado con este número de documento/cédula o correo electrónico.' };
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
