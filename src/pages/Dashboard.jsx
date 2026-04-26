import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

const MOODS = [
  { emoji: '😊', label: 'Happy', color: 'bg-green-100 hover:bg-green-200' },
  { emoji: '😔', label: 'Sad', color: 'bg-blue-100 hover:bg-blue-200' },
  { emoji: '😫', label: 'Stressed', color: 'bg-red-100 hover:bg-red-200' },
  { emoji: '😌', label: 'Calm', color: 'bg-teal-100 hover:bg-teal-200' },
  { emoji: '😠', label: 'Angry', color: 'bg-orange-100 hover:bg-orange-200' },
];

const QUOTES = [
  "You don't have to control your thoughts. You just have to stop letting them control you.",
  "Deep breaths are like little love notes to your body.",
  "It's okay to not be okay as long as you are not giving up.",
  "There is a crack in everything, that's how the light gets in.",
  "You are stronger than you think."
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [lastMood, setLastMood] = useState(null);
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pick a random quote
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'Users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.moods && data.moods.length > 0) {
          // Get the most recently added mood
          setLastMood(data.moods[data.moods.length - 1]);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleMoodSelect = async (moodLabel) => {
    if (loading) return;
    setLoading(true);
    try {
      const newMoodEntry = {
        mood: moodLabel,
        date: new Date().toISOString()
      };
      
      const userRef = doc(db, 'Users', currentUser.uid);
      await updateDoc(userRef, {
        moods: arrayUnion(newMoodEntry)
      });
      
      setLastMood(newMoodEntry);
      toast.success('Thanks for sharing how you feel today!', { icon: '💖' });
    } catch (error) {
      toast.error('Failed to log mood. Try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="glass p-8 rounded-3xl">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Friend'} 👋
          </h1>
          <p className="text-slate-600 mt-2">Take a deep breath. This is your safe space.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mood Tracker */}
          <div className="glass p-8 rounded-3xl flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">How are you feeling today?</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => handleMoodSelect(m.label)}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 ${m.color}`}
                  title={m.label}
                >
                  <span className="text-4xl mb-2">{m.emoji}</span>
                  <span className="text-xs font-medium text-slate-700">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            
            {/* Last Logged Mood */}
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-lg font-medium text-slate-700 mb-4">Last Logged Mood</h3>
              {lastMood ? (
                <div className="flex items-center gap-4">
                  <span className="text-3xl">
                    {MOODS.find(m => m.label === lastMood.mood)?.emoji || '✨'}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">{lastMood.mood}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(lastMood.date).toLocaleDateString()} at {new Date(lastMood.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">No mood logged yet.</p>
              )}
            </div>

            {/* Quote of the day */}
            <div className="glass p-8 rounded-3xl bg-pastel-blue/20">
              <h3 className="text-lg font-medium text-slate-700 mb-4">Quote of the Day</h3>
              <blockquote className="text-slate-800 italic border-l-4 border-pastel-blue pl-4">
                "{quote}"
              </blockquote>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
