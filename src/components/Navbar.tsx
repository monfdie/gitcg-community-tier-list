import styles from './Navbar.module.css';

/**
 * Navbar component - top bar with project title
 */
export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <span className={styles.title}>GI Community Tier List</span>
    </nav>
  );
}
