import { FunctionComponent } from 'react';

interface DescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionTextarea: FunctionComponent<DescriptionTextareaProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 text-gray-300">
      <label className="text-sm font-semibold">Description *</label>
      <div className="group rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your issue in detail..."
          className="w-full min-h-[160px] bg-transparent px-4 py-3 text-gray-200 placeholder:text-gray-500 resize-none focus:outline-none rounded-2xl"
          rows={6}
        />
      </div>
      <p className="text-xs text-gray-400">
        Please provide as much detail as possible to help us resolve your issue quickly.
      </p>
    </div>
  );
};

export { DescriptionTextarea };
