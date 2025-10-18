'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseClient } from '@/utils/supabase/client';
import styles from './revealing-screen.module.css';

interface WinnerInfo {
  id: string;
  winner_id: string;
  name: string;
  team: string | null;
  department: string | null;
  lottery_number: number | null;
}

interface RevealingScreenProps {
  eventId: string | null;
}

interface LotteryTempResult {
  id: string;
  winner_id: string | null;
  profiles: {
    name: string | null;
    team: '청팀' | '백팀' | null;
    department: '청년2부' | '청년3부' | null;
    lottery_number: number | null;
  } | null;
}

const RevealingScreen = ({ eventId }: RevealingScreenProps) => {
  const [winners, setWinners] = useState<WinnerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTeam, setShowTeam] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showNumberAndName, setShowNumberAndName] = useState(false);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('lottery_temp_results')
          .select(
            `
            id,
            winner_id,
            profiles:winner_id (
              name,
              team,
              department,
              lottery_number
            )
          `
          )
          .eq('lottery_event_id', eventId!);

        if (error) throw error;

        const formattedWinners = (data as LotteryTempResult[])
          .filter((item) => item.profiles && item.winner_id)
          .map((item) => ({
            id: item.id,
            winner_id: item.winner_id!,
            name: item.profiles!.name || '이름 없음',
            team: item.profiles!.team,
            department: item.profiles!.department,
            lottery_number: item.profiles!.lottery_number,
          }));

        setWinners(formattedWinners);
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchWinners();
    }
  }, [eventId]);

  // 단계별 공개 타이머
  useEffect(() => {
    if (!loading && winners.length > 0) {
      const timers = [
        setTimeout(() => setShowTeam(true), 1000), // 1초 후 팀
        setTimeout(() => setShowDepartment(true), 4000), // 3초 후 부서
        setTimeout(() => setShowNumberAndName(true), 8000), // 4초 후 번호와 이름
      ];

      return () => timers.forEach((timer) => clearTimeout(timer));
    }
  }, [loading, winners]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>당첨자 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.title}>당첨자 발표</h1>
      </motion.div>

      <div className={styles.winnersGrid}>
        {winners.map((winner, index) => (
          <motion.div
            key={winner.id}
            className={styles.winnerCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: 'easeOut',
            }}
          >
            {/* 팀 정보 */}
            <AnimatePresence>
              {showTeam && (
                <motion.div
                  className={styles.infoItem}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={styles.infoLabel}>팀</div>
                  <div className={styles.infoValue}>{winner.team}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 부서 정보 */}
            <AnimatePresence>
              {showDepartment && (
                <motion.div
                  className={styles.infoItem}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={styles.infoLabel}>부서</div>
                  <div className={styles.infoValue}>{winner.department}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 번호 */}
            <AnimatePresence>
              {showNumberAndName && (
                <motion.div
                  className={styles.numberBadge}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 150,
                  }}
                >
                  <span className={styles.number}>{winner.lottery_number}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 이름 */}
            <AnimatePresence>
              {showNumberAndName && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <h2 className={styles.winnerName}>{winner.name}</h2>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RevealingScreen;
