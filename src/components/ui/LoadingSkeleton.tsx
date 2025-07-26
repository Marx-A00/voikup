import type { HTMLAttributes } from "react";

interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
	variant?: "text" | "circular" | "rectangular" | "card";
	width?: string | number;
	height?: string | number;
	lines?: number;
}

export function LoadingSkeleton({
	variant = "text",
	width,
	height,
	lines = 1,
	className = "",
	...props
}: LoadingSkeletonProps) {
	const baseClasses =
		"animate-pulse bg-[var(--color-main)]/20 rounded border border-gray-200";

	const getVariantClasses = () => {
		switch (variant) {
			case "circular":
				return "rounded-full";
			case "rectangular":
				return "rounded-lg";
			case "card":
				return "rounded-xl";
			default:
				return "rounded";
		}
	};

	const getDefaultDimensions = () => {
		switch (variant) {
			case "circular":
				return { width: width || 40, height: height || 40 };
			case "rectangular":
				return { width: width || "100%", height: height || 120 };
			case "card":
				return { width: width || "100%", height: height || 200 };
			default:
				return { width: width || "100%", height: height || 20 };
		}
	};

	const dimensions = getDefaultDimensions();
	const variantClass = getVariantClasses();

	if (variant === "text" && lines > 1) {
		return (
			<div className={`space-y-2 ${className}`} {...props}>
				{Array.from({ length: lines }).map((_, index) => (
					<div
						key={`skeleton-line-${variant}-${lines}-${index}`}
						className={`${baseClasses} ${variantClass}`}
						style={{
							width: index === lines - 1 ? "80%" : dimensions.width,
							height: dimensions.height,
						}}
					/>
				))}
			</div>
		);
	}

	return (
		<div
			className={`${baseClasses} ${variantClass} ${className}`}
			style={{
				width: dimensions.width,
				height: dimensions.height,
			}}
			{...props}
		/>
	);
}

// Composite skeleton for common patterns
export function CardSkeleton() {
	return (
		<div className="space-y-4">
			<LoadingSkeleton variant="rectangular" height={200} />
			<div className="space-y-2">
				<LoadingSkeleton variant="text" width="60%" />
				<LoadingSkeleton variant="text" lines={2} />
			</div>
		</div>
	);
}

export function ListItemSkeleton() {
	return (
		<div className="flex items-center gap-4">
			<LoadingSkeleton variant="circular" width={48} height={48} />
			<div className="flex-1 space-y-2">
				<LoadingSkeleton variant="text" width="40%" />
				<LoadingSkeleton variant="text" width="60%" height={16} />
			</div>
		</div>
	);
}
