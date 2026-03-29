import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import styles from './Navbar.module.css';

/**
 * Navbar component - with Google Sign-In 2.0 button
 */
export function Navbar() {
  const { user, isAuthenticated, logout, handleLoginSuccess, handleLoginError } = useGoogleAuth();

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
          >
            Logout
          </button>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      )}
    </nav>
  );
}
