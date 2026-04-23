import { useState, useEffect } from 'react';
import { getAllUsers } from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="admin-users-page">
      <h1 className="page-title">Registered Users</h1>

      {users.length === 0 ? (
        <div className="empty-state">No users registered yet.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Gender</th><th>Phone</th><th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id}>
                  <td>{u.user_id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.age || '-'}</td>
                  <td>{u.gender || '-'}</td>
                  <td>{u.phone || '-'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
