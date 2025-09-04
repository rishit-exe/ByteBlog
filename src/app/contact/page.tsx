export default function ContactPage() {
	return (
		<main className="max-w-3xl mx-auto p-4 pt-24 text-white">
			<h1 className="text-2xl font-semibold mb-4">Contact</h1>
			<p className="mb-6 opacity-90">Get in touch with the developer.</p>
			<div className="flex gap-3 flex-wrap">
				<a className="px-4 py-2 rounded bg-white text-black" href="https://github.com/rishit-exe" target="_blank" rel="noreferrer">GitHub</a>
				<a className="px-4 py-2 rounded bg-white text-black" href="https://www.linkedin.com/in/the-rishit-srivastava" target="_blank" rel="noreferrer">LinkedIn</a>
				<a className="px-4 py-2 rounded bg-white text-black" href="https://github.com/rishit-exe/ByteBlog/" target="_blank" rel="noreferrer">Source Code</a>
			</div>
		</main>
	);
}

