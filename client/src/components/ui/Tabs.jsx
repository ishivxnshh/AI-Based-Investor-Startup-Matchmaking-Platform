import React, { useState } from 'react';

const Tabs = ({ tabs, defaultTab = 0, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex gap-2 border-b border-purple-500/20 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`
              px-4 py-3 font-semibold transition-all duration-300 relative
              ${activeTab === index
                ? 'text-purple-400'
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-600 animate-scale-in" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
