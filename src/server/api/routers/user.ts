import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(100).optional(),
				image: z.string().url().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const updatedUser = await ctx.db.user.update({
				where: { id: ctx.session.user.id },
				data: {
					name: input.name,
					image: input.image,
				},
			});
			return updatedUser;
		}),

	deleteAccount: protectedProcedure
		.input(
			z.object({
				confirmEmail: z.string().email(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
			});

			if (!user || user.email !== input.confirmEmail) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Email confirmation does not match",
				});
			}

			// Delete user and all related data (cascade delete handles related records)
			await ctx.db.user.delete({
				where: { id: ctx.session.user.id },
			});

			return { success: true, message: "Account deleted successfully" };
		}),

	getStats: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			include: {
				_count: {
					select: {
						sessions: true,
						posts: true,
					},
				},
			},
		});

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found",
			});
		}

		return {
			sessionCount: user._count.sessions,
			postCount: user._count.posts,
			accountCreated: new Date(), // User model doesn't have createdAt field
			emailVerified: user.emailVerified,
		};
	}),
});
