import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
// import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import CommentButton from '../../../components/CommentButton';
import LikeButton from '../../../components/LikeButton';
import NotificationModal from '../../../components/NotificationModal';
import ProfileModal from '../../../components/ProfileModal';
import SendButton from '../../../components/SendButton';
import ShareButton from '../../../components/ShareButton';
import StoryButton from '../../../components/StoryButton';
import StoryViewer from '../../../components/StoryViewer';
import VideoPlayer from '../../../components/VideoPlayer';
import { useStories } from '../../../contexts/StoriesContext';
import { useTabBarVisibility } from '../../../contexts/TabBarVisibilityContext';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import { useProfileNavigation } from '../../../contexts/ProfileNavigationContext';
import { useProfile } from '../../../contexts/ProfileContext';
import Sidebar from './Sidebar';
import {
  HomeSearchHeader
} from './components';
import MyProfileScreen from '../profile/MyProfileScreen';
import { usePosts } from '../../contexts/PostsContext';
import Menu from '../../../components/Menu';
import Snackbar from '../../../components/Snackbar';

const { width } = Dimensions.get('window');

// Type definitions
interface Post {
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

interface SuggestedConnection {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: any;
  isPending: boolean;
}

interface QuickAction {
  id: number;
  title: string;
  icon: string;
  color: string;
}

interface TrendingTopic {
  id: number;
  title: string;
  posts: number;
  category: string;
}

// Profile picture mapping by name
const getProfilePicture = (name: string) => {
  const profilePictures: { [key: string]: any } = {
    'John Doe': require('@/assets/images/profile-pictures/image-01.jpg'),
    'Jane Smith': require('@/assets/images/profile-pictures/image-02.webp'),
    'Mike Johnson': require('@/assets/images/profile-pictures/image-03.jpg'),
    'Sarah Wilson': require('@/assets/images/profile-pictures/image-04.jpeg'),
    'Alex Brown': require('@/assets/images/profile-pictures/image-05.avif'),
    'Emma Davis': require('@/assets/images/profile-pictures/image-06.webp'),
    'Tom Wilson': require('@/assets/images/profile-pictures/image-07.jpg'),
    'David Chen': require('@/assets/images/profile-pictures/image-01.jpg'),
    'Lisa Rodriguez': require('@/assets/images/profile-pictures/image-02.webp'),
  };
  
  return profilePictures[name] || require('@/assets/images/default-avator.jpg');
};

// LinkedIn-style quick actions
const quickActions: QuickAction[] = [
  { id: 1, title: 'Write a post', icon: 'pencil', color: 'primary' },
  { id: 2, title: 'Add photo', icon: 'camera', color: 'primary' },
  { id: 3, title: 'Add video', icon: 'video', color: 'primary' },
];

// LinkedIn-style trending topics
const trendingTopics: TrendingTopic[] = [
  { id: 1, title: 'Remote Work', posts: 12500, category: 'Technology' },
  { id: 2, title: 'AI & Machine Learning', posts: 8900, category: 'Technology' },
  { id: 3, title: 'Career Growth', posts: 6700, category: 'Professional Development' },
  { id: 4, title: 'Networking Tips', posts: 5400, category: 'Professional Development' },
];

// Mock data
const posts: Post[] = [
  {
    id: 1,
    author: 'John Doe',
    avatar: getProfilePicture('John Doe'),
    company: 'Tech Solutions Inc.',
    time: '2h ago',
    content: 'Excited to share that I\'ve just completed a major project! The team worked incredibly hard and the results are amazing. #TechInnovation #TeamWork',
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    author: 'Jane Smith',
    avatar: getProfilePicture('Jane Smith'),
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
    avatar: getProfilePicture('David Chen'),
    company: 'CyberSec Solutions',
    time: '1h ago',
    content: 'Just finished implementing advanced threat detection systems for our clients. Cybersecurity is more critical than ever in today\'s digital landscape. Here\'s a glimpse of our latest security architecture. #Cybersecurity #ThreatDetection #DigitalSecurity',
    images: [require('@/assets/images/post-pictures/cyber-security-image.jpg')],
    likes: 42,
    comments: 18,
    shares: 12,
  },
  {
    id: 4,
    author: 'Lisa Rodriguez',
    avatar: getProfilePicture('Lisa Rodriguez'),
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

const initialSuggestedConnections: SuggestedConnection[] = [
  { id: 1, name: 'Alex Brown', title: 'Software Engineer', company: 'Google', avatar: getProfilePicture('Alex Brown'), isPending: false },
  { id: 2, name: 'Emma Davis', title: 'Product Manager', company: 'Microsoft', avatar: getProfilePicture('Emma Davis'), isPending: false },
  { id: 3, name: 'Tom Wilson', title: 'UX Designer', company: 'Apple', avatar: getProfilePicture('Tom Wilson'), isPending: false },
  { id: 4, name: 'David Chen', title: 'Cybersecurity Specialist', company: 'CyberSec Solutions', avatar: getProfilePicture('David Chen'), isPending: false },
  { id: 5, name: 'Lisa Rodriguez', title: 'Content Creator', company: 'Creative Studios', avatar: getProfilePicture('Lisa Rodriguez'), isPending: false },
];

interface HomeScreenProps {
  userAvatar?: string | null;
  createdProfile?: any;
  navigation?: any;
  setCurrentScreen?: (screen: string) => void;
  setCreatedProfile: (profile: any | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
  setIsProfileComplete: (complete: boolean) => void;
}

export default function HomeScreen({ userAvatar, createdProfile, navigation, setCurrentScreen, setCreatedProfile, setIsAuthenticated, setIsProfileComplete }: HomeScreenProps) {
  const theme = useCurrentTheme();
  const { tabBarTranslateY } = useTabBarVisibility();
  const { stories } = useStories();
  const { openProfile } = useProfileNavigation();
  const { avatarUrl, profileData } = useProfile();
  const { posts } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [suggestedConnections, setSuggestedConnections] = useState<SuggestedConnection[]>(initialSuggestedConnections);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [meModalVisible, setMeModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState<any[]>([]);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ top: number; right: number } | undefined>(undefined);
  const [menuPost, setMenuPost] = useState<Post | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const pinchRef = useRef(null);
  const panRef = useRef(null);

  // Temporarily disable gesture handlers to isolate the issue
  // const onPinchGestureEvent = (event: any) => {
  //   // Gesture handler logic
  // };

  // const onPanGestureEvent = (event: any) => {
  //   // Gesture handler logic
  // };

  // const onPinchStateChange = (event: any) => {
  //   // Handle pinch end
  // };

  // const onPanStateChange = (event: any) => {
  //   // Handle pan end
  // };
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  // Helper to build a mock profile object from user data
  const buildProfile = (user: any) => {
    // Use ProfileContext data if this is the current user
    if (profileData && user.id === profileData.id) {
      return {
        id: profileData.id,
        name: `${profileData.firstName} ${profileData.lastName}`,
        title: profileData.headline,
        company: profileData.currentCompany,
        avatar: avatarUrl && typeof avatarUrl === 'string' ? { uri: avatarUrl } : require('@/assets/images/Avator-Image.jpg'),
        mutualConnections: 12,
        isOnline: true,
        isConnected: false,
        isPending: false,
        isSuggested: false,
        location: profileData.location,
        about: profileData.summary,
        experience: profileData.workExperience,
        education: profileData.education,
        skills: profileData.skills,
      };
    }
    
    return {
      id: user.id?.toString() || '',
      name: user.name || user.author || '',
      title: user.title || user.company || 'Professional',
      company: user.company || '',
      avatar: user.avatar,
      mutualConnections: 12,
      isOnline: true,
      isConnected: false,
      isPending: false,
      isSuggested: false,
      location: 'San Francisco, CA',
      about: 'Experienced professional passionate about networking and growth.',
      experience: [
        { id: '1', title: 'Senior Developer', company: user.company || 'Company', duration: '2 yrs', description: 'Worked on various projects.' }
      ],
      education: [
        { id: '1', degree: 'Bachelor\'s Degree', school: 'University', year: '2020' }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    };
  };

  const handleProfilePress = (user: any) => {
    const profileData = buildProfile(user);
    openProfile(profileData);
  };

  const handleConnect = (id: number, name: string) => {
    setSuggestedConnections(prev => prev.map(conn =>
      conn.id === id ? { ...conn, isPending: true } : conn
    ));
    // Optionally show a Snackbar or feedback
  };

  const handleVideoPress = (video: any) => {
    setSelectedVideo(video);
    setVideoPlayerVisible(true);
  };

  const handleQuickAction = (action: QuickAction) => {
    switch (action.title) {
      case 'Write a post':
      case 'Add photo':
      case 'Add video':
        // Navigate to post screen
        if (navigation) {
          navigation.navigate('Post');
        } else {
          console.log(`Navigating to post screen for: ${action.title}`);
          setSnackbar({ visible: true, message: `Navigating to post screen for: ${action.title}`, type: 'info' });
        }
        break;
      default:
        setSnackbar({ visible: true, message: `You selected: ${action.title}`, type: 'info' });
    }
  };

  const openImageModal = (images: any[], index: number) => {
    setModalImages(images);
    setModalImageIndex(index);
    setImageModalVisible(true);
  };

  const handleMenuPress = (post: Post) => {
    setMenuPost(post);
    setMenuVisible(true);
  };

  // Update renderStory to use the expanded story model
  const renderStory = ({ item, index }: { item: any, index: number }) => (
    <StoryButton 
      story={item} 
      isUserStory={item.userName === 'Your Story'}
      onPress={() => {
        if (item.userName === 'Your Story') return;
        setSelectedStoryIndex(index);
        setStoryViewerVisible(true);
      }}
    />
  );

  const renderQuickAction = ({ item }: { item: QuickAction }) => {
    const getButtonColor = () => {
      switch (item.color) {
        case 'primary':
          return theme.primaryColor;
        case 'secondary':
          return theme.textSecondaryColor;
        default:
          return theme.primaryColor;
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.quickActionButton, { backgroundColor: getButtonColor() }]}
        onPress={() => handleQuickAction(item)}
      >
        <MaterialCommunityIcons name={item.icon as any} size={20} color="#fff" />
        <Text style={styles.quickActionText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderTrendingTopic = ({ item }: { item: TrendingTopic }) => (
    <TouchableOpacity style={[styles.trendingTopic, { backgroundColor: theme.cardColor }]}>
      <View style={styles.trendingTopicHeader}>
        <Text style={[styles.trendingTopicTitle, { color: theme.textColor }]}>{item.title}</Text>
        <Text style={[styles.trendingTopicCategory, { backgroundColor: theme.surfaceColor, color: theme.textSecondaryColor }]}>{item.category}</Text>
      </View>
      <Text style={[styles.trendingTopicPosts, { color: theme.textTertiaryColor }]}>{item.posts.toLocaleString()} posts</Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: Post }) => {
    // Only show video if present
    if (item.video) {
      return (
    <View style={[styles.post, { backgroundColor: theme.cardColor }]}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => handleProfilePress(item)}>
          <Image source={item.avatar} style={styles.postAvatar} />
        </TouchableOpacity>
        <View style={styles.postInfo}>
          <Text style={[styles.postAuthor, { color: theme.textColor }]}>{item.author}</Text>
          <Text style={[styles.postCompany, { color: theme.textSecondaryColor }]}>{item.company}</Text>
          <Text style={[styles.postTime, { color: theme.textTertiaryColor }]}>{item.time}</Text>
        </View>
            {item.author === 'Your Name' && (
              <TouchableOpacity style={styles.postOptions} onPress={() => handleMenuPress(item)}>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color={theme.textSecondaryColor} />
        </TouchableOpacity>
            )}
      </View>
      
      <Text style={[styles.postContent, { color: theme.textColor }]}>{item.content}</Text>
      
        <View style={styles.postVideoContainer}>
          <TouchableOpacity 
              style={{ width: '100%', height: 300, borderRadius: 12 }}
            onPress={() => handleVideoPress(item.video)}
          >
              {item.video.thumbnail ? (
                <View style={{ width: '100%', height: 300, borderRadius: 12, overflow: 'hidden' }}>
                  <Image source={item.video.thumbnail} style={{ width: '100%', height: 300, borderRadius: 12, position: 'absolute' }} resizeMode="cover" />
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 12 }} />
                </View>
              ) : (
                <View style={{ width: '100%', height: 300, backgroundColor: '#000', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="play" size={48} color="#fff" />
                </View>
              )}
            <View style={styles.videoOverlay}>
              <View style={styles.playButton}>
                <MaterialCommunityIcons name="play" size={24} color="#fff" />
              </View>
                {item.video.duration ? (
              <View style={styles.videoDuration}>
                <Text style={styles.videoDurationText}>{item.video.duration}</Text>
              </View>
                ) : null}
            </View>
          </TouchableOpacity>
        </View>
          
          <View style={[styles.postActions, { borderTopColor: theme.borderColor }]}>
            <LikeButton 
              initialLiked={false}
              initialLikeCount={item.likes}
              onLikeChange={(liked, count) => {
                console.log(`Post ${item.id}: ${liked ? 'Liked' : 'Unliked'}, Count: ${count}`);
              }}
              size="medium"
              showCount={true}
            />
            <CommentButton 
              postId={item.id}
              postAuthor={item.author}
              commentCount={item.comments}
              onPress={() => {
                console.log(`Opening comments for post ${item.id}`);
              }}
              showText={true}
            />
            <ShareButton 
              postId={item.id}
              postAuthor={item.author}
              postContent={item.content}
              shareCount={item.shares}
              onPress={() => {
                console.log(`Opening share options for post ${item.id}`);
              }}
              showText={true}
            />
            <SendButton 
              postId={item.id}
              postAuthor={item.author}
              postContent={item.content}
              sendCount={0}
              onPress={() => {
                console.log(`Opening send options for post ${item.id}`);
              }}
              showText={true}
            />
          </View>
        </View>
      );
    }
    // If images present, show each image full width
    if (item.images && item.images.length > 0) {
      return (
        <View style={[styles.post, { backgroundColor: theme.cardColor }]}>
          <View style={styles.postHeader}>
            <TouchableOpacity onPress={() => handleProfilePress(item)}>
              <Image source={item.avatar} style={styles.postAvatar} />
            </TouchableOpacity>
            <View style={styles.postInfo}>
              <Text style={[styles.postAuthor, { color: theme.textColor }]}>{item.author}</Text>
              <Text style={[styles.postCompany, { color: theme.textSecondaryColor }]}>{item.company}</Text>
              <Text style={[styles.postTime, { color: theme.textTertiaryColor }]}>{item.time}</Text>
            </View>
            {item.author === 'Your Name' && (
              <TouchableOpacity style={styles.postOptions} onPress={() => handleMenuPress(item)}>
                <MaterialCommunityIcons name="dots-horizontal" size={20} color={theme.textSecondaryColor} />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={[styles.postContent, { color: theme.textColor }]}>{item.content}</Text>
          
          {(item.images || []).map((img: any, idx: number) => (
            <TouchableOpacity key={idx} onPress={() => openImageModal(item.images || [], idx)}>
              <Image source={typeof img === 'string' ? { uri: img } : img} style={{ width: '100%', height: 300, borderRadius: 12, marginBottom: 8 }} resizeMode="cover" />
            </TouchableOpacity>
          ))}
      
      <View style={[styles.postActions, { borderTopColor: theme.borderColor }]}>
        <LikeButton 
          initialLiked={false}
          initialLikeCount={item.likes}
          onLikeChange={(liked, count) => {
            console.log(`Post ${item.id}: ${liked ? 'Liked' : 'Unliked'}, Count: ${count}`);
          }}
          size="medium"
          showCount={true}
        />
        <CommentButton 
          postId={item.id}
          postAuthor={item.author}
          commentCount={item.comments}
          onPress={() => {
            console.log(`Opening comments for post ${item.id}`);
          }}
          showText={true}
        />
        <ShareButton 
          postId={item.id}
          postAuthor={item.author}
          postContent={item.content}
          shareCount={item.shares}
          onPress={() => {
            console.log(`Opening share options for post ${item.id}`);
          }}
          showText={true}
        />
        <SendButton 
          postId={item.id}
          postAuthor={item.author}
          postContent={item.content}
          sendCount={0}
          onPress={() => {
            console.log(`Opening send options for post ${item.id}`);
          }}
          showText={true}
        />
      </View>
    </View>
  );
    }
    // ...no media, just content...
    return (
      <View style={[styles.post, { backgroundColor: theme.cardColor }]}>
        <View style={styles.postHeader}>
          <TouchableOpacity onPress={() => handleProfilePress(item)}>
            <Image source={item.avatar} style={styles.postAvatar} />
          </TouchableOpacity>
          <View style={styles.postInfo}>
            <Text style={[styles.postAuthor, { color: theme.textColor }]}>{item.author}</Text>
            <Text style={[styles.postCompany, { color: theme.textSecondaryColor }]}>{item.company}</Text>
            <Text style={[styles.postTime, { color: theme.textTertiaryColor }]}>{item.time}</Text>
          </View>
          {item.author === 'Your Name' && (
            <TouchableOpacity style={styles.postOptions} onPress={() => handleMenuPress(item)}>
              <MaterialCommunityIcons name="dots-horizontal" size={20} color={theme.textSecondaryColor} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={[styles.postContent, { color: theme.textColor }]}>{item.content}</Text>
        
        <View style={[styles.postActions, { borderTopColor: theme.borderColor }]}>
          <LikeButton 
            initialLiked={false}
            initialLikeCount={item.likes}
            onLikeChange={(liked, count) => {
              console.log(`Post ${item.id}: ${liked ? 'Liked' : 'Unliked'}, Count: ${count}`);
            }}
            size="medium"
            showCount={true}
          />
          <CommentButton 
            postId={item.id}
            postAuthor={item.author}
            commentCount={item.comments}
            onPress={() => {
              console.log(`Opening comments for post ${item.id}`);
            }}
            showText={true}
          />
          <ShareButton 
            postId={item.id}
            postAuthor={item.author}
            postContent={item.content}
            shareCount={item.shares}
            onPress={() => {
              console.log(`Opening share options for post ${item.id}`);
            }}
            showText={true}
          />
          <SendButton 
            postId={item.id}
            postAuthor={item.author}
            postContent={item.content}
            sendCount={0}
            onPress={() => {
              console.log(`Opening send options for post ${item.id}`);
            }}
            showText={true}
          />
        </View>
      </View>
    );
  };

  const renderSuggestedConnection = ({ item }: { item: SuggestedConnection }) => (
    <View style={[styles.suggestedConnection, { backgroundColor: theme.cardColor }]}>
      <TouchableOpacity onPress={() => handleProfilePress(item)}>
        <Image source={item.avatar} style={styles.suggestedAvatar} />
      </TouchableOpacity>
      <View style={styles.suggestedInfo}>
        <Text style={[styles.suggestedName, { color: theme.textColor }]}>{item.name}</Text>
        <Text style={[styles.suggestedTitle, { color: theme.textSecondaryColor }]}>{item.title}</Text>
        <Text style={[styles.suggestedCompany, { color: theme.textTertiaryColor }]}>{item.company}</Text>
      </View>
      {!item.isPending ? (
      <TouchableOpacity 
        style={[styles.connectButton, { backgroundColor: theme.primaryColor }]} 
        onPress={() => handleConnect(item.id, item.name)}
      >
        <Text style={[styles.connectButtonText, { color: theme.textColor }]}>Connect</Text>
      </TouchableOpacity>
      ) : (
        <View style={[styles.connectButton, { backgroundColor: theme.surfaceColor, opacity: 0.6 }]}> 
          <Text style={[styles.connectButtonText, { color: theme.primaryColor }]}>Pending</Text>
        </View>
      )}
    </View>
  );

  // Track last scroll offset for direction
  let lastOffsetY = 0;
  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Temporarily disable tab bar animation to isolate the issue
      // const offsetY = event.contentOffset.y;
      // if (offsetY > lastOffsetY + 10) {
      //   // Scrolling down, hide tab bar
      //   tabBarTranslateY.value = 100;
      // } else if (offsetY < lastOffsetY - 10) {
      //   // Scrolling up, show tab bar
      //   tabBarTranslateY.value = 0;
      // }
      // lastOffsetY = offsetY;
    },
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh (in a real app, fetch new posts from backend)
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}> 
      <Animated.ScrollView
        style={[styles.content, { backgroundColor: theme.backgroundColor }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      {/* Header */}
        <HomeSearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onProfilePress={() => setShowDashboard(true)}
          onNotificationPress={() => setNotificationModalVisible(true)}
          userAvatar={userAvatar}
        />

        {/* LinkedIn-style Quick Actions */}
        <View style={styles.section}>
          <View style={[styles.quickActionsContainer, { backgroundColor: theme.cardColor }]}>
            <FlatList
              data={quickActions}
              renderItem={renderQuickAction}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsList}
            />
          </View>
        </View>

        {/* Stories Section */}
        <View style={[styles.section, { marginTop: -8 }]}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Stories</Text>
          <FlatList
            data={stories}
            renderItem={({ item, index }) => renderStory({ item, index })}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContainer}
          />
        </View>

        {/* LinkedIn-style Trending Topics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Trending</Text>
          <FlatList
            data={trendingTopics}
            renderItem={renderTrendingTopic}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingTopicsList}
          />
        </View>

        {/* Feed Posts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Recent Posts</Text>
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Suggested Connections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>People you may know</Text>
          <FlatList
            data={suggestedConnections}
            renderItem={renderSuggestedConnection}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </Animated.ScrollView>
      
      {/* Sidebar Overlay */}
      {showDashboard && (
        <Sidebar
          userAvatar={userAvatar}
          onClose={() => setShowDashboard(false)}
          onMePress={() => setMeModalVisible(true)}
          onMessagesPress={() => {
            if (navigation) {
              navigation.navigate('Messages');
            }
            setShowDashboard(false);
          }}
          setCurrentScreen={setCurrentScreen}
          setCreatedProfile={setCreatedProfile}
          setIsAuthenticated={setIsAuthenticated}
          setIsProfileComplete={setIsProfileComplete}
        />
      )}
      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          profile={selectedProfile}
        />
      )}
      {/* Notification Modal */}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
      />
      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          source={selectedVideo}
          onClose={() => {
            setVideoPlayerVisible(false);
            setSelectedVideo(null);
          }}
        />
      )}
      {/* Story Viewer Modal */}
      <StoryViewer
        visible={storyViewerVisible}
        initialIndex={selectedStoryIndex}
        onClose={() => setStoryViewerVisible(false)}
      />
      {/* MeScreen Modal */}
      {meModalVisible && (
      <Modal visible={meModalVisible} animationType="slide" onRequestClose={() => setMeModalVisible(false)}>
          <MyProfileScreen
            profile={createdProfile ? {
              id: createdProfile.id?.toString() || '',
              name: createdProfile.firstName + ' ' + createdProfile.lastName,
              title: createdProfile.headline || '',
              company: createdProfile.currentCompany || '',
              location: createdProfile.location || '',
              avatar: createdProfile.avatarUri ? { uri: createdProfile.avatarUri } : require('@/assets/images/Avator-Image.jpg'),
              headerImage: undefined,
              about: createdProfile.summary || '',
              experience: createdProfile.workExperience || [],
              education: createdProfile.education || [],
              skills: createdProfile.skills || [],
              mutualConnections: 0,
              isConnected: false,
              profileViews: createdProfile.profileViews || 0,
              followers: createdProfile.followers || 0,
            } : {
              id: '1',
              name: 'Your Name',
              title: 'Your Headline/Title',
              company: '',
              location: 'Your Location',
              avatar: userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg'),
              headerImage: undefined,
              about: 'Add a short bio about yourself, your experience, or your goals.',
              experience: [],
              education: [],
              skills: [],
              mutualConnections: 0,
              isConnected: false,
              profileViews: 0,
              followers: 0,
            }}
            onBack={() => setMeModalVisible(false)}
          />
        <TouchableOpacity style={{ position: 'absolute', top: 40, right: 24, zIndex: 100 }} onPress={() => setMeModalVisible(false)}>
          <MaterialCommunityIcons name="close" size={32} color="#222" />
        </TouchableOpacity>
      </Modal>
      )}
      {imageModalVisible && (
        <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={() => setImageModalVisible(false)}>
          <View style={styles.imageModalOverlay}>
            <TouchableOpacity style={styles.imageModalClose} onPress={() => setImageModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={32} color="#fff" />
            </TouchableOpacity>
            <FlatList
              data={modalImages}
              horizontal
              pagingEnabled
              initialScrollIndex={modalImageIndex}
              getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
              renderItem={({ item }) => (
                <View style={{ width, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  {/* Temporarily disable gesture handlers to isolate the issue */}
                  {/* <PanGestureHandler
                    ref={panRef}
                    simultaneousHandlers={pinchRef}
                    onGestureEvent={onPanGestureEvent}
                    onHandlerStateChange={onPanStateChange}
                  >
                    <Animated.View>
                      <PinchGestureHandler
                        ref={pinchRef}
                        simultaneousHandlers={panRef}
                        onGestureEvent={onPinchGestureEvent}
                        onHandlerStateChange={onPinchStateChange}
                      > */}
                        <Animated.Image source={item} style={[styles.imageModalImage, animatedImageStyle]} resizeMode="contain" />
                      {/* </PinchGestureHandler>
                    </Animated.View>
                  </PanGestureHandler> */}
                </View>
              )}
              keyExtractor={(_, idx) => idx.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </Modal>
      )}
      <Menu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        options={[
          { label: 'Edit', icon: 'pencil', onPress: () => { if (menuPost) setSnackbar({ visible: true, message: `Edit post ${menuPost.id}`, type: 'info' }); } },
          { label: 'Delete', icon: 'delete', onPress: () => { if (menuPost) setSnackbar({ visible: true, message: `Delete post ${menuPost.id}`, type: 'info' }); } },
          { label: 'Report', icon: 'alert-circle-outline', onPress: () => { if (menuPost) setSnackbar({ visible: true, message: `Report post ${menuPost.id}`, type: 'info' }); } },
        ]}
        anchorPosition={menuAnchor}
      />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileButton: {
    padding: 4,
  },
  profilePicture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    flex: 1,
    height: 40,
    marginHorizontal: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 17,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  storiesContainer: {
    paddingHorizontal: 16,
  },
  quickActionsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsList: {
    alignItems: 'center',
  },
  quickActionButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    padding: 10,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  trendingTopicsList: {
    paddingHorizontal: 16,
  },
  trendingTopic: {
    marginRight: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  trendingTopicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendingTopicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendingTopicCategory: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  trendingTopicPosts: {
    fontSize: 12,
  },

  post: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e5e5',
  },
  postCompany: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  postOptions: {
    padding: 4,
  },
  postContent: {
    fontSize: 16,
    color: '#e5e5e5',
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 5,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  postActionText: {
    marginLeft: 6,
    fontSize: 14,
  },
  suggestedConnection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestedAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  suggestedInfo: {
    flex: 1,
  },
  suggestedName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e5e5',
  },
  suggestedTitle: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  suggestedCompany: {
    fontSize: 12,
    color: '#888',
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  postImageContainer: {
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  postVideoContainer: {
    marginBottom: 16,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  videoThumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  postImageGridContainer: {
    marginBottom: 16,
  },
  postImageSingle: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  postImageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  postImageHalf: {
    width: '49%', // Adjust as needed for spacing
    height: 100,
    borderRadius: 8,
  },
  postImageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postImageGridItem: {
    width: '49%', // Adjust as needed for spacing
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
  },
  postImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImageOverlayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalImage: {
    width: width - 40,
    height: '80%',
    borderRadius: 12,
  },
  imageModalClose: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
}); 