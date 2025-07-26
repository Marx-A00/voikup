import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const healthRouter = createTRPCRouter({
	check: publicProcedure.query(async ({ ctx }) => {
		try {
			// Test database connection
			await ctx.db.$queryRaw`SELECT 1`;

			return {
				status: "healthy",
				timestamp: new Date().toISOString(),
				database: "connected",
				version: process.env.npm_package_version ?? "unknown",
			};
		} catch (error) {
			return {
				status: "unhealthy",
				timestamp: new Date().toISOString(),
				database: "disconnected",
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}),

	ping: publicProcedure.query(() => {
		return {
			message: "pong",
			timestamp: Date.now(),
		};
	}),
});
