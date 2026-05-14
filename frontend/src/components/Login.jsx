import { useState } from 'react';
import api from '../api/client';

export default function Login({ onLogin }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submitLogin(e) {

    e.preventDefault();

    try {

      const res = await api.post('/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);

      onLogin();

    } catch (error) {

      alert(error.response?.data?.message || 'Login failed');
    }
  }
return (<>
<div className="card">
      <h2>Login</h2>

      <form onSubmit={submitLogin}>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">
          Login
        </button>

      </form>
    </div>
</>);
}