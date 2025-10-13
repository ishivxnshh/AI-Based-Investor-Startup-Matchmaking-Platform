import React from 'react';

const Tab = ({ children, className = '' }) => {
  return (
    <span className={className}>{children}</span>
  );
};

export default Tab;


