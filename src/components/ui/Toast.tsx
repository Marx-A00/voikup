"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface Toast {
	id: string;
	message: string;
	type: "success" | "error" | "info" | "warning";
	duration?: number;
}

interface ToastContextType {
	toasts: Toast[];
	showToast: (message: string, type: Toast["type"], duration?: number) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showToast = useCallback(
		(message: string, type: Toast["type"], duration = 5000) => {
			const id = Date.now().toString();
			const newToast: Toast = { id, message, type, duration };

			setToasts((prev) => [...prev, newToast]);

			if (duration > 0) {
				setTimeout(() => removeToast(id), duration);
			}
		},
		[removeToast],
	);

	return (
		<ToastContext.Provider value={{ toasts, showToast, removeToast }}>
			{children}
			<ToastContainer />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

function ToastContainer() {
	const { toasts, removeToast } = useToast();

	return (
		<div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
			{toasts.map((toast) => (
				<ToastItem
					key={toast.id}
					toast={toast}
					onClose={() => removeToast(toast.id)}
				/>
			))}
		</div>
	);
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
	const typeClasses = {
		success: "bg-green-500/90 text-white",
		error: "bg-red-500/90 text-white",
		info: "bg-[var(--color-accent-blue)]/90 text-white",
		warning: "bg-[var(--color-accent-orange)]/90 text-white",
	};

	useEffect(() => {
		const timer = setTimeout(
			() => {
				const toastElement = document.getElementById(`toast-${toast.id}`);
				if (toastElement) {
					toastElement.style.animation = "slideOut 0.3s ease-in-out forwards";
				}
			},
			(toast.duration || 5000) - 300,
		);

		return () => clearTimeout(timer);
	}, [toast.id, toast.duration]);

	return (
		<div
			id={`toast-${toast.id}`}
			className={`min-w-[300px] max-w-md animate-[slideIn_0.3s_ease-in-out] rounded-lg p-4 shadow-lg backdrop-blur-sm ${typeClasses[toast.type]}`}
			role="alert"
		>
			<div className="flex items-start justify-between gap-3">
				<p className="flex-1">{toast.message}</p>
				<button
					type="button"
					onClick={onClose}
					className="rounded-md p-1 transition-colors hover:bg-white/20"
					aria-label="Close notification"
				>
					<XMarkIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}

// Add these animations to your global CSS
export const toastAnimations = `
@keyframes slideIn {
	from {
		transform: translateX(100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}

@keyframes slideOut {
	from {
		transform: translateX(0);
		opacity: 1;
	}
	to {
		transform: translateX(100%);
		opacity: 0;
	}
}`;
