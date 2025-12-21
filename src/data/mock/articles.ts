export interface Article {
  id: number;
  image: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  reads: string;
  publishedAt: string;
  status: "Published" | "Draft" | "Pending";
}

export const categories = [
  { id: 1, emoji: "🧬", label: "Biology", backgroundColor: "#10B981" },
  { id: 2, emoji: "⚗️", label: "Chemistry", backgroundColor: "#3B82F6" },
  { id: 3, emoji: "⚛️", label: "Physics", backgroundColor: "#8B5CF6" },
  { id: 4, emoji: "🌍", label: "Geography", backgroundColor: "#06B6D4" },
  { id: 5, emoji: "📜", label: "History", backgroundColor: "#F59E0B" },
  { id: 6, emoji: "💻", label: "Technology", backgroundColor: "#6366F1" },
  { id: 7, emoji: "🧮", label: "Mathematics", backgroundColor: "#EC4899" },
  { id: 8, emoji: "🎨", label: "Arts", backgroundColor: "#EF4444" },
];

export const mockArticles: Article[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?_gl=1*1a588bx*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzAkdDE3NjYwNzg1NTQkajYwJGwwJGgw",
    title: "The Future of Quantum Computing and Its Impact on Cryptography",
    author: "Dr. Sarah Johnson, Prof. Michael Chen",
    category: "Technology",
    rating: 4.8,
    reads: "12.5K",
    publishedAt: "2025-01-15",
    status: "Published",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/936611/pexels-photo-936611.jpeg?_gl=1*hf2sot*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzEkdDE3NjYwNzg2MDAkajE0JGwwJGgw",
    title: "Understanding CRISPR: The Revolutionary Gene Editing Tool",
    author: "Dr. Emily Rodriguez, Dr. James Park, Dr. Lisa Wang",
    category: "Biology",
    rating: 4.9,
    reads: "18.2K",
    publishedAt: "2025-01-14",
    status: "Published",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?_gl=1*1a588bx*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzAkdDE3NjYwNzg1NTQkajYwJGwwJGgw",
    title: "Climate Change: Analyzing Global Temperature Trends",
    author: "Prof. David Thompson",
    category: "Geography",
    rating: 4.7,
    reads: "9.8K",
    publishedAt: "2025-01-13",
    status: "Published",
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?_gl=1*1a588bx*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzAkdDE3NjYwNzg1NTQkajYwJGwwJGgw",
    title: "The Renaissance Period: Art and Cultural Revolution",
    author: "Dr. Maria Gonzalez, Prof. Robert Anderson",
    category: "Arts",
    rating: 4.6,
    reads: "7.3K",
    publishedAt: "2025-01-12",
    status: "Published",
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?_gl=1*1a588bx*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzAkdDE3NjYwNzg1NTQkajYwJGwwJGgw",
    title: "Introduction to Calculus: Derivatives and Integrals",
    author: "Prof. John Smith",
    category: "Mathematics",
    rating: 4.5,
    reads: "15.7K",
    publishedAt: "2025-01-11",
    status: "Published",
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/936611/pexels-photo-936611.jpeg?_gl=1*hf2sot*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzEkdDE3NjYwNzg2MDAkajE0JGwwJGgw",
    title: "Chemical Reactions: Understanding Molecular Bonds",
    author: "Dr. Anna Williams, Dr. Tom Baker",
    category: "Chemistry",
    rating: 4.7,
    reads: "11.2K",
    publishedAt: "2025-01-10",
    status: "Published",
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?_gl=1*1a588bx*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzAkdDE3NjYwNzg1NTQkajYwJGwwJGgw",
    title: "Newton's Laws of Motion Explained with Real Examples",
    author: "Prof. Richard Lee",
    category: "Physics",
    rating: 4.8,
    reads: "13.9K",
    publishedAt: "2025-01-09",
    status: "Published",
  },
  {
    id: 8,
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?_gl=1*1a588bx*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzAkdDE3NjYwNzg1NTQkajYwJGwwJGgw",
    title: "World War II: Key Events and Their Global Impact",
    author: "Dr. Patricia Brown, Prof. William Davis, Dr. Karen Miller",
    category: "History",
    rating: 4.9,
    reads: "20.1K",
    publishedAt: "2025-01-08",
    status: "Published",
  },
  {
    id: 9,
    image: "https://images.pexels.com/photos/936611/pexels-photo-936611.jpeg?_gl=1*hf2sot*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzEkdDE3NjYwNzg2MDAkajE0JGwwJGgw",
    title: "Machine Learning Basics: Neural Networks Demystified",
    author: "Dr. Alex Turner",
    category: "Technology",
    rating: 4.8,
    reads: "16.4K",
    publishedAt: "2025-01-07",
    status: "Published",
  },
  {
    id: 10,
    image: "https://images.pexels.com/photos/936611/pexels-photo-936611.jpeg?_gl=1*hf2sot*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzEkdDE3NjYwNzg2MDAkajE0JGwwJGgw",
    title: "Photosynthesis: The Process That Powers Life on Earth",
    author: "Dr. Jennifer White",
    category: "Biology",
    rating: 4.6,
    reads: "10.5K",
    publishedAt: "2025-01-06",
    status: "Published",
  },
  {
    id: 11,
    image: "https://images.pexels.com/photos/936611/pexels-photo-936611.jpeg?_gl=1*hf2sot*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzEkdDE3NjYwNzg2MDAkajE0JGwwJGgw",
    title: "Understanding Ocean Currents and Weather Patterns",
    author: "Prof. Mark Johnson, Dr. Susan Taylor",
    category: "Geography",
    rating: 4.7,
    reads: "8.9K",
    publishedAt: "2025-01-05",
    status: "Published",
  },
  {
    id: 12,
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?_gl=1*1a588bx*_ga*MTMzNzk2NTAwLjE3NjA5MDE1OTI.*_ga_8JE65Q40S6*czE3NjYwNzg1NTQkbzUkZzAkdDE3NjYwNzg1NTQkajYwJGwwJGgw",
    title: "Modern Art Movements: From Cubism to Abstract",
    author: "Dr. Laura Martinez",
    category: "Arts",
    rating: 4.5,
    reads: "6.7K",
    publishedAt: "2025-01-04",
    status: "Published",
  },
];

// Sort articles for different sections
export const getMostPopularArticles = () => {
  return [...mockArticles].sort((a, b) => {
    const readsA = parseFloat(a.reads.replace("K", "")) * 1000;
    const readsB = parseFloat(b.reads.replace("K", "")) * 1000;
    return readsB - readsA;
  }).slice(0, 6);
};

export const getRecentlyAddedArticles = () => {
  return [...mockArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);
};

export const getTopThisWeekArticles = () => {
  return [...mockArticles].sort((a, b) => b.rating - a.rating).slice(0, 6);
};

export const getArticlesByCategory = (category: string) => {
  if (category === "All") return mockArticles;
  return mockArticles.filter((article) => article.category === category);
};
