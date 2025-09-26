// ============================================================================
// EXPANDABLE CATEGORIES HOOK - Clean Code: State Logic Separation
// ============================================================================

import { useState } from 'react';
import { ExpandableCategories } from '../types';

export const useExpandableCategories = (initialState: ExpandableCategories) => {
  const [expandedCategories, setExpandedCategories] = useState<ExpandableCategories>(initialState);

  const toggleCategory = (category: keyof ExpandableCategories) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const expandAll = () => {
    setExpandedCategories(prev => 
      Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {} as ExpandableCategories)
    );
  };

  const collapseAll = () => {
    setExpandedCategories(prev => 
      Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {} as ExpandableCategories)
    );
  };

  return {
    expandedCategories,
    toggleCategory,
    expandAll,
    collapseAll
  };
};