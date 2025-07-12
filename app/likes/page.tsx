"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Artist {
  id: string
  name: string
  genre: string
  image: string
}

const mockArtists: Record<string, Artist> = {
  "1": {
    id: "1",
    name: "The Weeknd",
    genre: "R&B / Pop",
    image: "/placeholder.svg?height=300&width=300",
  },
  "2": { id: "2", name: "Queen", genre: "Rock", image: "/placeholder.svg?height=300&width=300" },
  "3": {
    id: "3",
    name: "Ed Sheeran",
    genre: "Pop / Folk",
    image: "/placeholder.svg?height=300&width=300",
  },
  "4": {
    id: "4",
    name: "Daft Punk",
    genre: "Electronic",
    image: "/placeholder.svg?height=300&width=300",
  },
  "5": {
    id: "5",
    name: "Billie Eilish",
    genre: "Alternative Pop",
    image: "/placeholder.svg?height=300&width=300",
  },
  "6": {
    id: "6",
    name: "Arctic Monkeys",
    genre: "Indie Rock",
    image: "/placeholder.svg?height=300&width=300",
  },
  "7": {
    id: "7",
    name: "Taylor Swift",
    genre: "Pop / Country",
    image: "/placeholder.svg?height=300&width=300",
  },
  "8": {
    id: "8",
    name: "Radiohead",
    genre: "Alternative Rock",
    image: "/placeholder.svg?height=300&width=300",
  },
}

export default function LikesPage() {
  const [likedArtists, setLikedArtists] = useState<Artist[]>([])

  useEffect(() => {
    // Load liked artists from localStorage
    const savedLikes = localStorage.getItem("likedArtists")
    const likedArtistIds = savedLikes ? JSON.parse(savedLikes) : []

    const artists = likedArtistIds.map((id: string) => mockArtists[id]).filter(Boolean)

    setLikedArtists(artists)
  }, [])

  const handleUnlike = (artistId: string) => {
    // Remove from local state
    const updatedArtists = likedArtists.filter((artist) => artist.id !== artistId)
    setLikedArtists(updatedArtists)

    // Update localStorage
    const savedLikes = localStorage.getItem("likedArtists")
    const likedArtistIds = savedLikes ? JSON.parse(savedLikes) : []
    const updatedLikes = likedArtistIds.filter((id: string) => id !== artistId)
    localStorage.setItem("likedArtists", JSON.stringify(updatedLikes))
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Liked Artists
          </h1>
          <p className="text-gray-400 text-lg">Your favorite artists collection</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Heart className="w-4 h-4 text-pink-400 fill-current" />
          <span>{likedArtists.length} Artists Liked</span>
        </div>
      </div>

      {/* Liked Artists Grid */}
      {likedArtists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {likedArtists.map((artist) => (
            <Card
              key={artist.id}
              className="bg-gray-800/30 border-gray-700 hover:border-pink-400/50 transition-all duration-300 group cursor-pointer overflow-hidden"
            >
              <CardContent className="p-0">
                <Link href={`/artist/${artist.id}`}>
                  <div className="relative">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/artist/${artist.id}`} className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-white group-hover:text-pink-400 transition-colors truncate">
                        {artist.name}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">{artist.genre}</p>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        handleUnlike(artist.id)
                      }}
                      className="ml-2 text-pink-400 hover:text-pink-300 hover:bg-pink-400/10 transition-all duration-200 hover:scale-110"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Click to explore</span>
                    <span className="text-pink-400 font-medium">♥ Liked</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No liked artists yet</h3>
          <p className="text-gray-400 mb-6">Start exploring artists and like your favorites</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 transition-all duration-300">
              <Users className="w-4 h-4 mr-2" />
              Discover Artists
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
