"use client";

import { useState, useTransition, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLenisNavigation } from "@/app/(components)/useLenisNavigation";
import { createPost } from "@/app/actions";
import MarkdownEditor from "@/app/(components)/MarkdownEditor";
import PublishConfirmationModal from "@/app/(components)/PublishConfirmationModal";

export default function NewPostPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { navigateWithLenis } = useLenisNavigation();
	const [isPending, startTransition] = useTransition();
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [markdownContent, setMarkdownContent] = useState("");
	const [showPublishModal, setShowPublishModal] = useState(false);
	const [formData, setFormData] = useState<FormData | null>(null);

	// Redirect to sign in if not authenticated
	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/signin");
		}
	}, [status, router]);

	// Show loading while checking authentication
	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-white text-xl">Loading...</div>
			</div>
		);
	}

	// Show nothing while redirecting
	if (status === "unauthenticated") {
		return null;
	}

	// Available categories and tags
	const categories = [
		"Technology", "Programming", "Web Development", "Design", "Personal", "Tutorial"
	];

	const availableTags = [
		"JavaScript", "React", "Next.js", "CSS", "TypeScript", "Node.js", 
		"Python", "Java", "Mobile", "UI/UX"
	];

	const handleTagToggle = (tag: string) => {
		setSelectedTags(prev => 
			prev.includes(tag) 
				? prev.filter(t => t !== tag)
				: [...prev, tag]
		);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		
		if (!session?.user?.name) {
			setErrors({ general: ["You must be signed in to create a post"] });
			return;
		}

		const newFormData = new FormData(event.currentTarget);
		newFormData.set("content", markdownContent);
		newFormData.set("category", selectedCategory);
		newFormData.set("tags", JSON.stringify(selectedTags));
		newFormData.set("author", session.user.name);

		// Store form data and show confirmation modal
		setFormData(newFormData);
		setShowPublishModal(true);
	};

	const handlePublishConfirm = async () => {
		if (!formData) return;

		startTransition(async () => {
			try {
				const result = await createPost(formData);
				
				if (result.ok) {
					navigateWithLenis("/");
				} else {
					setErrors({ general: [result.error || "Failed to create post"] });
					setShowPublishModal(false);
				}
			} catch (error) {
				setErrors({ general: ["An unexpected error occurred"] });
				setShowPublishModal(false);
			}
		});
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
				<p className="text-gray-300">Share your thoughts with the world</p>
			</div>

			{errors.general && (
				<div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
					{errors.general.map((error, i) => (
						<p key={i} className="text-red-300">{error}</p>
					))}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Title */}
				<div>
					<label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
						Title *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						required
						className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Enter your post title..."
					/>
					{errors.title && (
						<p className="mt-1 text-red-300 text-sm">{errors.title[0]}</p>
					)}
				</div>

				{/* Category */}
				<div>
					<label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
						Category
					</label>
					<select
						id="category"
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="" className="bg-gray-900 text-gray-300">Select a category</option>
						{categories.map(category => (
							<option key={category} value={category} className="bg-gray-900 text-white">
								{category}
							</option>
						))}
					</select>
				</div>

				{/* Tags */}
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">
						Tags
					</label>
					<div className="flex flex-wrap gap-2">
						{availableTags.map(tag => (
							<button
								key={tag}
								type="button"
								onClick={() => handleTagToggle(tag)}
								className={`px-3 py-1 rounded-full text-sm transition-colors ${
									selectedTags.includes(tag)
										? 'bg-blue-500 text-white'
										: 'bg-white/10 text-gray-300 hover:bg-white/20'
								}`}
							>
								{tag}
							</button>
						))}
					</div>
					{selectedTags.length > 0 && (
						<div className="mt-2">
							<p className="text-sm text-gray-400">
								Selected: {selectedTags.join(', ')}
							</p>
						</div>
					)}
				</div>

				{/* Action Buttons - Moved above editor */}
				<div className="flex gap-4 pt-4 border-t border-white/20">
					<button
						type="submit"
						disabled={isPending}
						className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isPending ? "Creating..." : "Create Post"}
					</button>
					
					<button
						type="button"
						onClick={() => navigateWithLenis("/")}
						className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
					>
						Cancel
					</button>
				</div>

				{/* Content */}
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">
						Content *
					</label>
					<MarkdownEditor
						value={markdownContent}
						onChange={setMarkdownContent}
						placeholder="Write your post content in Markdown..."
					/>
					{errors.content && (
						<p className="mt-1 text-red-300 text-sm">{errors.content[0]}</p>
					)}
				</div>

			</form>

			{/* Publish Confirmation Modal */}
			<PublishConfirmationModal
				isOpen={showPublishModal}
				onClose={() => setShowPublishModal(false)}
				onConfirm={handlePublishConfirm}
				title={formData?.get("title") as string || ""}
				action="create"
				isProcessing={isPending}
			/>
		</div>
	);
}