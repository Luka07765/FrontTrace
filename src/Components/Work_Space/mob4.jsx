// hooks/useStyles.js
import { useState } from 'react';

export const useStyles = (initialStyles = { blur: false }) => {
  const [styles, setStyles] = useState(initialStyles);

  const toggleStyle = (styleName) => {
    setStyles((prev) => ({ ...prev, [styleName]: !prev[styleName] }));
  };

  return { styles, toggleStyle };
};