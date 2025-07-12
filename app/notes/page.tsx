"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Music, Search, Edit, Trash2, Plus } from "lucide-react"
import { AddNoteModal } from "@/components/add-note-modal"
import { NoteDetailModal } from "@/components/note-detail-modal"

interface Note {
  id: string
  eventId: string
  content: string
  createdAt: string
  updatedAt: string
}

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
  artist_image?: string
}

// Mock events data to match notes
const mockEvents: Record<string, Event> = {
  "1": {
    id: "1",
    title: "Summer Music Festival",
    artist_name: "The Weeknd",
    datetime: "2024-07-15T20:00:00",
    venue: { name: "Madison Square Garden", city: "New York", country: "US" },
    artist_image: "/placeholder.svg?height=200&width=200",
  },
  "2": {
    id: "2",
    title: "Rock Night",
    artist_name: "Queen",
    datetime: "2024-08-20T19:30:00",
    venue: { name: "Wembley Stadium", city: "London", country: "UK" },
    artist_image: "/placeholder.svg?height=200&width=200",
  },
  "3": {
    id: "3",
    title: "Pop Extravaganza",
    artist_name: "Ed Sheeran",
    datetime: "2024-09-10T21:00:00",
    venue: { name: "Hollywood Bowl", city: "Los Angeles", country: "US" },
    artist_image: "/placeholder.svg?height=200&width=200",
  },
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem("eventNotes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  const filteredNotes = notes.filter((note) => {
    const event = mockEvents[note.eventId]
    if (!event) return false

    return (
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

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

  const openEditModal = (note: Note) => {
    const event = mockEvents[note.eventId]
    if (event) {
      setSelectedEvent(event)
      setSelectedNote(note)
      setIsModalOpen(true)
    }
  }

  const openNoteDetail = (note: Note) => {
    setSelectedNote(note)
    setIsDetailModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    setSelectedNote(null)
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold glow-text mb-2">My Notes</h1>
          <p className="text-gray-400">Your personal event memories and thoughts</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notes or events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80 bg-gray-800/50 border-gray-700 focus:border-cyan-400"
            />
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Music className="w-4 h-4 text-cyan-400" />
        <span>{notes.length} Notes Created</span>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const event = mockEvents[note.eventId]
            if (!event) return null

            const eventDate = new Date(event.datetime)
            const noteDate = new Date(note.updatedAt)

            return (
              <Card
                key={note.id}
                className="glass-effect border-gray-800 hover:glow-border transition-all duration-300 group cursor-pointer"
                onClick={() => openNoteDetail(note)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors truncate">
                        {event.title}
                      </h3>
                      <p className="text-cyan-400 font-medium">{event.artist_name}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          openNoteDetail(note)
                        }}
                        className="w-8 h-8 hover:bg-cyan-400/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteNote(note.id)
                        }}
                        className="w-8 h-8 hover:bg-red-400/20 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{eventDate.toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                      {event.venue.name}, {event.venue.city}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-400">Your Note</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-4">{note.content}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Updated: {noteDate.toLocaleDateString()}</span>
                    <span>{note.content.length} characters</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{searchTerm ? "No matching notes found" : "No notes yet"}</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? "Try adjusting your search terms" : "Create your first note to capture event memories"}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Note
            </Button>
          )}
        </div>
      )}

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNote}
        events={Object.values(mockEvents)}
      />

      {/* Note Detail Modal */}
      <NoteDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        note={selectedNote}
        event={selectedNote ? mockEvents[selectedNote.eventId] : null}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
      />
    </div>
  )
}
