import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Post {
  id: number;
  author: string;
  avatar: any;
  company: string;
  time: string;
  content: string;
  image?: any;
  images?: any[];
  video?: {
    uri: string;
    thumbnail: any;
    duration: string;
  };
  likes: number;
  comments: number;
  shares: number;
}

interface PostsContextType {
  posts: Post[];
  addPost: (post: Post) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const initialPosts: Post[] = [
  {
    id: 1,
    author: 'John Doe',
    avatar: require('@/assets/images/profile-pictures/image-01.jpg'),
    company: 'Tech Solutions Inc.',
    time: '2h ago',
    content: "Excited to share that I've just completed a major project! The team worked incredibly hard and the results are amazing. #TechInnovation #TeamWork",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    author: 'Jane Smith',
    avatar: require('@/assets/images/profile-pictures/image-02.webp'),
    company: 'Digital Marketing Pro',
    time: '4h ago',
    content: 'Just published a new article about the future of digital marketing. Check it out and let me know your thoughts!',
    likes: 15,
    comments: 12,
    shares: 5,
  },
  {
    id: 3,
    author: 'David Chen',
    avatar: require('@/assets/images/profile-pictures/image-01.jpg'),
    company: 'CyberSec Solutions',
    time: '1h ago',
    content: "Just finished implementing advanced threat detection systems for our clients. Cybersecurity is more critical than ever in today's digital landscape. Here's a glimpse of our latest security architecture. #Cybersecurity #ThreatDetection #DigitalSecurity",
    images: [require('@/assets/images/post-pictures/cyber-security-image.jpg')],
    likes: 42,
    comments: 18,
    shares: 12,
  },
  {
    id: 4,
    author: 'Lisa Rodriguez',
    avatar: require('@/assets/images/profile-pictures/image-03.jpg'),
    company: 'Creative Studios',
    time: '15m ago',
    content: '🎬 New tutorial alert! Just created this comprehensive guide on React Native state management. Learn how to properly handle state with hooks and context. Perfect for beginners and intermediate developers! #ReactNative #StateManagement #MobileDevelopment #CodingTutorial',
    video: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: require('@/assets/images/profile-pictures/image-03.jpg'),
      duration: '4:12',
    },
    likes: 35,
    comments: 22,
    shares: 14,
  },
  {
    id: 5,
    author: 'NetworkPro Team',
    avatar: require('@/assets/images/networkpro-logo.png'),
    company: 'NetworkPro App',
    time: '2h ago',
    content: '🎬 Discover the power of professional networking with NetworkPro! Watch how our app helps you build meaningful connections, discover job opportunities, and grow your career. From smart profile matching to real-time messaging, see how NetworkPro is revolutionizing professional networking. Experience the features that make networking effortless and effective. #NetworkPro #ProfessionalNetworking #CareerGrowth #SmartConnections',
    video: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: require('@/assets/images/networkpro-logo.png'),
      duration: '2:45',
    },
    likes: 89,
    comments: 45,
    shares: 67,
  },
];

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  return (
    <PostsContext.Provider value={{ posts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts must be used within a PostsProvider');
  return context;
}

// Add default export to fix the warning
export default PostsProvider; 