"use client";

import { useLenisNavigation } from "@/app/(components)/useLenisNavigation";

export default function PostSelectorClient({ recent, currentId }: { recent: { id: string; title: string }[]; currentId: string }) {
  const { navigateWithLenis } = useLenisNavigation();
  
  return (
    <select
      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
      defaultValue={currentId}
      onChange={(e) => navigateWithLenis(`/posts/${e.target.value}`)}
    >
      {recent.map(r => (
        <option 
          value={r.id} 
          key={r.id}
          className="bg-gray-800 text-white"
          style={{
            backgroundColor: '#1f2937',
            color: 'white',
          }}
        >
          {r.title}
        </option>
      ))}
    </select>
  );
}

