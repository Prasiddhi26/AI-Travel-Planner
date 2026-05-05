import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();

  const [form, setForm]           = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [saving, setSaving]       = useState(false);

  const handleProfileChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileMsg("");
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordMsg("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axiosInstance.put("/auth/profile", { name: form.name, email: form.email });
      updateUser(data);
      setProfileMsg("✅ Profile updated successfully!");
    } catch (err) {
      setProfileMsg(err.response?.data?.message || "❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) return setPasswordMsg("❌ Passwords do not match.");
    if (passwords.next.length < 8) return setPasswordMsg("❌ Password must be at least 8 characters.");
    setSaving(true);
    try {
      await axiosInstance.put("/auth/password", {
        current_password: passwords.current,
        new_password: passwords.next,
      });
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordMsg("✅ Password changed successfully!");
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "❌ Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand"><span>✈️</span> AI Travel</div>
        <nav className="sidebar-nav">
          <Link to="/dashboard"   className="sidebar-link">🏠 Dashboard</Link>
          <Link to="/saved-trips" className="sidebar-link">💾 Saved Trips</Link>
          <Link to="/profile"     className="sidebar-link active">👤 Profile</Link>
        </nav>
        <button onClick={logout} className="sidebar-logout">🚪 Sign Out</button>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">👤 My Profile</h1>
            <p className="page-subtitle">Manage your account details</p>
          </div>
        </div>

        {/* Avatar */}
        <div className="card profile-avatar-card">
          <div className="avatar-circle">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2>{user?.name}</h2>
            <p className="muted">{user?.email}</p>
          </div>
        </div>

        {/* Update Profile */}
        <div className="card">
          <h2 className="card-title">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleProfileChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleProfileChange} required />
            </div>
            {profileMsg && <p className="form-message">{profileMsg}</p>}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="btn-spinner" /> : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 className="card-title">Change Password</h2>
          <form onSubmit={handleChangePassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="current">Current Password</label>
              <input id="current" name="current" type="password" value={passwords.current} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="next">New Password</label>
              <input id="next" name="next" type="password" placeholder="Min. 8 characters" value={passwords.next} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirm">Confirm New Password</label>
              <input id="confirm" name="confirm" type="password" value={passwords.confirm} onChange={handlePasswordChange} required />
            </div>
            {passwordMsg && <p className="form-message">{passwordMsg}</p>}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="btn-spinner" /> : "Update Password"}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="card danger-zone">
          <h2 className="card-title danger-title">Danger Zone</h2>
          <p className="muted">Once you delete your account, all data will be permanently removed.</p>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => window.confirm("Are you sure? This cannot be undone.") && alert("Contact support to delete your account.")}
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;