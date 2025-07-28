import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Expanded Story data model
export interface Story {
  id: string;
  userId: string;
  userName: string;
  avatar: any;
  media?: string; // image/video URI
  text?: string;
  stickers?: string[];
  createdAt: number; // timestamp
  expiresAt: number; // timestamp (createdAt + 24h)
  viewed?: boolean;
}

interface StoriesContextType {
  stories: Story[];
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'expiresAt'>) => void;
  markStoryViewed: (storyId: string) => void;
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

export const useStories = () => {
  const ctx = useContext(StoriesContext);
  if (!ctx) throw new Error('useStories must be used within a StoriesProvider');
  return ctx;
};

export const StoriesProvider = ({ children }: { children: ReactNode }) => {
  const [stories, setStories] = useState<Story[]>([]);

  // Remove expired stories every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setStories((prev) => prev.filter((s) => s.expiresAt > Date.now()));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Add 4 sample stories if none exist
    if (stories.length === 0) {
      setStories([
        {
          id: 'demo1',
          userId: 'demo-user1',
          userName: 'Jane Smith',
          avatar: require('@/assets/images/profile-pictures/image-02.webp'),
          media: undefined,
          text: 'Welcome to NetworkPro Stories! This is a demo story. 🎉',
          stickers: ['🎉', '🔥'],
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          viewed: false,
        },
        {
          id: 'demo2',
          userId: 'demo-user2',
          userName: 'John Doe',
          avatar: require('@/assets/images/profile-pictures/image-01.jpg'),
          media: undefined,
          text: 'Check out my latest project update!',
          stickers: ['💻', '🚀'],
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          viewed: false,
        },
        {
          id: 'demo3',
          userId: 'demo-user3',
          userName: 'Emma Davis',
          avatar: require('@/assets/images/profile-pictures/image-06.webp'),
          media: undefined,
          text: 'Enjoying a sunny day at the park! ☀️',
          stickers: ['☀️', '🌳'],
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          viewed: false,
        },
        {
          id: 'demo4',
          userId: 'demo-user4',
          userName: 'Alex Brown',
          avatar: require('@/assets/images/profile-pictures/image-05.avif'),
          media: undefined,
          text: 'Networking with amazing people!',
          stickers: ['🤝', '🌐'],
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          viewed: false,
        },
      ]);
    }
  }, []);

  const addStory = (story: Omit<Story, 'id' | 'createdAt' | 'expiresAt'>) => {
    const now = Date.now();
    setStories((prev) => [
      ...prev,
      {
        ...story,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000,
        viewed: false,
      },
    ]);
  };

  const markStoryViewed = (storyId: string) => {
    setStories((prev) => prev.map((s) => s.id === storyId ? { ...s, viewed: true } : s));
  };

  return (
    <StoriesContext.Provider value={{ stories, addStory, markStoryViewed }}>
      {children}
    </StoriesContext.Provider>
  );
}; 