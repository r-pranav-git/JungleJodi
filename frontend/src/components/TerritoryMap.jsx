// frontend/src/components/TerritoryMap.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const GRID_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const GRID_COLS = [1, 2, 3, 4, 5, 6];

const TerritoryMap = ({ userCell = 'C3', onCellSelect }) => {
  const [selectedCell, setSelectedCell] = useState(userCell);

  const handleCellClick = (cellId) => {
    setSelectedCell(cellId);
    onCellSelect?.(cellId);
    
    // Play thump sound
    const audio = new Audio('/sounds/thump.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // Determine layer based on row
  const getLayer = (row) => {
    const rowIndex = GRID_ROWS.indexOf(row);
    if (rowIndex <= 2) return 'Canopy';
    if (rowIndex <= 5) return 'Understory';
    return 'Forest Floor';
  };

  // Get cell color based on layer
  const getCellColor = (cellId, isUserCell) => {
    const row = cellId[0];
    const layer = getLayer(row);
    
    if (isUserCell) return 'bg-green-600 ring-4 ring-green-300';
    
    const colors = {
      Canopy: 'bg-green-400/30',
      Understory: 'bg-green-500/30',
      'Forest Floor': 'bg-green-700/30',
    };
    
    return `${colors[layer]} hover:scale-105`;
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 forest-card">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        🗺️ Forest Territory
      </h2>
      
      <div className="mb-4 text-white/70 text-sm">
        Current: <span className="font-semibold text-white">{userCell}</span>
        <span className="ml-2">({getLayer(userCell[0])})</span>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {GRID_ROWS.map((row) => (
          GRID_COLS.map((col) => {
            const cellId = `${row}${col}`;
            const isUserCell = cellId === userCell;
            const isSelected = cellId === selectedCell;

            return (
              <motion.button
                key={cellId}
                layoutId={`cell-${cellId}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCellClick(cellId)}
                className={`
                  aspect-square rounded-lg flex items-center justify-center 
                  text-white font-bold text-sm transition-all relative
                  ${getCellColor(cellId, isUserCell)}
                  ${isSelected ? 'ring-2 ring-yellow-400' : ''}
                  border border-white/10
                `}
                title={`${cellId} - ${getLayer(row)}`}
              >
                {cellId}
                
                {/* User avatar indicator */}
                <AnimatePresence>
                  {isUserCell && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full ring-2 ring-green-600"
                    >
                      <span className="text-xs">🦊</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <div className="w-3 h-3 bg-green-400/30 rounded"></div>
          <span>Canopy (A-C)</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <div className="w-3 h-3 bg-green-500/30 rounded"></div>
          <span>Understory (D-F)</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <div className="w-3 h-3 bg-green-700/30 rounded"></div>
          <span>Forest Floor (G-H)</span>
        </div>
      </div>
    </div>
  );
};

TerritoryMap.propTypes = {
  userCell: PropTypes.string,
  onCellSelect: PropTypes.func,
};

export default TerritoryMap;