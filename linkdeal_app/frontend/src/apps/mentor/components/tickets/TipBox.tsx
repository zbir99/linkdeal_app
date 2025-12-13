import { FunctionComponent } from 'react';

const TipBox: FunctionComponent = () => {
  return (
    <div className="rounded-2xl border border-[#7008E7]/40 bg-[#7008E7]/10 px-4 py-3 text-sm text-white flex items-start gap-3">
      <span className="text-lg">💡</span>
      <p className="text-gray-100">
        <strong className="font-semibold">Tip:</strong> Include screenshots, error messages, or any relevant
        details to help us assist you better.
      </p>
    </div>
  );
};

export { TipBox };
