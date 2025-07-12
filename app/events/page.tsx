"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Music, Plus, Search } from "lucide-react"
import { EventNoteModal } from "@/components/event-note-modal"
import { Skeleton } from "@/components/ui/skeleton"

interface Event {
  id: string
  title: string
  artist_name: string
  datetime: string
  venue: {
    name: string
    city: string
    country: string
  }
  description?: string
}

interface Note {
  id: string
  eventId: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem("eventNotes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }

    // Fetch events (using mock data for demo)
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      // Mock events data (in real app, would fetch from Bandsintown API)
      const mockEvents: Event[] = [
        {
          id: "1",
          title: "Summer Music Festival",
          artist_name: "The Weeknd",
          datetime: "2024-07-15T20:00:00",
          venue: {
            name: "Madison Square Garden",
            city: "New York",
            country: "US",
          },
        },
        {
          id: "2",
          title: "Rock Night",
          artist_name: "Queen",
          datetime: "2024-08-20T19:30:00",
          venue: {
            name: "Wembley Stadium",
            city: "London",
            country: "UK",
          },
        },
        {
          id: "3",
          title: "Pop Extravaganza",
          artist_name: "Ed Sheeran",
          datetime: "2024-09-10T21:00:00",
          venue: {
            name: "Hollywood Bowl",
            city: "Los Angeles",
            country: "US",
          },
        },
      ]

      setEvents(mockEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.artist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddNote = (eventId: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      eventId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    localStorage.setItem("eventNotes", JSON.stringify(updatedNotes))
  }

  const handleUpdateNote = (noteId: string, content: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, content, updatedAt: new Date().toISOString() } : note,
    )

    setNotes(updatedNotes)
    localStorage.setItem("eventNotes", JSON.stringify(updatedNotes))
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    setNotes(updatedNotes)
    localStorage.setItem("eventNotes", JSON.stringify(updatedNotes))
  }

  const getEventNote = (eventId: string) => {
    return notes.find((note) => note.eventId === eventId)
  }

  const openNoteModal = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  if (loading) {
    return <EventsSkeleton />
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold glow-text mb-2">Events & Concerts</h1>
          <p className="text-gray-400">Discover live music events and save your notes</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events, artists, or cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const eventNote = getEventNote(event.id)
          const eventDate = new Date(event.datetime)

          return (
            <Card
              key={event.id}
              className="glass-effect border-gray-800 hover:glow-border transition-all duration-300 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                    <p className="text-cyan-400 font-medium">{event.artist_name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openNoteModal(event)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-400/20"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {eventDate.toLocaleDateString()} at{" "}
                    {eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {event.venue.name}, {event.venue.city}, {event.venue.country}
                  </span>
                </div>

                {eventNote && (
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-400">Your Note</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3">{eventNote.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openNoteModal(event)}
                      className="mt-2 text-xs hover:text-cyan-400"
                    >
                      Edit Note
                    </Button>
                  </div>
                )}

                {!eventNote && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openNoteModal(event)}
                    className="w-full border-gray-600 hover:border-cyan-400 hover:text-cyan-400"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-400">Try adjusting your search terms</p>
        </div>
      )}

      {/* Event Note Modal */}
      <EventNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        existingNote={selectedEvent ? getEventNote(selectedEvent.id) : undefined}
        onSave={handleAddNote}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
      />
    </div>
  )
}

function EventsSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="glass-effect border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
