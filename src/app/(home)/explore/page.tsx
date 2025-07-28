import Explore from "@/src/components/Explore";
import { QUERIES } from "@/src/server/db/queries";

const mockPublicMaps = [
  {
    id: "1",
    title: "Renaissance Art Movement",
    description:
      "Exploring the key figures, works, and cultural impact of Renaissance art",
    nodeCount: 24,
    edgeCount: 45,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    isPublic: true,
    tags: ["Art", "History", "Culture"],
    author: "Dr. Sarah Chen",
    likes: 156,
    views: 1240,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals",
    description: "Core concepts, algorithms, and applications in modern ML",
    nodeCount: 18,
    edgeCount: 32,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    isPublic: true,
    tags: ["Technology", "AI", "Computer Science"],
    author: "Prof. Michael Rodriguez",
    likes: 203,
    views: 1890,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Climate Change Science",
    description:
      "Understanding the causes, effects, and solutions to climate change",
    nodeCount: 31,
    edgeCount: 58,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-15",
    isPublic: true,
    tags: ["Science", "Environment", "Policy"],
    author: "Dr. Emma Thompson",
    likes: 89,
    views: 756,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "Ancient Greek Philosophy",
    description:
      "Major philosophers, schools of thought, and their lasting influence",
    nodeCount: 28,
    edgeCount: 52,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
    isPublic: true,
    tags: ["Philosophy", "History", "Ancient Greece"],
    author: "Prof. James Wilson",
    likes: 134,
    views: 982,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    title: "World War II Timeline",
    description:
      "Key events, battles, and turning points of the Second World War",
    nodeCount: 42,
    edgeCount: 78,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
    isPublic: true,
    tags: ["History", "War", "20th Century"],
    author: "Dr. Robert Kim",
    likes: 267,
    views: 2150,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    title: "Quantum Physics Basics",
    description: "Fundamental principles and phenomena in quantum mechanics",
    nodeCount: 22,
    edgeCount: 38,
    createdAt: "2024-01-14",
    updatedAt: "2024-01-21",
    isPublic: true,
    tags: ["Physics", "Science", "Quantum"],
    author: "Dr. Lisa Park",
    likes: 178,
    views: 1456,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
];

export default async function ExplorePage() {
  const exploreMaps = await QUERIES.getExploreMaps();

  return <Explore exploreMaps={exploreMaps} />;
}
