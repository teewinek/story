import React, { useState } from 'react';
import { StoriesCarousel } from './components/StoriesCarousel';
import { StoryUploader } from './components/StoryUploader';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample data
const SAMPLE_STORIES = [
  {
    id: '1',
    url: 'https://www.teewinek.com/wp-content/uploads/2024/10/pull-avec-impression-en-tunisie-pas-cher-avec-impression-en-tunisie-teewinek-d.jpg',
    type: 'image' as const,
    duration: 5000,
    user: {
      name: 'Ameni',
      avatar: 'https://www.teewinek.com/wp-content/uploads/2024/10/pull-avec-impression-en-tunisie-pas-cher-avec-impression-en-tunisie-teewinek-d.jpg',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '2',
    url: 'https://www.teewinek.com/wp-content/uploads/2024/02/tablier-de-cuisine-personnalise-Impression-et-Personnalisation-des-tablier-de-cuisine-en-ligne-en-Tunisie-teewinek-MOBILE-2024.jpg',
    type: 'image' as const,
    duration: 5000,
    user: {
      name: 'Sarah',
      avatar: 'https://www.teewinek.com/wp-content/uploads/2024/02/tablier-de-cuisine-personnalise-Impression-et-Personnalisation-des-tablier-de-cuisine-en-ligne-en-Tunisie-teewinek-MOBILE-2024.jpg',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    url: 'https://www.teewinek.com/wp-content/uploads/2024/10/pull-avec-impression-en-tunisie-pas-cher-avec-impression-en-tunisie-teewinek-b.jpg',
    type: 'image' as const,
    duration: 5000,
    user: {
      name: 'Yassine',
      avatar: 'https://www.teewinek.com/wp-content/uploads/2023/09/banner-teewinek-produit-en-ligne-en-tunisie-capuche-et-tshirt-avec-impression-V2.gif',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '4',
    url: 'https://www.teewinek.com/wp-content/uploads/2024/10/t-shirt-teewinek-couple-2024-CAPUCHE-AVEC-LOGO-EN-TUNISIE-capuche-avec-impression-en-tunisie-teewinek.jpg',
    type: 'image' as const,
    duration: 5000,
    user: {
      name: 'Mariem',
      avatar: 'https://www.teewinek.com/wp-content/uploads/2024/10/t-shirt-teewinek-couple-2024-CAPUCHE-AVEC-LOGO-EN-TUNISIE-capuche-avec-impression-en-tunisie-teewinek.jpg',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  }
];

function App() {
  const [stories, setStories] = useState(SAMPLE_STORIES);
  const [isViewingStories, setIsViewingStories] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleUpload = (file: File) => {
    const newStory = {
      id: Date.now().toString(),
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
      duration: 5000,
      user: {
        name: 'ENTY HETHA',
        avatar: 'https://www.teewinek.com/wp-content/uploads/2024/11/hoodie-avec-impression-en-tunisie-teewinek-tunisie.png',
      },
      timestamp: new Date(),
    };

    setStories(prev => [newStory, ...prev]);
    setIsUploading(false);
  };

  const handleStoryClick = (index: number) => {
    setSelectedIndex(index);
    setIsViewingStories(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* Stories Row */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            <motion.button
              onClick={() => setIsUploading(true)}
              className="w-[80px] h-[80px] rounded-full bg-gray-100 flex items-center justify-center relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
            </motion.button>
            <span className="text-xs text-gray-900 mt-1">Add story</span>
          </div>

          {/* Story Circles */}
          {stories.map((story, index) => (
            <motion.button
              key={story.id}
              onClick={() => handleStoryClick(index)}
              className="flex flex-col items-center gap-1 min-w-[80px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-[80px] h-[80px] rounded-full p-[2px] relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 animate-gradient-spin" />
                <div className="absolute inset-[2px] rounded-full bg-white">
                  <img
                    src={story.user.avatar}
                    alt={story.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-900 truncate w-full text-center">
                {story.user.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      {isViewingStories && (
        <StoriesCarousel
          stories={stories}
          initialIndex={selectedIndex}
          onClose={() => setIsViewingStories(false)}
        />
      )}

      {/* Story Uploader */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Story</h2>
              <motion.button
                onClick={() => setIsUploading(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            <StoryUploader onUpload={handleUpload} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default App;