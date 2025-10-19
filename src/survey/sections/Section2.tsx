import React from 'react';

type Props = {
  value?: any;
  onChange?: (patch: any) => void;
  onContinue?: () => void;
};

export function Section2({ value, onChange, onContinue }: Props) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">section2 (placeholder)</h2>
      <p className="mb-4">Replace this placeholder with the real UI for <code>section2</code>.</p>
      <button className="px-4 py-2 rounded bg-gray-200" onClick={onContinue}>Continue</button>
    </div>
  );
}
