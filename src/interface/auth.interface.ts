
interface UserRegistration {
  email: string;
  password: string;
  name: string;
  phone: string;
}
interface UserLogin {
  email: string;
  password: string;
}

type UserTier = 'FREE' | 'PREMIUM' | 'ENTERPRISE';

 interface SessionPayload {
  id?: string;
  user_id: string;
  userName: string;
  email: string;
  role?: string;
  tier: UserTier;
  isAdmin?: boolean;
}

export { UserRegistration, UserLogin, SessionPayload };