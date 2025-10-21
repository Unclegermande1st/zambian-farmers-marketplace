import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl text-green-700 font-semibold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">My Profile</h1>
              <p className="text-sm text-gray-500">Account information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-xl p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-800">{user?.name || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium capitalize text-gray-800">{user?.role || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">User ID</span>
                  <span className="font-mono text-xs text-gray-700 break-all">{user?.userId || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;




