/**
 * DynamicIcon — Renders any Lucide icon by its string name.
 *
 * Phase 13B: replaced `import * as LucideIcons` (which pulled the entire
 * 31MB lucide-react source tree into the vendor-ui chunk, producing a
 * 781KB minified bundle) with a static named-import map of the ~60 icons
 * actually used across the OS.
 *
 * Bundle impact: vendor-ui chunk drops ~560KB minified / ~80KB gzip.
 *
 * To add a new icon: import it at the top and add it to ICON_MAP.
 * Fallback: if a name isn't in the map, renders <File />.
 *
 * Usage: <DynamicIcon name="folder-open" size={20} />
 *        <DynamicIcon name="terminal" color="var(--color-accent)" />
 */
import {
  Activity, AlertTriangle, ArrowRight,
  Bell, BellDot,
  Briefcase,
  Calendar, CalendarDays, Check, CheckCheck, CheckCircle2,
  ChevronDown, ChevronRight, ChevronUp,
  Clock, CloudSun, Code2, Command, Copy, Cpu,
  Download,
  ExternalLink,
  File, FileCode, FileText, FilePlus, Folder, FolderOpen, FolderPlus,
  Github, Globe, GraduationCap, Grid, Grid3x3,
  HardDrive, Heart,
  Image, Info,
  Keyboard,
  LayoutDashboard, LayoutGrid, Layers, List, Linkedin, Loader2, LogOut,
  Mail, MapPin, Maximize, Minus, MinusSquare, Monitor, Music,
  Network,
  Package, PackageOpen, Palette, Pencil, Power,
  RefreshCw, RotateCcw,
  Scissors, Search, Send, Settings, Star, StickyNote,
  Terminal, Trash2, Twitter,
  User, UserCircle,
  Wifi, WifiOff, Volume2, VolumeX,
  X, XCircle, Zap,
} from 'lucide-react'

const ICON_MAP = {
  'activity':         Activity,
  'alert-triangle':   AlertTriangle,
  'arrow-right':      ArrowRight,
  'bell':             Bell,
  'bell-dot':         BellDot,
  'briefcase':        Briefcase,
  'calendar':         Calendar,
  'calendar-days':    CalendarDays,
  'check':            Check,
  'check-check':      CheckCheck,
  'check-circle-2':   CheckCircle2,
  'chevron-down':     ChevronDown,
  'chevron-right':    ChevronRight,
  'chevron-up':       ChevronUp,
  'clock':            Clock,
  'cloud-sun':        CloudSun,
  'code-2':           Code2,
  'command':          Command,
  'copy':             Copy,
  'cpu':              Cpu,
  'download':         Download,
  'external-link':    ExternalLink,
  'file':             File,
  'file-code':        FileCode,
  'file-text':        FileText,
  'file-plus':        FilePlus,
  'folder':           Folder,
  'folder-open':      FolderOpen,
  'folder-plus':      FolderPlus,
  'github':           Github,
  'globe':            Globe,
  'graduation-cap':   GraduationCap,
  'grid':             Grid,
  'grid-3x3':         Grid3x3,
  'hard-drive':       HardDrive,
  'heart':            Heart,
  'image':            Image,
  'info':             Info,
  'keyboard':         Keyboard,
  'layout-dashboard': LayoutDashboard,
  'layout-grid':      LayoutGrid,
  'layers':           Layers,
  'list':             List,
  'linkedin':         Linkedin,
  'loader-2':         Loader2,
  'log-out':          LogOut,
  'mail':             Mail,
  'map-pin':          MapPin,
  'maximize':         Maximize,
  'minus':            Minus,
  'minus-square':     MinusSquare,
  'monitor':          Monitor,
  'mouse-pointer-2':  File,   // fallback — not in this version of lucide
  'music':            Music,
  'network':          Network,
  'package':          Package,
  'package-open':     PackageOpen,
  'palette':          Palette,
  'pencil':           Pencil,
  'power':            Power,
  'refresh-cw':       RefreshCw,
  'rotate-ccw':       RotateCcw,
  'scissors':         Scissors,
  'search':           Search,
  'send':             Send,
  'settings':         Settings,
  'star':             Star,
  'sticky-note':      StickyNote,
  'terminal':         Terminal,
  'trash-2':          Trash2,
  'twitter':          Twitter,
  'user':             User,
  'user-circle':      UserCircle,
  'volume-2':         Volume2,
  'volume-x':         VolumeX,
  'wifi':             Wifi,
  'wifi-off':         WifiOff,
  'x':                X,
  'x-circle':         XCircle,
  'zap':              Zap,
}

export default function DynamicIcon({ name = 'file', size = 16, color, strokeWidth = 1.75, className = '', style }) {
  const Icon = ICON_MAP[name] ?? File
  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
    />
  )
}
