import {
  type LucideIcon,
  Home,
  Calendar,
  CheckCircle,
  Trophy,
  Gift,
  PlayCircle,
  History,
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const MENU_ITEMS: MenuItem[] = [
  { label: '홈', href: '/', icon: Home },
  { label: '일정 안내', href: '/schedule', icon: Calendar },
  { label: '체크인', href: '/check-in', icon: CheckCircle },
  { label: '실시간 추첨', href: '/live-draw', icon: Trophy },
];

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { label: '추첨 상품 관리', href: '/admin/prizes', icon: Gift },
  { label: '추첨 진행', href: '/admin/draw', icon: PlayCircle },
  { label: '추첨 이력', href: '/admin/draw-history', icon: History },
];
