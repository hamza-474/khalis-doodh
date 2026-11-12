import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Phone / Email",
      credentials: {
        identifier: { label: "Email or Phone", type: "text", placeholder: "03001234567" },
        password: { label: "Password (or dummy OTP)", type: "password" }
      },
      async authorize(credentials) {
        // Dummy implementation for provider-gated OTP
        // Replace with real DB check or OTP verification adapter
        if (credentials?.identifier === "admin" && credentials?.password === "admin") {
          return { id: "admin-1", name: "Super Admin", email: "admin@khalisdoodh.pk", role: "admin" };
        }
        if (credentials?.identifier === "gwala" && credentials?.password === "gwala") {
          return { id: "gwala-1", name: "Gwala User", email: "gwala@khalisdoodh.pk", role: "gwala" };
        }
        if (credentials?.identifier && credentials?.password === "0000") {
          return { id: "1", name: "Guest User", email: "guest@example.com", role: "customer" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "dummy-secret-for-dev",
});

export { handler as GET, handler as POST };
