import { useState } from "react";
import { Plus } from "lucide-react";
import StoryViewer from "./mod-StoryViewer";

interface Story {
  id: number;
  username: string;
  avatar: string;
  isOwn?: boolean;
  content?: string;
  image?: string;
}

export default function StoriesSection() {
  const [stories, setStories] = useState<Story[]>([
    {
      id: 1,
      username: "Seu Story",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      isOwn: true,
    },
    {
      id: 2,
      username: "mariasilva",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      content: "Visita ao museu hoje!",
      image: "https://images.unsplash.com/photo-1503632235391-fffb5fd2d5ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      username: "pedro42",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      content: "Novo dia, novas conquistas! 💪",
      image: "https://images.unsplash.com/photo-1502230831726-fe5549140034?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      username: "juliacosta",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      content: "Férias merecidas! 🏖️",
      image: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 5,
      username: "lucaspereira",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      content: "Jantar especial com amigos",
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 6,
      username: "camila_r",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      content: "Novo corte de cabelo! O que acharam?",
      image: "https://images.unsplash.com/photo-1562594980-47fbace34750?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ]);

  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);

  const handleStoryClick = (index: number) => {
    // Skip first story if it's the user's own empty story
    if (index === 0 && stories[0].isOwn && !stories[0].content) {
      // Handle add story
      alert("Funcionalidade para adicionar story");
      return;
    }
    setViewingStoryIndex(index);
  };

  const handleNextStory = () => {
    if (viewingStoryIndex !== null && viewingStoryIndex < stories.length - 1) {
      setViewingStoryIndex(viewingStoryIndex + 1);
    } else {
      // Close viewer if we're at the last story
      setViewingStoryIndex(null);
    }
  };

  const handlePreviousStory = () => {
    if (viewingStoryIndex !== null && viewingStoryIndex > 0) {
      setViewingStoryIndex(viewingStoryIndex - 1);
    }
  };

  const handleCloseViewer = () => {
    setViewingStoryIndex(null);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        STORIES
      </h2>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="flex flex-col items-center space-y-1 cursor-pointer"
            onClick={() => handleStoryClick(index)}
          >
            <div className={`relative w-16 h-16 rounded-full ${!story.isOwn ? 'ring-2 ring-primary p-0.5' : ''}`}>
              <img
                src={story.avatar}
                alt={story.username}
                className="w-full h-full object-cover rounded-full"
              />
              {story.isOwn && !story.content && (
                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                  <Plus className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs truncate w-16 text-center">{story.username}</span>
          </div>
        ))}
      </div>

      {viewingStoryIndex !== null && (
        <StoryViewer
          story={stories[viewingStoryIndex]}
          onClose={handleCloseViewer}
          onNext={handleNextStory}
          onPrevious={handlePreviousStory}
        />
      )}
    </div>
  );
}