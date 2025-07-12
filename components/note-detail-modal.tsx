"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Save, Trash2, X, Edit } from "lucide-react"
import Image from "next/image"

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

interface Note {
  id: string
  eventId: string
  content: string
  createdAt: string
  updatedAt: string
}

interface NoteDetailModalProps {
  isOpen: boolean
  onClose: () => void
  note: Note | null
  event: Event | null
  onUpdate: (noteId: string, content: string) => void
  onDelete: (noteId: string) => void
}

export function NoteDetailModal({ isOpen, onClose, note, event, onUpdate, onDelete }: NoteDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (note) {
      setNoteContent(note.content)
      setIsEditing(false)
    }
  }, [note, isOpen])

  if (!note || !event) return null

  const eventDate = new Date(event.datetime)

  const handleUpdate = async () => {
    if (!noteContent.trim()) return

    setIsSubmitting(true)

    try {
      onUpdate(note.id, noteContent.trim())
      setIsEditing(false)
      onClose()
    } catch (error) {
      console.error("Error updating note:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    onDelete(note.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800/95 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Event Note
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <div className="space-y-6">
            <div className="p-6 bg-gray-700/30 rounded-lg border border-gray-600">
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              <p className="text-cyan-400 font-medium text-lg mb-4">{event.artist_name}</p>

              {event.artist_image && (
                <div className="mb-4">
                  <Image
                    src={event.artist_image || "/placeholder.svg"}
                    alt={event.artist_name}
                    width={200}
                    height={200}
                    className="rounded-lg shadow-lg shadow-cyan-400/10"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="font-medium">{eventDate.toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400">
                      {eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium">{event.venue.name}</p>
                    <p className="text-sm text-gray-400">
                      {event.venue.city}, {event.venue.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
              <p>Last updated: {new Date(note.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Note Content */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-cyan-400">Your Note</h3>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-cyan-400"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-48 bg-gray-700/50 border-gray-600 focus:border-cyan-400 resize-none"
                  maxLength={1000}
                  placeholder="Share your thoughts about this event..."
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{noteContent.length}/1000 characters</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleUpdate}
                    disabled={!noteContent.trim() || isSubmitting}
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 transition-all duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setNoteContent(note.content)
                    }}
                    className="border-gray-600 hover:border-gray-500 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600 min-h-48">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Note
          </Button>

          <Button variant="outline" onClick={onClose} className="border-gray-600 hover:border-gray-500 bg-transparent">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
