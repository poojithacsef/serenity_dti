import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-pastel-green/20">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight">
          Your safe space to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            breathe & grow.
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          A minimalist platform designed to support student mental health. Track your mood, connect anonymously, and find the resources you need.
        </p>
        
        <div className="pt-4">
          <Link
            to="/auth"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-slate-800 hover:bg-slate-700 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center">
            <Heart className="w-10 h-10 text-pastel-pink mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Daily Tracking</h3>
            <p className="text-slate-600 text-sm">Monitor your emotional wellbeing with our simple daily mood tracker.</p>
          </div>
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center">
            <Users className="w-10 h-10 text-pastel-blue mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Anonymous Support</h3>
            <p className="text-slate-600 text-sm">Share your thoughts safely in our judgment-free community forum.</p>
          </div>
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center">
            <Shield className="w-10 h-10 text-pastel-purple mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Expert Resources</h3>
            <p className="text-slate-600 text-sm">Access a curated library of self-care articles and meditation guides.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
