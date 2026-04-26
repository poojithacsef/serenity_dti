import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, PlayCircle, FileText, ExternalLink, BookOpen } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const FALLBACK_RESOURCES = [
  { id: '1', title: '5-Minute Meditation', type: 'video', description: 'A quick guide to recenter yourself.', link: '#' },
  { id: '2', title: 'Managing Exam Stress', type: 'article', description: 'Tips to handle academic pressure.', link: '#' },
  { id: '3', title: 'Sleep Hygiene 101', type: 'article', description: 'How to get a better night of rest.', link: '#' },
  { id: '4', title: 'Deep Breathing Exercises', type: 'video', description: 'Follow along for relaxation.', link: '#' },
];

const SelfCareLibrary = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Resources"));
        if (!querySnapshot.empty) {
          const resData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setResources(resData);
        } else {
          setResources(FALLBACK_RESOURCES);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        setResources(FALLBACK_RESOURCES);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-pastel-blue" />
          Self-Care Library
        </h1>
        <p className="text-slate-600 mt-2">Curated resources to help you manage your well-being.</p>
        
        <div className="mt-8 max-w-xl mx-auto relative flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pastel-blue shadow-sm bg-white/80 backdrop-blur-sm"
              placeholder="Search for articles, videos, or books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <a
            href={searchTerm.trim() ? `https://oceanofpdf.site/?s=${encodeURIComponent(searchTerm)}` : '#'}
            target={searchTerm.trim() ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-colors whitespace-nowrap ${searchTerm.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-400 cursor-not-allowed'}`}
          >
            Search OceanofPDF <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full border border-slate-200/50">
                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-2 mb-3 text-slate-500">
                    {resource.type === 'video' ? <PlayCircle className="w-5 h-5 text-red-400" /> : <FileText className="w-5 h-5 text-blue-400" />}
                    <span className="text-xs font-semibold uppercase tracking-wider">{resource.type}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{resource.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{resource.description}</p>
                </div>
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                  <a 
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Access Resource
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-slate-500 py-10 glass rounded-3xl">
              <BookOpen className="w-12 h-12 mb-4 text-slate-300" />
              <p className="text-lg font-medium">No internal resources found matching "{searchTerm}".</p>
              <p className="text-sm mt-1">Try using the "Search OceanofPDF" button above to look for books!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelfCareLibrary;
