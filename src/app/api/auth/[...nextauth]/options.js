import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        // Fetch user from the database
        await connect();
                      const user = await User.findOne({email});
                      if(!user ){
                              throw new Error("Invalid credentials");
                      }

        if (!user) throw new Error("User not found");

        // Compare hashed passwords
        const isValid = await compare(password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        return { id: user._id, email: user.email, name: user.name};
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3600, // Session expires after 1 hour
  },
  jwt: {
    maxAge: 3600, // Token expires after 1 hour
  },
  callbacks: {
    async signIn({user, account, profile }) {
      await connect();
      if (account.provider === "google") {
        const existingUser = await User.findOne({ email: profile.email });

        // If user does not exist, create a new user
        if (!existingUser) {
          const newUser = await User.create({
            email: profile.email,
            name: profile.name || profile.given_name,
            image: profile.picture, // Save profile picture if available
          });
          user.id = newUser._id;
        } else {
          user.id = existingUser._id;
        }
      }
      console.log(user,account,profile)
      return true;
    },
    async jwt({ token, user}) {
      if (user) {
        token.id = user.id; // Save user ID in the token
      }
      token.exp = Math.floor(Date.now() / 1000) + 3600;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.expires = token.exp;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
  },
}

export default authOptions;