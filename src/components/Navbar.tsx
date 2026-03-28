import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import styles from './Navbar.module.css';

/**
 * Navbar component with Google login/logout
 */
export function Navbar() {
  const { user, isAuthenticated, isLoading, login, logout } = useGoogleAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>Genshin Impact Tier List</h1>
        </div>

        <div className={styles.actions}>
          {isAuthenticated && user ? (
            <>
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
            </>
          ) : (
            <button
              onClick={login}
              className={`${styles.button} ${styles.loginButton}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
