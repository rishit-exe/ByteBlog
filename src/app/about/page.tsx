export default function AboutPage() {
	return (
		<main className="max-w-3xl mx-auto p-4 pt-24 text-white">
			<h1 className="text-2xl font-semibold mb-4">About</h1>
			<p className="mb-6 opacity-90">
				This is a minimalist blog built with Next.js and Supabase. Create, read, update, and delete posts with a clean, responsive UI.
			</p>
			<section className="grid sm:grid-cols-2 gap-4">
				<div className="rounded-xl border border-white/10 p-4 bg-white/5">
					<h3 className="font-medium mb-1">Tech Stack</h3>
					<p className="text-sm opacity-80">Next.js, Tailwind, Supabase, Server Actions</p>
				</div>
				<div className="rounded-xl border border-white/10 p-4 bg-white/5">
					<h3 className="font-medium mb-1">Deployment</h3>
					<p className="text-sm opacity-80">Ready for Vercel, environment-based configuration</p>
				</div>
				<div className="rounded-xl border border-white/10 p-4 bg-white/5">
					<h3 className="font-medium mb-1">Features</h3>
					<p className="text-sm opacity-80">CRUD posts, responsive design, modern UI particles</p>
				</div>
				<div className="rounded-xl border border-white/10 p-4 bg-white/5">
					<h3 className="font-medium mb-1">Roadmap</h3>
					<p className="text-sm opacity-80">Authentication, comments, tags</p>
				</div>
			</section>
		</main>
	);
}

