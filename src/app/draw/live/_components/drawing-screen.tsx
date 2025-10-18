import { motion } from 'framer-motion';
import { Sparkles, Gift, Star, Zap, Trophy, PartyPopper, Crown, Gem } from 'lucide-react';
import styles from './drawing-screen.module.css';

const DrawingScreen = () => {
  const names = [
    '반칙왕',
    '국민 여동생',
    '행운의 아이콘',
    '대박 체질',
    '복덩이',
    '운빨 최강자',
    '황금손',
    '인싸 대표',
    '분위기 메이커',
    '럭키 비키',
    '금손 마법사',
    '텐션 폭발',
    '갓생 러버',
    '행복 바이러스',
    '에너지 충만',
    '복권 체질',
    '당첨 예감',
    '행운의 별',
    '대박 예정자',
    '복의 화신',
  ];

  const icons = [Sparkles, Gift, Star, Zap, Trophy, PartyPopper, Crown, Gem];

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 16 + 20,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
    Icon: icons[Math.floor(Math.random() * icons.length)],
  }));

  return (
    <div className={styles.container}>
      {particles.map((particle) => {
        const Icon = particle.Icon;
        return (
          <motion.div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          >
            <Icon size={particle.size} strokeWidth={2.5} />
          </motion.div>
        );
      })}

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.slotMachine}>
          <motion.div
            className={styles.nameList}
            animate={{
              y: [0, -1000],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'linear',
            }}
          >
            {[...names, ...names, ...names, ...names].map((name, index) => (
              <div key={index} className={styles.nameItem}>
                {name}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.p
          className={styles.description}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          당첨자를 추첨하고 있습니다
        </motion.p>
      </motion.div>
    </div>
  );
};

export default DrawingScreen;
