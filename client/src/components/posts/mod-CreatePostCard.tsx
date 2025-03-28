import { useState } from "react";
import { ImageIcon, Smile, MapPin, X } from "lucide-react";

export default function CreatePostCard() {
  const [postText, setPostText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const emojis = ["😊", "😂", "❤️", "👍", "🔥", "🎉", "😍", "🙏", "👏", "✨"];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() && !selectedImage) return;

    // Handle post creation
    console.log("Creating post:", { 
      text: postText, 
      image: selectedImage,
      location
    });
    
    // Reset form
    setPostText("");
    setSelectedImage(null);
    setLocation(null);
    setExpanded(false);
    
    // Display success message
    alert("Post criado com sucesso!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // Here we're just creating a local URL for preview
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setExpanded(true);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setPostText(postText + emoji);
    setShowEmojiPicker(false);
  };

  const handleAddLocation = () => {
    // In a real app, you might use geolocation API
    const locations = ["São Paulo, Brasil", "Rio de Janeiro, Brasil", "Curitiba, Brasil", "Belo Horizonte, Brasil"];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setLocation(randomLocation);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleFocus = () => {
    setExpanded(true);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <form onSubmit={handlePostSubmit}>
        <div className="flex items-center space-x-4">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"
            alt="User profile"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="No que você está pensando?"
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              onFocus={handleFocus}
            />
          </div>
        </div>

        {expanded && (
          <>
            {selectedImage && (
              <div className="mt-3 relative">
                <img 
                  src={selectedImage} 
                  alt="Selected image" 
                  className="rounded-lg max-h-60 mx-auto"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {location && (
              <div className="mt-3 bg-gray-100 rounded-lg p-2 flex items-center">
                <MapPin className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-700">{location}</span>
                <button
                  type="button"
                  onClick={() => setLocation(null)}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
          <label className="flex items-center text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-md transition cursor-pointer">
            <ImageIcon className="h-5 w-5 mr-2 text-green-500" />
            Foto/Vídeo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <div className="relative">
            <button
              type="button"
              className="flex items-center text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-md transition"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-5 w-5 mr-2 text-yellow-500" />
              Sentimento
            </button>
            
            {showEmojiPicker && (
              <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-2 grid grid-cols-5 gap-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    className="text-2xl hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex items-center text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-md transition"
            onClick={handleAddLocation}
          >
            <MapPin className="h-5 w-5 mr-2 text-red-500" />
            Localização
          </button>
        </div>

        {expanded && (
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 font-medium"
              disabled={!postText.trim() && !selectedImage}
            >
              Publicar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}