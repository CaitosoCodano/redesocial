import Layout from "@/components/layout/Layout";
import LeftSidebar from "@/components/layout/mod-LeftSidebar";
import RightSidebar from "@/components/layout/mod-RightSidebar";
import StoriesSection from "@/components/stories/mod-StoriesSection";
import CreatePostCard from "@/components/posts/mod-CreatePostCard";
import { posts } from "@/lib/data";
import PostCard from "@/components/posts/mod-PostCard";

export default function Home() {
  return (
    <Layout>
      <LeftSidebar />
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
              <h1 className="ml-2 text-lg font-semibold text-gray-800">SocialNet</h1>
            </div>
            <button
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex">
          <div className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full">
            <StoriesSection />
            <CreatePostCard />
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </main>
      </div>
      <RightSidebar />
    </Layout>
  );
}
