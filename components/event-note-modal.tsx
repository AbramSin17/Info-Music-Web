"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Save, Trash2, X } from "lucide-react"

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
}

interface Note {
  id: string
  eventId: string
  content: string
  createdAt: string
  updatedAt: string
}

interface EventNoteModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  existingNote?: Note
  onSave: (eventId: string, content: string) => void
  onUpdate: (noteId: string, content: string) => void
  onDelete: (noteId: string) => void
}

export function EventNoteModal({
  isOpen,
  onClose,
  event,
  existingNote,
  onSave,
  onUpdate,
  onDelete,
}: EventNoteModalProps) {
  const [noteContent, setNoteContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (existingNote) {
      setNoteContent(existingNote.content)
    } else {
      setNoteContent("")
    }
  }, [existingNote, isOpen])

  if (!event) return null

  const eventDate = new Date(event.datetime)
  const isEditing = !!existingNote

  const handleSubmit = async () => {
    if (!noteContent.trim()) return

    setIsSubmitting(true)

    try {
      if (isEditing && existingNote) {
        onUpdate(existingNote.id, noteContent.trim())
      } else {
        onSave(event.id, noteContent.trim())
      }
      onClose()
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    if (existingNote) {
      onDelete(existingNote.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold glow-text">{isEditing ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <p className="text-cyan-400 font-medium mb-3">{event.artist_name}</p>

            <div className="space-y-2">
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
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-3">
            <label htmlFor="note-content" className="text-sm font-medium text-gray-300">
              Your Note
            </label>
            <Textarea
              id="note-content"
              placeholder="Add your thoughts, memories, or plans for this event..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-32 bg-gray-800/50 border-gray-700 focus:border-cyan-400 resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{noteContent.length}/1000 characters</span>
              {existingNote && <span>Last updated: {new Date(existingNote.updatedAt).toLocaleDateString()}</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div>
              {isEditing && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Note
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 hover:border-gray-500 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!noteContent.trim() || isSubmitting} className="neon-gradient">
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : isEditing ? "Update Note" : "Save Note"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
