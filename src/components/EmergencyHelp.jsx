import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';

const EmergencyHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 z-50 flex items-center justify-center"
        aria-label="Emergency Help"
      >
        <Phone className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">Emergency Help</h2>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <h3 className="font-semibold text-red-700">National Crisis Hotline</h3>
                <p className="text-red-600 text-sm mb-2">Available 24/7</p>
                <a href="tel:988" className="block text-center bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition">
                  Call 988
                </a>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-700">Crisis Text Line</h3>
                <p className="text-blue-600 text-sm mb-2">Text HOME to 741741</p>
                <a href="sms:741741" className="block text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  Text Now
                </a>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-slate-600 font-medium mb-4">Breathe With Me</h3>
              <div className="w-32 h-32 mx-auto rounded-full bg-pastel-blue opacity-50 animate-breathe"></div>
              <p className="mt-4 text-slate-500 text-sm">Breathe in as it expands, breathe out as it shrinks.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyHelp;
