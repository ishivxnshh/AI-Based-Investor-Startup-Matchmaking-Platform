import React, { useState } from 'react';

// Backward-compatible Tabs component supporting two APIs:
// 1) Uncontrolled tabs prop: <Tabs tabs={[{label, content, icon}], defaultTab} />
// 2) Controlled children API: <Tabs value onChange><Tab value>Label</Tab>...</Tabs>
const Tabs = ({ tabs, defaultTab = 0, className = '', value, onChange, children }) => {
  // If tabs array is provided, use the original uncontrolled API
  if (Array.isArray(tabs)) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const handleClick = (index) => {
      setActiveTab(index);
      if (onChange) onChange(index);
    };

    return (
      <div className={className}>
        <div className="flex gap-2 border-b border-purple-500/20 mb-6">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`
                px-4 py-3 font-semibold transition-all duration-300 relative
                ${activeTab === index ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'}
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

        <div className="animate-fade-in">{tabs[activeTab]?.content}</div>
      </div>
    );
  }

  // Otherwise, support controlled children API using <Tab value>Label</Tab>
  const items = React.Children.toArray(children);
  const activeValue = value ?? items[0]?.props?.value ?? 0;

  return (
    <div className={className}>
      <div className="flex gap-2 border-b border-purple-500/20 mb-6">
        {items.map((child, index) => {
          const childValue = child.props?.value ?? index;
          const isActive = activeValue === childValue;
          return (
            <button
              key={childValue}
              onClick={() => onChange && onChange(childValue)}
              className={`
                px-4 py-3 font-semibold transition-all duration-300 relative
                ${isActive ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'}
              `}
            >
              {child.props?.icon && <span className="mr-2">{child.props.icon}</span>}
              {child.props?.children}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-600 animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
