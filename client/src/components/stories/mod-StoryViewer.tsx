import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface StoryViewerProps {
  story: {
    id: number;
    username: string;
    avatar: string;
    content?: string;
    image?: string;
  };
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function StoryViewer({ story, onClose, onNext, onPrevious }: StoryViewerProps) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Reset progress when story changes
    setProgress(0);
    setIsPaused(false);
    
    let intervalId: number | null = null;
    
    // Use setTimeout to avoid setting state during render
    const timeoutId = setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (!isPaused) {
          setProgress((prev) => {
            // If progress is complete, go to next story
            if (prev >= 100) {
              if (intervalId !== null) {
                clearInterval(intervalId);
              }
              onNext();
              return 0;
            }
            return prev + 0.5; // Adjust for speed (lower = slower)
          });
        }
      }, 10);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [story.id, isPaused, onNext]);

  const handleMouseDown = () => {
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-10"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation buttons */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        className="absolute left-4 text-white h-full flex items-center justify-center z-10 px-6"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 text-white h-full flex items-center justify-center z-10 px-6"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Story container */}
      <div className="relative w-full max-w-md h-[calc(100vh-80px)] max-h-[80vh]">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 p-2">
          <div className="w-full bg-gray-700 bg-opacity-50 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* User info */}
        <div className="absolute top-6 left-0 right-0 z-10 p-2 flex items-center">
          <img 
            src={story.avatar} 
            alt={story.username} 
            className="w-8 h-8 rounded-full mr-2 object-cover"
          />
          <div className="text-white">
            <p className="font-medium text-sm">{story.username}</p>
            <p className="text-xs text-gray-300">Agora</p>
          </div>
        </div>

        {/* Story content */}
        <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
          {story.image ? (
            <img 
              src={story.image} 
              alt="Story" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <p className="text-white text-xl p-8 text-center">
                {story.content || "No content"}
              </p>
            </div>
          )}

          {/* Overlay text if there's both image and content */}
          {story.image && story.content && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
              <p className="text-white text-lg">{story.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}