import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, helperText, className = "", id, ...props }, ref) => {
		const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

		const inputClasses = `
			w-full rounded-lg bg-[var(--color-main)]/20 px-4 py-3 text-gray-900 
			placeholder:text-gray-500 border border-gray-200
			focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] focus:bg-[var(--color-main)]/30
			disabled:bg-[var(--color-main)]/10 disabled:text-gray-400 disabled:cursor-not-allowed
			${error ? "ring-2 ring-red-500" : ""}
			${className}
		`;

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={inputId}
						className="mb-2 block font-medium text-gray-700 text-sm"
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={inputClasses}
					aria-invalid={!!error}
					aria-describedby={
						error
							? `${inputId}-error`
							: helperText
								? `${inputId}-helper`
								: undefined
					}
					{...props}
				/>
				{error && (
					<p id={`${inputId}-error`} className="mt-1 text-red-400 text-sm">
						{error}
					</p>
				)}
				{helperText && !error && (
					<p id={`${inputId}-helper`} className="mt-1 text-gray-500 text-sm">
						{helperText}
					</p>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
