import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	loading?: boolean;
}

export function Button({
	children,
	className = "",
	variant = "primary",
	size = "md",
	fullWidth = false,
	loading = false,
	disabled,
	...props
}: ButtonProps) {
	const baseClasses =
		"font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed";

	const variantClasses = {
		primary:
			"bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange-dark)] focus:ring-[var(--color-accent-orange)]",
		secondary:
			"bg-[var(--color-accent-blue)] text-white hover:bg-[var(--color-accent-blue-dark)] focus:ring-[var(--color-accent-blue)]",
		ghost:
			"bg-[var(--color-main)]/20 text-gray-900 hover:bg-[var(--color-main)]/30 focus:ring-[var(--color-main)]",
		danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
	};

	const sizeClasses = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2",
		lg: "px-6 py-3 text-lg",
	};

	const widthClass = fullWidth ? "w-full" : "";

	return (
		<button
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
			disabled={disabled || loading}
			{...props}
		>
			{loading ? (
				<span className="flex items-center justify-center">
					<svg
						className="-ml-1 mr-2 h-4 w-4 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					Loading...
				</span>
			) : (
				children
			)}
		</button>
	);
}
