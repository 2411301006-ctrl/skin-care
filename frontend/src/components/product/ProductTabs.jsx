import React, { useState } from 'react';

export const ProductTabs = ({ description, ingredients, howToUse }) => {
  const [openTab, setOpenTab] = useState('desc');

  const toggleTab = (tab) => {
    setOpenTab(openTab === tab ? null : tab);
  };

  return (
    <div className="border-t border-outline-variant mt-8">
      {/* Description */}
      <div className="border-b border-outline-variant">
        <button
          onClick={() => toggleTab('desc')}
          className="w-full py-4 flex justify-between items-center text-left hover:opacity-70 transition-opacity"
        >
          <span className="font-label-caps text-label-caps text-on-background tracking-widest">DESCRIPTION</span>
          <span className="material-symbols-outlined text-secondary transition-transform duration-300">
            {openTab === 'desc' ? 'remove' : 'add'}
          </span>
        </button>
        {openTab === 'desc' && (
          <div className="pb-6 font-body-md text-body-md text-on-surface-variant text-sm pr-4 transition-all duration-300">
            <p className="leading-relaxed">{description}</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary mt-1">check_circle</span>
                <span>Dermatologically tested & non-comedogenic</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary mt-1">check_circle</span>
                <span>Cruelty-free & sustainably sourced ingredients</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary mt-1">check_circle</span>
                <span>Suitable for all skin types</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div className="border-b border-outline-variant">
        <button
          onClick={() => toggleTab('ingredients')}
          className="w-full py-4 flex justify-between items-center text-left hover:opacity-70 transition-opacity"
        >
          <span className="font-label-caps text-label-caps text-on-background tracking-widest">INGREDIENTS</span>
          <span className="material-symbols-outlined text-secondary transition-transform duration-300">
            {openTab === 'ingredients' ? 'remove' : 'add'}
          </span>
        </button>
        {openTab === 'ingredients' && (
          <div className="pb-6 font-body-md text-body-md text-on-surface-variant text-sm pr-4 transition-all duration-300 leading-relaxed">
            {ingredients || "Formulated with clean, high-performance botanical extracts."}
          </div>
        )}
      </div>

      {/* How To Use */}
      <div className="border-b border-outline-variant">
        <button
          onClick={() => toggleTab('howToUse')}
          className="w-full py-4 flex justify-between items-center text-left hover:opacity-70 transition-opacity"
        >
          <span className="font-label-caps text-label-caps text-on-background tracking-widest">HOW TO USE</span>
          <span className="material-symbols-outlined text-secondary transition-transform duration-300">
            {openTab === 'howToUse' ? 'remove' : 'add'}
          </span>
        </button>
        {openTab === 'howToUse' && (
          <div className="pb-6 font-body-md text-body-md text-on-surface-variant text-sm pr-4 transition-all duration-300 leading-relaxed">
            {howToUse || "Apply evenly onto skin daily or as needed."}
          </div>
        )}
      </div>
    </div>
  );
};
