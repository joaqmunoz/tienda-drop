import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/lib/api';

export const authOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // Credentials Provider (para login con email/password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña requeridos');
        }

        try {
          const response = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, accessToken } = response.data;

          if (user && accessToken) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              accessToken,
            };
          }

          throw new Error('Credenciales inválidas');
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Error de autenticación');
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Si es Google OAuth
      if (account?.provider === 'google') {
        try {
          // Registrar o actualizar usuario en backend
          const response = await api.post('/auth/google', {
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: profile?.sub,
          });

          // Guardar token en sesión
          user.accessToken = response.data.accessToken;
          user.id = response.data.user.id;

          return true;
        } catch (error) {
          console.error('Error en Google Sign In:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }

      if (account?.provider === 'google') {
        token.provider = 'google';
      }

      return token;
    },

    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      session.user.provider = token.provider;

      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
