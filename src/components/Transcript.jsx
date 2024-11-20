'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useAudioPlayer } from './AudioProvider'

function Transcript({ srtData, episode }) {
  const [transcriptEntries, setTranscriptEntries] = useState([])
  const { currentTime, seek } = useAudioPlayer(episode)
  const currentEntryRef = useRef(null)
  const [currentEntry, setCurrentEntry] = useState()

  useEffect(() => {
    const fetchSRTFile = async () => {
      try {
        const response = await fetch(srtData)
        const srtText = await response.text()
        const entries = parseSRT(srtText)
        setTranscriptEntries(entries)
      } catch (error) {
        console.error('Error fetching SRT file:', error)
      }
    }

    fetchSRTFile()
  }, [srtData])

  useEffect(() => {
    if (currentEntryRef.current) {
      currentEntryRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentEntry])

  const parseSRT = (srt) => {
    const regex =
      /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g
    let match
    const entries = []

    while ((match = regex.exec(srt)) !== null) {
      const [_, index, startTime, endTime, text] = match
      const [speaker, ...rest] = text.includes(':')
        ? text.split(':')
        : ['Unknown', text]
      const content = rest.join(':').trim()
      entries.push({
        index,
        startTime: convertTimeToSeconds(startTime),
        endTime: convertTimeToSeconds(endTime),
        speaker: speaker.trim(),
        text: content,
      })
    }

    return entries
  }

  const convertTimeToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(':')
    const [secs, millis] = seconds.split(',')
    return (
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(secs, 10) +
      parseInt(millis, 10) / 1000
    )
  }

  const getSpeakerColor = (speaker) => {
    const colors = [
      'text-purple-500',
      'text-purple-600',
      'text-purple-700',
      'text-purple-800',
      'text-purple-900',
    ]
    const hash = Array.from(speaker).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    )
    return colors[hash % colors.length]
  }

  const isPlaying = (entry) => {
    return currentTime >= entry.startTime && currentTime < entry.endTime
  }

  useEffect(() => {
    const activeEntry = transcriptEntries.find(isPlaying)
    if (activeEntry && activeEntry !== currentEntry) {
      setCurrentEntry(activeEntry)
    }
  }, [currentTime, transcriptEntries, currentEntry])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
  }

  return (
    <div className="transcript-container rounded-lg bg-gray-50 p-6 shadow-md">
      {transcriptEntries.map((entry) => {
        const isActive = currentEntry === entry
        return (
          <div
            key={entry.index}
            ref={isActive ? currentEntryRef : null}
            onClick={() => seek(entry.startTime)}
            className={`transcript-entry mb-4 cursor-pointer rounded-lg p-4 transition-all ${
              isActive ? 'bg-violet-100 shadow-sm' : 'hover:bg-gray-100'
            }`}
          >
            <div className="mb-1 flex items-center">
              <div
                className={`speaker mr-2 text-lg font-semibold ${getSpeakerColor(
                  entry.speaker,
                )}`}
              >
                {entry.speaker}
              </div>
              <div className="text-sm text-gray-500">
                {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
              </div>
            </div>
            <div className="text-base leading-relaxed text-gray-800">
              {entry.text}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Transcript
