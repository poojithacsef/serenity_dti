import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { User, Save, Camera } from 'lucide-react';
import { SkeletonProfile } from '../components/SkeletonLoader';

const ProfileSettings = () => {
  const { currentUser, userProfile } = useAuth();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when userProfile is available
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setBio(userProfile.bio || '');
      setPhotoURL(userProfile.photoURL || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    try {
      const userRef = doc(db, 'Users', currentUser.uid);
      await updateDoc(userRef, {
        name,
        bio,
        photoURL
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Profile Settings</h1>
        <SkeletonProfile />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Profile Settings</h1>
        <p className="text-slate-600 mt-2">Manage your personal information and how others see you.</p>
      </div>

      <div className="glass p-8 rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Preview */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-md flex-shrink-0">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.src = ''; e.target.onerror = null; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-slate-700 mb-1">Profile Picture URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Camera className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastel-blue focus:border-pastel-blue bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastel-blue focus:border-pastel-blue bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community a bit about yourself..."
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastel-blue focus:border-pastel-blue bg-white/50 backdrop-blur-sm resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200/50 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
