import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { CloseIcon } from './Icons/CloseIcon';

export const TabSystem = ({ item, onClick, onRemove, isSelected }) => {
  return (
    <Reorder.Item
      value={item}
      id={item.label}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        backgroundColor: isSelected ? '#f3f3' : '#fff',
        y: 0,
        transition: { duration: 0.15 },
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
      whileDrag={{ backgroundColor: '#e3e3e3' }}
      className={isSelected ? 'selected' : ''}
      onPointerDown={onClick}
    >
      <motion.span layout="position">{`${item.title}`}</motion.span>
      <motion.div layout className="close bg-red-950">
        <motion.button
          onPointerDown={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          initial={false}
          animate={{ backgroundColor: isSelected ? '#e3e3e3' : '#fff' }}
        >
          <CloseIcon />
        </motion.button>
      </motion.div>
    </Reorder.Item>
  );
};
