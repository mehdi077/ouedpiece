'use client'

import React, { useState, useEffect, useRef, MouseEvent, TouchEvent } from 'react'
import { Id } from '../convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import Image from 'next/image'
import { DURATIONS } from '@/convex/constants'
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { translations } from '@/lib/translations'

interface CardProps {
  postId: Id<"posts">
}

function Card({ postId }: CardProps) {
  const imagesIds = useQuery(api.posts.getPostImagesByPostId, { postId }) || []
  const imageUrls = useQuery(api.posts.getImageUrls, { storageIds: imagesIds }) || []
  const postDetails = useQuery(api.posts.getPostDetails, { postId })
  const creationTime = useQuery(api.posts.getPostCreationTime, { postId })
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isImageLoading, setIsImageLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
  }, [])


  useEffect(() => {
    if (!creationTime) return

    const updateCountdown = () => {
      const now = Date.now()
      const expirationTime = creationTime + DURATIONS.POST_EXPIRATION
      const remainingTime = expirationTime - now

      if (remainingTime <= 0) {
        setTimeLeft(translations.post.expiration.expired)
        return
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60))
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000)

      setTimeLeft(`${translations.post.expiration.timeLeft}: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    // Update immediately and then every second
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [creationTime])
  
  if (!isClient) {
    return (
      <div className="w-full flex flex-col gap-2 p-1">
        <div className="w-full px-1">
          <span className="text-center font-medium text-gray-700">{translations.actions.loading}</span>
        </div>
        <div className="w-full border border-green-500 flex items-center justify-start overflow-x-auto" />
        <div className="w-full h-20 border border-green-500" />
      </div>
    )
  }

  const scrollToImage = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = direction === 'left' ? -400 : 400;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col p-4 border border-gray-200 rounded-[2px] transition-shadow duration-300 bg-white">
      <div className="w-full px-1 flex items-center mb-4 justify-center gap-2 bg-gray-50 py-2 rounded-[2px]">
        <Clock className="h-4 w-4 text-green-600" />
        <span className="text-center font-medium text-gray-700 animate-pulse">
          {timeLeft}
        </span>
      </div>
      <div className="w-full relative group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 bg-white/90 hover:bg-white shadow-md rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
          onClick={() => scrollToImage('left')}
          aria-label={translations.image.navigation.previous}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 w-full scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2"
          onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
            setIsDragging(true);
            setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
            setScrollLeft(scrollContainerRef.current!.scrollLeft);
          }}
          onMouseLeave={() => setIsDragging(false)}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={(e: MouseEvent<HTMLDivElement>) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - scrollContainerRef.current!.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
          }}
          onTouchStart={(e: TouchEvent<HTMLDivElement>) => {
            setIsDragging(true);
            setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft);
            setScrollLeft(scrollContainerRef.current!.scrollLeft);
          }}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={(e: TouchEvent<HTMLDivElement>) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
          }}
        >
          {imageUrls.map((url, index) => (
            url && (
              <div 
                key={index} 
                className="flex-shrink-0 h-[220px] w-[300px] relative group/image cursor-pointer overflow-hidden rounded-[2px] shadow-sm hover:shadow-md transition-all duration-300" 
                onClick={() => {
                  setIsImageLoading(true);
                  setSelectedImage(url);
                }}
              >
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 z-10" />
                <Image
                  src={url}
                  alt={translations.image.alt.postImage(index)}
                  width={300}
                  height={220}
                  className="h-[220px] w-[300px] object-cover transform group-hover/image:scale-105 transition-transform duration-300"
                  quality={100}
                />
              </div>
            )
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 bg-white/90 hover:bg-white shadow-md rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
          onClick={() => scrollToImage('right')}
          aria-label={translations.image.navigation.next}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full mt-6">
        {postDetails && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm divide-y divide-gray-100">
            {/* Vehicle Section */}
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-1 h-4 bg-[#F97316] rounded-sm" />
                <h3 className="text-sm font-medium text-gray-700">
                  {translations.filter.sections.vehicle}
                </h3>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1.5 sm:gap-4">
                <div className="py-1 sm:py-0">
                  <span className="text-xs text-gray-500">{translations.filter.fields.brand}</span>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{postDetails.brand}</p>
                </div>
                <div className="py-1 sm:py-0">
                  <span className="text-xs text-gray-500">{translations.filter.fields.model}</span>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{postDetails.model}</p>
                </div>
                <div className="py-1 sm:py-0">
                  <span className="text-xs text-gray-500">{translations.filter.fields.year}</span>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{postDetails.year}</p>
                </div>
              </div>
            </div>

            {/* Part Section */}
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-1 h-4 bg-[#F97316] rounded-sm" />
                <h3 className="text-sm font-medium text-gray-700">
                  {translations.filter.sections.part}
                </h3>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 sm:gap-4">
                <div className="py-1 sm:py-0">
                  <span className="text-xs text-gray-500">{translations.filter.fields.category}</span>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{postDetails.category}</p>
                </div>
                <div className="py-1 sm:py-0">
                  <span className="text-xs text-gray-500">{translations.filter.fields.subcategory}</span>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{postDetails.subcategory}</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-1 h-4 bg-[#F97316] rounded-sm" />
                <h3 className="text-sm font-medium text-gray-700">
                  {translations.filter.sections.contact}
                </h3>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 sm:gap-4">
                <div className="py-1 sm:py-0">
                  <span className="text-xs text-gray-500">{translations.filter.fields.phone}</span>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{postDetails.phone}</p>
                </div>
                <div className="py-1 sm:py-0">
                  <span className="text-xs text-gray-500">{translations.filter.fields.location}</span>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{postDetails.wilaya}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm" 
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-xl font-bold bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            aria-label={translations.actions.close}
          >
            {translations.actions.close[0]}
          </button>
          <div className="max-w-[90vw] max-h-[90vh] relative">
            <Image
              src={selectedImage}
              alt={translations.image.preview}
              width={1200}
              height={800}
              className={`max-w-full max-h-[90vh] object-contain rounded-[2px] ${isImageLoading ? 'hidden' : 'block'} shadow-2xl`}
              onLoadingComplete={() => {
                setIsImageLoading(false);
              }}
              priority={true}
            />
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" aria-label={translations.actions.loading} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Card

