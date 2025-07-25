export default function VerifyRequest() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
				<h1 className="font-extrabold text-5xl tracking-tight">
					Check your <span className="text-[hsl(280,100%,70%)]">email</span>
				</h1>
				<div className="max-w-md space-y-4">
					<p className="text-xl">
						A sign in link has been sent to your email address.
					</p>
					<p className="text-white/70">
						Click the link in the email to sign in to your account.
					</p>
				</div>
			</div>
		</main>
	);
}