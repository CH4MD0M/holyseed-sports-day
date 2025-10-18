'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/utils/supabase/client';
import { Tables } from '@/types/supabase.type';
import MainLayout from '@/components/layout/main-layout';

import NotStartedScreen from './_components/not-started-screen';
import AnnouncingScreen from './_components/announcing-screen';
import DrawingScreen from './_components/drawing-screen';

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
  }, []);

  // status가 not_started가 아닐 때만 구독
  useEffect(() => {
    if (status === 'not_started') {
      console.log('Not subscribing - status is not_started');
      return;
    }

    console.log('Setting up realtime subscription');

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
      .subscribe((subscriptionStatus) => {
        console.log('Subscription status:', subscriptionStatus);
      });

    return () => {
      console.log('Unsubscribing from channel');
      supabaseClient.removeChannel(channel);
    };
  }, [status]);

  // 상태별 화면 렌더링
  const renderScreen = () => {
    switch (status) {
      case 'not_started':
        return <NotStartedScreen />;

      case 'announcing':
        return <AnnouncingScreen />;

      case 'drawing':
        return <DrawingScreen />;

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
