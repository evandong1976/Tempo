import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // If you plan to access Calendar later, you can add scopes here (optional for login):
      // authorization: {
      //   params: { scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly" },
      // },
    }),
  ],
});

export { handler as GET, handler as POST };
