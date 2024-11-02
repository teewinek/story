import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from 'react-use-gesture';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';

interface Story {
  id: string;
  url: string;
  type: 'image' | 'video';
  duration: number;
  user: {
    name: string;
    avatar: string;
  };
  timestamp: Date;
}

interface StoriesCarouselProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
}

export const StoriesCarousel: React.FC<StoriesCarouselProps> = ({ 
  stories, 
  initialIndex = 0,
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<number>();
  const story = stories[currentIndex];

  const bind = useDrag(({ swipe: [swipeX] }) => {
    if (swipeX < 0 && currentIndex < stories.length - 1) {
      nextStory();
    } else if (swipeX > 0 && currentIndex > 0) {
      previousStory();
    }
  });

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const previousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      progressInterval.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + (100 / story.duration) * 100;
        });
      }, 100);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, isPaused, story.duration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        previousStory();
      } else if (e.key === 'ArrowRight') {
        nextStory();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div
        className="w-full max-w-md h-full md:h-[80vh] relative"
        {...bind()}
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
          {stories.map((_, index) => (
            <div
              key={index}
              className="h-0.5 flex-1 bg-gray-600 overflow-hidden"
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ 
                  width: index === currentIndex ? `${progress}%` : 
                         index < currentIndex ? '100%' : '0%'
                }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-4 z-20 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
          aria-label="Close stories"
        >
          <X size={20} />
        </button>

        {/* User info */}
        <div className="absolute top-8 left-4 flex items-center gap-3 z-20">
          <img
            src={story.user.avatar}
            alt={story.user.name}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-white font-semibold">{story.user.name}</p>
            <p className="text-gray-300 text-sm">
              {formatDistanceToNow(story.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Story content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {story.type === 'image' ? (
              <img
                src={story.url}
                alt=""
                className="w-full h-full object-cover"
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <video
                src={story.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                loop
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {currentIndex > 0 && (
          <button
            onClick={previousStory}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            aria-label="Previous story"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            aria-label="Next story"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Pause/Play button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
      </div>
    </div>
  );
};