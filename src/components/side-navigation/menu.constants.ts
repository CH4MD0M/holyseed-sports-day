import {
  type LucideIcon,
  Home,
  Calendar,
  CheckCircle,
  Trophy,
  UserCheck,
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
  { label: '체크인', href: '/checkin', icon: CheckCircle },
  { label: '추첨 결과', href: '/lottery-results', icon: Trophy },
];

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { label: '체크인 관리', href: '/admin/checkin', icon: UserCheck },
  { label: '추첨 상품 관리', href: '/admin/raffle', icon: Gift },
  { label: '추첨 진행', href: '/admin/lottery', icon: PlayCircle },
  { label: '추첨 이력 관리', href: '/admin/lottery-history', icon: History },
];
