import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";

export const authRouter = createTRPCRouter({
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session;
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return "You can now see this secret message!";
	}),

	getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: {
				id: true,
				email: true,
				name: true,
				image: true,
				emailVerified: true,
			},
		});
		return user;
	}),

	signOut: protectedProcedure.mutation(async () => {
		// Clean up any user-specific data if needed
		// NextAuth handles the actual sign out
		return { success: true };
	}),
});
