import React, { useEffect } from "react";
 export default function TagRederer({
	fetchInitialTags,
	setAvailableTags,
	selectedTags,
	setSelectedTags
 }) { 

	// Initial tag load
	useEffect(() => {
	fetchInitialTags().then(setAvailableTags);
	}, [fetchInitialTags]);

  const removeTag = (tag) => {
	setSelectedTags((prev) => prev.filter((t) => t !== tag));
	setAvailableTags((prev) => [...prev, tag]);
  };

  return (
	<div className="flex flex-wrap ml-11 mr-11 max-w-full">
	  {selectedTags.map((tag) => (
		<div
		  key={tag}
		  className="flex items-center h-6 bg-gray-200 px-2 py-1 rounded-xl text-sm text-gray-900 shadow-sm m-[3px] transition-all duration-300"
		>
		  {tag}
		  <button
			onClick={(e) => {
			  e.stopPropagation();
			  removeTag(tag);
			}}
			className="h-[16px] w-[16px] ml-2 p-0 border-none bg-transparent cursor-pointer focus:outline-none"
			aria-label={`Remove ${tag}`}
		  >
			<img src="/close.svg" alt="Remove" className="w-full h-full" />
		  </button>
		</div>
	  ))}
	</div>
  );

}