import { FunctionComponent } from 'react';

interface SubjectInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SubjectInput: FunctionComponent<SubjectInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Subject *</label>
      <div className="group rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Summarize your request..."
          className="w-full h-12 bg-transparent px-4 text-gray-200 placeholder:text-gray-500 focus:outline-none rounded-2xl"
        />
      </div>
    </div>
  );
};

export { SubjectInput };
