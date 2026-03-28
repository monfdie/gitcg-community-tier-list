import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import styles from './Navbar.module.css';

/**
 * Navbar component - minimal with only Google login button in top-right
 */
export function Navbar() {
  const { user, isAuthenticated, isLoading, login, logout } = useGoogleAuth();

  return (
    <nav className={styles.navbar}>
      {isAuthenticated && user ? (
        <div className={styles.authContainer}>
          <div className={styles.userInfo}>
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className={styles.avatar}
              />
            )}
            <span className={styles.userName}>{user.name}</span>
          </div>
          <button
            onClick={logout}
            className={styles.button}
            disabled={isLoading}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className={`${styles.button} ${styles.loginButton}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      )}
    </nav>
  );
}
