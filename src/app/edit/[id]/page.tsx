"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { useLenisNavigation } from "@/app/(components)/useLenisNavigation";
import { updatePost } from "@/app/actions";
import { supabaseClient } from "@/lib/supabaseClient";
import type { BlogPost } from "@/lib/types";
import MarkdownEditor from "@/app/(components)/MarkdownEditor";
import PublishConfirmationModal from "@/app/(components)/PublishConfirmationModal";

export default function EditPostPage() {
	const params = useParams<{ id: string }>();
	const { navigateWithLenis } = useLenisNavigation();
	const [post, setPost] = useState<BlogPost | null>(null);
	const [isPending, startTransition] = useTransition();
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [markdownContent, setMarkdownContent] = useState("");
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [formData, setFormData] = useState<FormData | null>(null);

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

	// Load existing post data
	useEffect(() => {
		async function load() {
			const { data } = await supabaseClient
				.from("posts")
				.select("id, title, author, content, created_at, updated_at, category, tags")
				.eq("id", params.id)
				.single();
			setPost(data as BlogPost);
		}
		load();
	}, [params.id]);

	useEffect(() => {
		if (post) {
			setSelectedCategory(post.category || "");
			setSelectedTags(post.tags || []);
			setMarkdownContent(post.content || "");
		}
	}, [post]);

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!post) return;
		
		const form = event.currentTarget;
		const newFormData = new FormData(form);
		
		const title = newFormData.get("title") as string;
		const author = newFormData.get("author") as string;
		
		if (!title || !markdownContent || !author) {
			return;
		}

		// Add category, tags, and markdown content to form data
		newFormData.append("content", markdownContent);
		newFormData.append("category", selectedCategory);
		newFormData.append("tags", JSON.stringify(selectedTags));

		// Store form data and show confirmation modal
		setFormData(newFormData);
		setShowUpdateModal(true);
	};

	const handleUpdateConfirm = async () => {
		if (!formData || !post) return;

		startTransition(async () => {
			try {
				await updatePost(post.id, formData);
				navigateWithLenis("/");
			} catch (error) {
				console.error("Error updating post:", error);
				setShowUpdateModal(false);
			}
		});
	};

	if (!post) {
		return <div className="max-w-6xl mx-auto p-4 text-white">Loading...</div>;
	}

	return (
		<div className="max-w-6xl mx-auto p-4">
			<h1 className="text-2xl font-semibold mb-6 text-white">Edit Blog Post</h1>
			<form onSubmit={onSubmit} className="space-y-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Left Column - Basic Info */}
					<div className="space-y-4">
						<div>
							<label className="block text-sm mb-1 text-white">Title</label>
							<input 
								name="title" 
								defaultValue={post.title} 
								className="w-full border border-white/20 rounded px-3 py-2 bg-white/10 text-white placeholder-gray-400" 
								required 
							/>
							{errors.title && (
								<p className="text-sm text-red-400 mt-1">{errors.title.join(", ")}</p>
							)}
						</div>

						<div>
							<label className="block text-sm mb-1 text-white">Author</label>
							<input 
								name="author" 
								defaultValue={post.author} 
								className="w-full border border-white/20 rounded px-3 py-2 bg-white/10 text-white placeholder-gray-400" 
								required 
							/>
							{errors.author && (
								<p className="text-sm text-red-400 mt-1">{errors.author.join(", ")}</p>
							)}
						</div>

						<div>
							<label className="block text-sm mb-1 text-white">Category</label>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="w-full border border-white/20 rounded px-3 py-2 bg-white/10 text-white"
								required
							>
								<option value="" className="bg-gray-800 text-white">Select a category</option>
								{categories.map((category) => (
									<option key={category} value={category} className="bg-gray-800 text-white">
										{category}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm mb-1 text-white">Tags</label>
							<div className="flex flex-wrap gap-2 p-3 border border-white/20 rounded bg-white/10">
								{availableTags.map((tag) => (
									<button
										key={tag}
										type="button"
										onClick={() => handleTagToggle(tag)}
										className={`px-3 py-1 rounded-full text-sm transition-colors ${
											selectedTags.includes(tag)
												? "bg-blue-500 text-white"
												: "bg-white/20 text-gray-300 hover:bg-white/30"
										}`}
									>
										#{tag}
									</button>
								))}
							</div>
							<p className="text-xs text-gray-400 mt-1">Click tags to select/deselect</p>
						</div>

						{/* Action Buttons - Moved above editor */}
						<div className="flex items-center gap-2 pt-4 border-t border-white/20">
							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50 transition-colors"
								disabled={isPending}
							>
								{isPending ? "Saving..." : "Update Post"}
							</button>
							<button
								type="button"
								className="border border-white/20 text-white px-4 py-2 rounded hover:bg-white/10 transition-colors"
								onClick={() => navigateWithLenis("/")}
							>
								Cancel
							</button>
						</div>
					</div>

					{/* Right Column - Markdown Editor */}
					<div>
						<label className="block text-sm mb-2 text-white">Content (Markdown)</label>
						<MarkdownEditor
							value={markdownContent}
							onChange={setMarkdownContent}
						/>
					</div>
				</div>

			</form>

			{/* Update Confirmation Modal */}
			<PublishConfirmationModal
				isOpen={showUpdateModal}
				onClose={() => setShowUpdateModal(false)}
				onConfirm={handleUpdateConfirm}
				title={formData?.get("title") as string || post.title}
				action="update"
				isProcessing={isPending}
			/>
		</div>
	);
}

