import { useState } from "react";
import { PlusCircle } from "lucide-react";

interface Story {
  id: number;
  username: string;
  avatar: string;
  isOwn?: boolean;
}

export default function StoriesSection() {
  const [stories] = useState<Story[]>([
    {
      id: 1,
      username: "Seu story",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      isOwn: true,
    },
    {
      id: 2,
      username: "Pedro",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    },
    {
      id: 3,
      username: "Carlos",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    },
    {
      id: 4,
      username: "Ana",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    },
    {
      id: 5,
      username: "Rafael",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    },
    {
      id: 6,
      username: "Julia",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    },
  ]);

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">MENU STORIES</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center space-y-1 flex-shrink-0"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                  <img
                    src={story.avatar}
                    className="w-full h-full object-cover"
                    alt={`${story.username}'s story`}
                  />
                </div>
              </div>
              {story.isOwn && (
                <div className="absolute bottom-0 right-0 bg-primary rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  <PlusCircle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 truncate w-16 text-center">
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
