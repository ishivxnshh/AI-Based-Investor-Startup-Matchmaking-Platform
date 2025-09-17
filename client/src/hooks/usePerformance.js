import { useEffect, useCallback } from 'react';

const usePerformance = () => {
  // Measure component render time
  const measureRender = useCallback((componentName, renderFn) => {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${end - start}ms`);
    }
    
    return result;
  }, []);

  // Measure async operation
  const measureAsync = useCallback(async (operationName, asyncFn) => {
    const start = performance.now();
    try {
      const result = await asyncFn();
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${operationName} execution time: ${end - start}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${operationName} failed after: ${end - start}ms`);
      }
      
      throw error;
    }
  }, []);

  // Monitor memory usage
  const getMemoryUsage = useCallback(() => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
      };
    }
    return null;
  }, []);

  // Monitor network performance
  const getNetworkInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }
    return null;
  }, []);

  // Monitor Core Web Vitals
  const measureWebVitals = useCallback(() => {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }, []);

  // Preload critical resources
  const preloadResource = useCallback((href, as = 'script') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }, []);

  // Prefetch resources
  const prefetchResource = useCallback((href) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      measureWebVitals();
    }
  }, [measureWebVitals]);

  return {
    measureRender,
    measureAsync,
    getMemoryUsage,
    getNetworkInfo,
    preloadResource,
    prefetchResource,
  };
};

export default usePerformance;
