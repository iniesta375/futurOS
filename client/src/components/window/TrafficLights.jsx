import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react'
import SnapLayoutPicker from '@components/snap/SnapLayoutPicker'
import { useOSAnimations } from '@contexts/GlassEffectContext'


export default function TrafficLights({
  onClose, onMinimize, onMaximize,
  isMaximized, windowId, accentColor = '#6366f1',
}) {
  const [hovered,  setHovered]  = useState(false)
  const [showSnap, setShowSnap] = useState(false)
  const { enabled } = useOSAnimations()

  const buttons = [
    { key: 'close',    color: '#ff5f57', icon: X,
      shadow: 'rgba(255,95,87,0.5)',   label: 'Close window',    action: onClose    },
    { key: 'minimize', color: '#febc2e', icon: Minus,
      shadow: 'rgba(254,188,46,0.5)', label: 'Minimize window', action: onMinimize },
    { key: 'maximize', color: '#28c840', icon: isMaximized ? Minimize2 : Maximize2,
      shadow: 'rgba(40,200,64,0.5)',  label: isMaximized ? 'Restore window' : 'Maximize window',
      action: onMaximize },
  ]

  return (
    <div className = "no-drag"
      style={{
        display: "flex",
        gap: 8,
      }}
    >
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          console.log("close");
          onClose?.();
        }}
        style={{
          width: 13,
          height: 13,
          borderRadius: "50%",
          background: "#ff5f57",
          border: "none",
          cursor: "pointer",
        }}
      />

      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          console.log("minimize");
          onMinimize?.();
        }}
        style={{
          width: 13,
          height: 13,
          borderRadius: "50%",
          background: "#febc2e",
          border: "none",
          cursor: "pointer",
        }}
      />

      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          console.log("maximize");
          onMaximize?.();
        }}
        style={{
          width: 13,
          height: 13,
          borderRadius: "50%",
          background: "#28c840",
          border: "none",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
