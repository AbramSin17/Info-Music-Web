"use client"

import { useState, useEffect } from "react"
import { ArtistCard } from "@/components/artist-card"
import { Input } from "@/components/ui/input"
import { Search, Users, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Artist {
  id: string
  name: string
  genre: string
  image: string
  isLiked: boolean
}

const mockArtists: Artist[] = [
  {
    id: "1",
    name: "The Weeknd",
    genre: "R&B / Pop",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
  {
    id: "2",
    name: "Queen",
    genre: "Rock",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: true,
  },
  {
    id: "3",
    name: "Ed Sheeran",
    genre: "Pop / Folk",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
  {
    id: "4",
    name: "Daft Punk",
    genre: "Electronic",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: true,
  },
  {
    id: "5",
    name: "Billie Eilish",
    genre: "Alternative Pop",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
  {
    id: "6",
    name: "Arctic Monkeys",
    genre: "Indie Rock",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
  {
    id: "7",
    name: "Taylor Swift",
    genre: "Pop / Country",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: true,
  },
  {
    id: "8",
    name: "Radiohead",
    genre: "Alternative Rock",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
]

export default function HomePage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load liked artists from localStorage
    const savedLikes = localStorage.getItem("likedArtists")
    const likedArtistIds = savedLikes ? JSON.parse(savedLikes) : []

    const artistsWithLikes = mockArtists.map((artist) => ({
      ...artist,
      isLiked: likedArtistIds.includes(artist.id),
    }))

    setArtists(artistsWithLikes)
    setLoading(false)
  }, [])

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggleLike = (artistId: string) => {
    const updatedArtists = artists.map((artist) =>
      artist.id === artistId ? { ...artist, isLiked: !artist.isLiked } : artist,
    )

    setArtists(updatedArtists)

    // Save to localStorage
    const likedArtistIds = updatedArtists.filter((artist) => artist.isLiked).map((artist) => artist.id)
    localStorage.setItem("likedArtists", JSON.stringify(likedArtistIds))
  }

  const likedCount = artists.filter((artist) => artist.isLiked).length

  if (loading) {
    return <ArtistsPageSkeleton />
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Discover Artists
          </h1>
          <p className="text-gray-400 text-lg">Explore and learn about your favorite music artists</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search artists or genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80 bg-gray-800/50 border-gray-700 focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>{artists.length} Artists</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span>{likedCount} Liked</span>
        </div>
      </div>

      {/* Artists Grid */}
      {filteredArtists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} onToggleLike={handleToggleLike} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No artists found</h3>
          <p className="text-gray-400">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  )
}

function ArtistsPageSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div>
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-10 w-80" />
      </div>

      <div className="flex items-center gap-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
            <Skeleton className="w-full h-48 mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
