import React, { Profiler } from 'react';

export const PerformanceMonitor = ({ children }) => {
  const onRender = (
    id,
    phase,
    actualDuration
  ) => {
    console.log(`Render ${id} [${phase}] took ${actualDuration.toFixed(1)}ms`);
  };
  return <Profiler id="RAE" onRender={onRender}>{children}</Profiler>;
};

