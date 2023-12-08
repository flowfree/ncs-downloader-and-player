'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/solid'

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [volume, setVolume] = useState(0.9)
  const audioRef = useRef<HTMLAudioElement>(null)

  const audio = {
    id: 1,
    title: 'Hello, World!',
    artists: [
      { id: 1, name: 'aaa' }, 
      { id: 2, name: 'bbb' }
    ],
    duration: 90
  }

  useEffect(() => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime('0:00')
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [audio])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const updateProgress = () => {
    const audio = audioRef.current
    if (audio) {
      setProgress((audio.currentTime / audio.duration) * 100)
      setCurrentTime(formatTime(audio.currentTime))
    }
  }

  function formatTime(duration: number) {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  if (!audio) {
    return null
  }

  return (
    <>
      <div className="p-4 flex flex-row gap-8 items-center bg-gray-100">

        <div className="basis-1/4 flex flex-row gap-2 overfow-hidden">
          <img src={`/img/cover/${audio.id}.jpg`} className="w-16 h-16" alt="" />
          <div className="self-center">
            <h3 className="text-sm font-bold line-clamp-1">
              {audio.title}
            </h3>
            <p className="text-sm line-clamp-1">
              {audio.artists.map(artist => artist.name).join(', ')}
            </p>
          </div>
        </div>

        <div className="basis-1/2 flex flex-col gap-2 items-center">
          <div className="flex flex-row gap-4">
            <button className="hover:text-gray-600">
              <BackwardIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-2 rounded-full bg-indigo-700 text-white"
              onClick={togglePlayPause}
            >
              {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <button className="hover:text-gray-600">
              <ForwardIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full flex flex-row gap-2 items-center">
            <span className="text-xs">
              {currentTime}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-stone-700 h-1 rounded-full" style={{width: `${progress}%`}} />
            </div>
            <span className="text-xs">
              {audio.duration ? formatTime(audio.duration) : '0:00'}
            </span>
          </div>
        </div>

        <div className="basis-1/4 flex flex-row-reverse">
          <div className="group w-[150px] flex flex-row gap-2 items-center">
            <SpeakerWaveIcon className="w-5 h-5 group-hover:text-purple-700" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              className="w-full h-1 bg-gray-200 rounded-lg cursor-pointer accent-stone-700 group-hover:accent-purple-700" 
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <audio 
        preload="none" 
        ref={audioRef} 
        src={`/api/stream/${audio.id}`} 
        onTimeUpdate={updateProgress} 
        onEnded={() => setIsPlaying(false)}
      />

    </>
  )
}
