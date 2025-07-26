import { PrismaAdapter } from "@auth/prisma-adapter";
import chalk from "chalk";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { env } from "@/env";
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		EmailProvider({
			server: {
				host: env.EMAIL_SERVER_HOST || "localhost",
				port: env.EMAIL_SERVER_PORT || 1025,
				auth: {
					user: env.EMAIL_SERVER_USER || "",
					pass: env.EMAIL_SERVER_PASSWORD || "",
				},
			},
			from: env.EMAIL_FROM || "noreply@voikup.com",
			sendVerificationRequest({ identifier: email, url }) {
				console.log(chalk.cyan.bold("✨ === Magic Link Email === ✨"));
				console.log(chalk.green(`📧 To: ${chalk.yellow(email)}`));
				console.log(chalk.blue(`🔗 Sign in link: ${chalk.magenta(url)}`));
				console.log(chalk.cyan.bold("================================"));
			},
		}),
	],
	adapter: PrismaAdapter(db),
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
	},
	pages: {
		signIn: "/auth/signin",
		verifyRequest: "/auth/verify-request",
		error: "/auth/error",
	},
} satisfies NextAuthConfig;
