"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Save, X } from "lucide-react"

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

interface AddNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (eventId: string, content: string) => void
  events: Event[]
}

export function AddNoteModal({ isOpen, onClose, onSave, events }: AddNoteModalProps) {
  const [selectedEventId, setSelectedEventId] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedEvent = events.find((event) => event.id === selectedEventId)

  const handleSubmit = async () => {
    if (!selectedEventId || !noteContent.trim()) return

    setIsSubmitting(true)

    try {
      onSave(selectedEventId, noteContent.trim())
      setSelectedEventId("")
      setNoteContent("")
      onClose()
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedEventId("")
    setNoteContent("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800/95 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Add New Note
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Selection */}
          <div className="space-y-3">
            <label htmlFor="event-select" className="text-sm font-medium text-gray-300">
              Select Event
            </label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 focus:border-cyan-400">
                <SelectValue placeholder="Choose an event to write about..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id} className="hover:bg-gray-700">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-sm text-gray-400">
                        {event.artist_name} • {new Date(event.datetime).toLocaleDateString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Event Preview */}
          {selectedEvent && (
            <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
              <h3 className="font-semibold text-lg mb-2">{selectedEvent.title}</h3>
              <p className="text-cyan-400 font-medium mb-3">{selectedEvent.artist_name}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(selectedEvent.datetime).toLocaleDateString()} at{" "}
                    {new Date(selectedEvent.datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedEvent.venue.name}, {selectedEvent.venue.city}, {selectedEvent.venue.country}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Note Input */}
          <div className="space-y-3">
            <label htmlFor="note-content" className="text-sm font-medium text-gray-300">
              Your Note
            </label>
            <Textarea
              id="note-content"
              placeholder="Share your thoughts, memories, or plans for this event..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-32 bg-gray-700/50 border-gray-600 focus:border-cyan-400 resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{noteContent.length}/1000 characters</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-600 hover:border-gray-500 bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedEventId || !noteContent.trim() || isSubmitting}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Note"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
