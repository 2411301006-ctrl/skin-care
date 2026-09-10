import React from 'react';

export const ShadeSelector = ({ variants = [], selectedVariantId, onSelect }) => {
  if (!variants || variants.length === 0) return null;

  const selectedVariant = variants.find(v => v.variant_id === selectedVariantId) || variants[0];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <p className="font-label-caps text-label-caps text-on-background uppercase tracking-widest">
          SHADE: <span className="font-body-md text-body-md text-on-surface-variant ml-2 capitalize font-normal">{selectedVariant?.label}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.map((v) => {
          const isSelected = v.variant_id === selectedVariant?.variant_id;
          const hex = v.swatch_hex || '#e3c6b2';
          
          return (
            <button
              key={v.variant_id}
              onClick={() => onSelect(v)}
              title={v.label}
              aria-label={v.label}
              className={`w-8 h-8 rounded-full border-2 transition-colors relative ${isSelected ? 'border-outline scale-110' : 'border-transparent hover:border-outline-variant'}`}
              style={{ backgroundColor: hex }}
            >
              {isSelected && (
                <span className="absolute inset-0 border border-background rounded-full m-[2px]"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
