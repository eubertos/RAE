import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressBar } from '../ProgressBar';

test('renders with correct progress', () => {
  const { getByA11yRole } = render(<ProgressBar progress={0.5} />);
  const bar = getByA11yRole('progressbar');
  expect(bar.props.accessibilityValue.now).toBe(50);
});
