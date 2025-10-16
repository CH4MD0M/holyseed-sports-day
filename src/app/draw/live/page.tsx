'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/utils/supabase/client';
import { Tables } from '@/types/supabase.type';
import MainLayout from '@/components/layout/main-layout';

import NotStartedScreen from './_components/not-started-screen';
import AnnouncingScreen from './_components/announcing-screen';

type LotteryStatus = Tables<'lottery_live_status'>['status'];

const LiveDrawPage = () => {
  const [status, setStatus] = useState<LotteryStatus>('not_started');

  useEffect(() => {
    // 초기 상태 가져오기
    const fetchInitialStatus = async () => {
      const { data, error } = await supabaseClient
        .from('lottery_live_status')
        .select('status')
        .single();

      if (data && !error) {
        console.log('Initial status:', data.status);
        setStatus(data.status);
      }
    };

    fetchInitialStatus();

    // Realtime 구독 설정
    const channel = supabaseClient
      .channel('lottery-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lottery_live_status',
        },
        (payload) => {
          console.log('🔥 Status changed:', payload);
          const newStatus = payload.new.status as LotteryStatus;
          setStatus(newStatus);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from channel');
      supabaseClient.removeChannel(channel);
    };
  }, []);

  // 상태별 화면 렌더링
  const renderScreen = () => {
    switch (status) {
      case 'not_started':
        return <NotStartedScreen />;

      case 'announcing':
        return <AnnouncingScreen />;

      case 'drawing':
      case 'revealing':
      case 'completed':
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              fontSize: '24px',
              color: '#666',
            }}
          >
            상태: {status} (준비 중)
          </div>
        );

      default:
        return <NotStartedScreen />;
    }
  };

  return <MainLayout title="실시간 추첨">{renderScreen()}</MainLayout>;
};

export default LiveDrawPage;
