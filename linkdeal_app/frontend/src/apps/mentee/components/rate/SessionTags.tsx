import { FunctionComponent } from 'react';

interface Tag {
  id: string;
  label: string;
}

interface SessionTagsProps {
  tags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const SessionTags: FunctionComponent<SessionTagsProps> = ({ tags, selectedTags, onTagsChange }) => {
  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 w-full text-white">
      <div className="text-base font-inter">What describes this session best?</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`rounded-2xl border px-4 py-2.5 flex items-center gap-3 transition-all ${
                isSelected
                  ? 'border-[#7008E7] bg-[#7008E7]/20'
                  : 'border-white/15 bg-white/5 hover:border-white/40'
              }`}
            >
              <span
                className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-[#7008E7] border-[#7008E7]' 
                    : 'border-white/40 bg-transparent'
                }`}
              >
                {isSelected && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 4L2.83333 5.33333L6.5 1.66667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="text-sm font-arimo text-gray-200">{tag.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { SessionTags };
