"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Calendar, Disc } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface Artist {
  idArtist: string
  strArtist: string
  strBiography: string
  strArtistThumb: string
  strGenre: string
  strCountry: string
  intFormedYear: string
}

interface Album {
  idAlbum: string
  strAlbum: string
  strAlbumThumb: string
  intYearReleased: string
  strGenre: string
}

interface LocalArtist {
  id: string
  name: string
  genre: string
  image: string
  isLiked: boolean
}

const mockArtists: Record<string, LocalArtist> = {
  "1": {
    id: "1",
    name: "The Weeknd",
    genre: "R&B / Pop",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
  "2": { id: "2", name: "Queen", genre: "Rock", image: "/placeholder.svg?height=300&width=300", isLiked: true },
  "3": {
    id: "3",
    name: "Ed Sheeran",
    genre: "Pop / Folk",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
  "4": {
    id: "4",
    name: "Daft Punk",
    genre: "Electronic",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: true,
  },
  "5": {
    id: "5",
    name: "Billie Eilish",
    genre: "Alternative Pop",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
  "6": {
    id: "6",
    name: "Arctic Monkeys",
    genre: "Indie Rock",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
  "7": {
    id: "7",
    name: "Taylor Swift",
    genre: "Pop / Country",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: true,
  },
  "8": {
    id: "8",
    name: "Radiohead",
    genre: "Alternative Rock",
    image: "/placeholder.svg?height=300&width=300",
    isLiked: false,
  },
}

export default function ArtistDetailPage() {
  const params = useParams()
  const artistId = params.id as string
  const [localArtist, setLocalArtist] = useState<LocalArtist | null>(null)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchArtistData = async () => {
      setLoading(true)

      // Get local artist data
      const localArtistData = mockArtists[artistId]
      if (localArtistData) {
        setLocalArtist(localArtistData)

        // Check if liked
        const savedLikes = localStorage.getItem("likedArtists")
        const likedArtistIds = savedLikes ? JSON.parse(savedLikes) : []
        setIsLiked(likedArtistIds.includes(artistId))

        // Fetch artist data from TheAudioDB
        try {
          const artistResponse = await fetch(
            `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(localArtistData.name)}`,
          )

          if (artistResponse.ok) {
            const artistText = await artistResponse.text()
            if (artistText) {
              const artistData = JSON.parse(artistText)
              if (artistData?.artists?.length) {
                setArtist(artistData.artists[0])

                // Fetch albums for this artist
                const albumsResponse = await fetch(
                  `https://www.theaudiodb.com/api/v1/json/2/discography.php?s=${encodeURIComponent(localArtistData.name)}`,
                )

                if (albumsResponse.ok) {
                  const albumsText = await albumsResponse.text()
                  if (albumsText) {
                    const albumsData = JSON.parse(albumsText)
                    if (albumsData?.album) {
                      // Get detailed album info
                      const detailedAlbums = await Promise.all(
                        albumsData.album.slice(0, 10).map(async (album: any) => {
                          try {
                            const albumDetailResponse = await fetch(
                              `https://www.theaudiodb.com/api/v1/json/2/searchalbum.php?s=${encodeURIComponent(localArtistData.name)}&a=${encodeURIComponent(album.strAlbum)}`,
                            )
                            if (albumDetailResponse.ok) {
                              const albumDetailText = await albumDetailResponse.text()
                              if (albumDetailText) {
                                const albumDetailData = JSON.parse(albumDetailText)
                                return albumDetailData?.album?.[0] || album
                              }
                            }
                          } catch (error) {
                            console.error("Error fetching album details:", error)
                          }
                          return album
                        }),
                      )
                      setAlbums(detailedAlbums.filter(Boolean))
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error fetching artist data:", error)
        }
      }

      setLoading(false)
    }

    fetchArtistData()
  }, [artistId])

  const handleToggleLike = () => {
    const savedLikes = localStorage.getItem("likedArtists")
    const likedArtistIds = savedLikes ? JSON.parse(savedLikes) : []

    let updatedLikes
    if (isLiked) {
      updatedLikes = likedArtistIds.filter((id: string) => id !== artistId)
    } else {
      updatedLikes = [...likedArtistIds, artistId]
    }

    localStorage.setItem("likedArtists", JSON.stringify(updatedLikes))
    setIsLiked(!isLiked)
  }

  if (loading) {
    return <ArtistDetailSkeleton />
  }

  if (!localArtist) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Artist not found</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Artists
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="hover:bg-gray-800/50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Artists
        </Button>
      </Link>

      {/* Artist Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Image
                  src={artist?.strArtistThumb || localArtist.image || "/placeholder.svg"}
                  alt={localArtist.name}
                  width={400}
                  height={400}
                  className="w-full rounded-lg shadow-lg shadow-cyan-400/10"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    {localArtist.name}
                  </h1>
                  <p className="text-xl text-gray-400">{artist?.strGenre || localArtist.genre}</p>
                </div>

                <div className="flex items-center gap-2">
                  {artist?.strCountry && (
                    <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-400">
                      {artist.strCountry}
                    </Badge>
                  )}
                  {artist?.intFormedYear && (
                    <Badge variant="outline" className="border-gray-600">
                      Est. {artist.intFormedYear}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={handleToggleLike}
                  className={`
                    w-full transition-all duration-200
                    ${
                      isLiked
                        ? "bg-pink-600/20 text-pink-400 border border-pink-400/50 hover:bg-pink-600/30"
                        : "bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-pink-400"
                    }
                  `}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Liked" : "Like Artist"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Artist Info */}
        <div className="lg:w-2/3 space-y-8">
          {/* Biography */}
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Biography</h2>
            </CardHeader>
            <CardContent>
              {artist?.strBiography ? (
                <p className="text-gray-300 leading-relaxed">{artist.strBiography}</p>
              ) : (
                <p className="text-gray-400 italic">Biography not available for this artist.</p>
              )}
            </CardContent>
          </Card>

          {/* Albums */}
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Disc className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-semibold">Albums</h2>
                {albums.length > 0 && (
                  <Badge variant="outline" className="border-gray-600">
                    {albums.length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {albums.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {albums.map((album) => (
                    <div
                      key={album.idAlbum}
                      className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="relative mb-3">
                        <Image
                          src={album.strAlbumThumb || "/placeholder.svg?height=150&width=150"}
                          alt={album.strAlbum}
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-400/10 transition-shadow"
                        />
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                        {album.strAlbum}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {album.intYearReleased && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{album.intYearReleased}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Disc className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No album information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ArtistDetailSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <Skeleton className="h-10 w-32" />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-6">
              <Skeleton className="w-full h-80 mb-6" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-2/3 space-y-8">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-700/30 rounded-lg p-4">
                    <Skeleton className="w-full h-32 mb-3" />
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
