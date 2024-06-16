import { compare } from 'bcrypt';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and Password Required.');
        }

        await mongooseConnect();
        const user = await User.findOne({ email: credentials?.email });

        if (!user || !user.password) {
          throw new Error('Email does not exist.');
        }

        const isCorrectPassword = await compare(
          credentials.password,
          user.password,
        );
        if (!isCorrectPassword) {
          throw new Error('Incorrect password.');
        }

        return user;
      },
    }),
  ],

  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      // console.log('Session Callback', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          // userId: token.sub,
        },
      };
    },
    jwt: async ({ token, user, account }) => {
      // console.log('JWT Callback', { token, user })
      if (user) {
        token.role = user.role;
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// export { default } from 'next-auth/middleware'

// export const config = {
//   matcher: ['/((?!api|login|register).*)']
// }
// export const config = { matcher: ["/extra", "/client", "/dashboard"] }
