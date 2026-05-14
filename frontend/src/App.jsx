import { useState } from 'react';

import Login from './components/Login';
import TimeLogForm from './components/TimeLogForm';
import LeaveForm from './components/LeaveForm';
import TimeLogList from './components/TimeLogList';
import LeaveHistory from './components/LeaveHistory';
import { useAuth } from './context/AuthContext';
import './styles.css';

export default function App() {
  const {  user, token } = useAuth();
  console.log(user);
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem('token')
  );

  const [tab, setTab] = useState('timelog');
  function logout() {

    localStorage.removeItem('token');

    setLoggedIn(false);
  }

  // ─── Show Login Screen ─────────────────────────────

  if (!loggedIn) {

    return (
      <div className="auth-wrapper">

        <Login onLogin={() => setLoggedIn(true)} />

      </div>
    );
  }

  // ─── Show Main Application ────────────────────────

  return (
    <div className="tl-app">

      {/* Header */}

      <header className="tl-header">

        <div className="tl-header__inner">

          <div className="tl-header__brand">

            <span className="tl-header__logo">◈</span>
            <span className="tl-header__name">
              Welcome {user?.name}
            </span>
           

          </div>

          <div className="header-right">

            <nav className="tl-tabs">
              <button
                className={`tl-tab ${
                  tab === 'list'
                    ? 'tl-tab--active'
                    : ''
                }`}
                onClick={() => setTab('list')}
              >
                📋 View Logs
              </button>
              <button
                className={`tl-tab ${
                  tab === 'timelog'
                    ? 'tl-tab--active'
                    : ''
                }`}
                onClick={() => setTab('timelog')}
              >
                ⏱ Time Log
              </button>

              <button
                className={`tl-tab ${
                  tab === 'leave'
                    ? 'tl-tab--active'
                    : ''
                }`}
                onClick={() => setTab('leave')}
              >
                🏖 Apply Leave
              </button>
              <button
                className={`tl-tab ${
                  tab === 'leave-history'
                    ? 'tl-tab--active'
                    : ''
                }`}
                onClick={() => setTab('leave-history')}
              >
                🏖 Leave History
              </button>
                 <button
                  className="logout-btn"
                  onClick={logout}
                >
                  Logout
                </button>
            </nav>

           

          </div>

        </div>

      </header>

      {/* Main */}

      <main className="tl-main">

        <div className="tl-container">

          {tab === 'timelog' && (
            <TimeLogForm />
          )}

          {tab === 'list' && (
            <TimeLogList />
          )}

          {tab === 'leave' && (
            <LeaveForm />
          )}
          {tab === 'leave-history' && (
            <LeaveHistory />
          )}
          

        </div>

      </main>

    </div>
  );
}