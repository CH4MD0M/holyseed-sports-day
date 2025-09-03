import styles from './login.module.css';

export default function LoginPageLayout({ children }: { children: React.ReactNode }) {
  return <main className={styles.loginMain}>{children}</main>;
}
