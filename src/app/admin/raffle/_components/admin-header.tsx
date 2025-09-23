'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import s from './admin-header.module.css';

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/admin/raffle');
  };

  return (
    <header className={s.header}>
      <button className={s.backButton} onClick={handleBack} aria-label="뒤로가기">
        <ArrowLeft size={24} />
      </button>
      <h1 className={s.title}>{title}</h1>
      <div className={s.spacer} />
    </header>
  );
}