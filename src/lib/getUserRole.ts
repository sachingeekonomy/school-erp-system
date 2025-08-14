import { getUserSession } from './auth';

export async function getUserRole(): Promise<string | null> {
  try {
    const session = await getUserSession();
    
    if (!session) {
      return null;
    }

    console.log('Role found in session:', session.role);
    return session.role;

  } catch (error) {
    console.error('Error determining user role:', error);
    return null;
  }
}

export async function getUserRoleSync(): Promise<string> {
  try {
    const role = await getUserRole();
    if (!role) {
      console.warn('No role found in session, this should not happen in a properly authenticated user');
      // Return a safe default that has minimal access
      return 'student';
    }
    return role;
  } catch (error) {
    console.error('Error in getUserRoleSync:', error);
    // Return a safe default that has minimal access
    return 'student';
  }
}

export async function getCurrentUser() {
  try {
    const session = await getUserSession();
    
    if (!session) {
      return null;
    }

    return {
      firstName: session.name,
      lastName: session.surname,
      email: `${session.username}@example.com`, // Fallback email
      username: session.username,
      role: session.role
    };

  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
