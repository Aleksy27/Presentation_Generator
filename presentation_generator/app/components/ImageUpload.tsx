"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageChange?: (image: string | null) => void
  className?: string
}

export function ImageUpload({ onImageChange, className }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setImage(result)
          setConfirmed(false)
          onImageChange?.(result)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      handleFile(file)
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const removeImage = useCallback(() => {
    setImage((prev) => {
      if (confirmed) return prev
      onImageChange?.(null)
      setConfirmed(false)
      return null
    })
  }, [onImageChange])

  const confirmImage = useCallback(() => {
    setConfirmed(true)
    onImageChange?.(image)
  }, [image, onImageChange])

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {!image ? (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
            isDragging
              ? "border-black bg-black/5 scale-[1.02]"
              : "border-black/20 hover:border-black/40 hover:bg-black/5",
          )}
        >
          <input type="file" accept="image/*" onChange={handleInputChange} className="sr-only" />
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className={cn("p-4 rounded-full transition-colors", isDragging ? "bg-black/10" : "bg-black/5")}>
              <Upload
                className={cn("w-8 h-8 transition-colors", isDragging ? "text-black" : "text-black/70")}
              />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-black">Przeciągnij zdjęcie tutaj</p>
              <p className="text-sm text-black/70">lub kliknij, aby wybrać plik</p>
            </div>
            <p className="text-xs text-black/60">PNG, JPG, GIF do 10MB</p>
          </div>
        </label>
      ) : (
        <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted/30">
          <div className="aspect-video relative flex items-center justify-center">
            <img
              src={image || "/placeholder.svg"}
              alt="Wgrane zdjęcie"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div>
            {!confirmed ? (
              <>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={removeImage}
                  className="absolute top-3 right-14 rounded-full shadow-lg cursor-pointer bg-red-600 hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={confirmImage}
                  className="absolute top-3 right-3 rounded-full shadow-lg cursor-pointer bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}