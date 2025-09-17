import React, { memo, useMemo, useCallback } from 'react';

// Higher-order component for memoization
export const withMemo = (Component, areEqual) => {
  return memo(Component, areEqual);
};

// Memoized button component
export const MemoButton = memo(({ 
  children, 
  onClick, 
  className = '', 
  disabled = false, 
  type = 'button',
  ...props 
}) => {
  const handleClick = useCallback((e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  }, [onClick, disabled]);

  return (
    <button
      type={type}
      className={className}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

// Memoized input component
export const MemoInput = memo(({ 
  value, 
  onChange, 
  onBlur, 
  className = '', 
  type = 'text',
  placeholder = '',
  ...props 
}) => {
  const handleChange = useCallback((e) => {
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  const handleBlur = useCallback((e) => {
    if (onBlur) {
      onBlur(e);
    }
  }, [onBlur]);

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      placeholder={placeholder}
      {...props}
    />
  );
});

// Memoized card component
export const MemoCard = memo(({ 
  children, 
  className = '', 
  onClick,
  ...props 
}) => {
  const handleClick = useCallback((e) => {
    if (onClick) {
      onClick(e);
    }
  }, [onClick]);

  return (
    <div
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});

// Memoized list item component
export const MemoListItem = memo(({ 
  item, 
  onItemClick, 
  renderItem, 
  className = '',
  ...props 
}) => {
  const handleClick = useCallback(() => {
    if (onItemClick) {
      onItemClick(item);
    }
  }, [onItemClick, item]);

  const renderedItem = useMemo(() => {
    if (renderItem) {
      return renderItem(item);
    }
    return item.toString();
  }, [renderItem, item]);

  return (
    <div
      className={className}
      onClick={handleClick}
      {...props}
    >
      {renderedItem}
    </div>
  );
});

// Memoized form component
export const MemoForm = memo(({ 
  children, 
  onSubmit, 
  className = '',
  ...props 
}) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  }, [onSubmit]);

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  );
});

// Memoized image component
export const MemoImage = memo(({ 
  src, 
  alt, 
  className = '', 
  onLoad,
  onError,
  ...props 
}) => {
  const handleLoad = useCallback((e) => {
    if (onLoad) {
      onLoad(e);
    }
  }, [onLoad]);

  const handleError = useCallback((e) => {
    if (onError) {
      onError(e);
    }
  }, [onError]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
});

// Memoized text component
export const MemoText = memo(({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
});

// Memoized container component
export const MemoContainer = memo(({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
});

export default {
  withMemo,
  MemoButton,
  MemoInput,
  MemoCard,
  MemoListItem,
  MemoForm,
  MemoImage,
  MemoText,
  MemoContainer,
};
