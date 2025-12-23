'use client';

import React from 'react';
import { motion } from 'framer-motion';

type ReadingLevel = 'simple' | 'intermediate' | 'advanced';

interface ReadingLevelSelectorProps {
  currentLevel: ReadingLevel;
  availableLevels: ReadingLevel[];
  onChange: (level: ReadingLevel) => void;
  isLoading?: boolean;
}

const levelConfig = {
  simple: {
    label: 'Simple',
    description: 'Easy to understand',
    emoji: '🌱',
  },
  intermediate: {
    label: 'Intermediate',
    description: 'Moderate complexity',
    emoji: '🌿',
  },
  advanced: {
    label: 'Advanced',
    description: 'Technical depth',
    emoji: '🌳',
  },
};

export const ReadingLevelSelector: React.FC<ReadingLevelSelectorProps> = ({
  currentLevel,
  availableLevels,
  onChange,
  isLoading = false,
}) => {
  return (
    <div className="bg-card border-2 border-border rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-semibold text-foreground">Reading Level</span>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['simple', 'intermediate', 'advanced'] as ReadingLevel[]).map((level) => {
          const config = levelConfig[level];
          const isAvailable = availableLevels.includes(level);
          const isActive = currentLevel === level;

          return (
            <motion.button
              key={level}
              onClick={() => isAvailable && !isLoading && onChange(level)}
              disabled={!isAvailable || isLoading}
              whileHover={isAvailable && !isLoading ? { scale: 1.02 } : {}}
              whileTap={isAvailable && !isLoading ? { scale: 0.98 } : {}}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isActive
                  ? 'border-primary bg-primary/10 shadow-md'
                  : isAvailable
                  ? 'border-border hover:border-primary/50 bg-card'
                  : 'border-border bg-muted cursor-not-allowed opacity-50'
              }`}
            >
              {/* Emoji */}
              <div className="text-3xl mb-2">{config.emoji}</div>

              {/* Label */}
              <div className="font-semibold text-foreground mb-1">{config.label}</div>

              {/* Description */}
              <div className="text-xs text-muted-foreground">{config.description}</div>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeLevel"
                  className="absolute inset-0 border-2 border-primary rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Not Available Badge */}
              {!isAvailable && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-muted rounded text-[10px] font-semibold text-muted-foreground">
                  Not Available
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Switch between reading levels to adjust content complexity
      </p>
    </div>
  );
};
