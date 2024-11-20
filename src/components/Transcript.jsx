'use client'
import React, { useState, useEffect } from 'react'

function Transcript({ srtData }) {
  const [transcriptEntries, setTranscriptEntries] = useState([])
  const [currentTime, setCurrentTime] = useState(0)

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

  const parseSRT = (srt) => {
    const regex =
      /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g
    let match
    const entries = []

    while ((match = regex.exec(srt)) !== null) {
      const [_, index, startTime, endTime, text] = match
      const [speaker, ...rest] = text.split(':')
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
    return currentTime >= entry.startTime && currentTime <= entry.endTime
  }

  return (
    <div className="transcript-container rounded-lg bg-white p-6 shadow-lg">
      {transcriptEntries.map((entry) => (
        <div
          key={entry.index}
          className={`transcript-entry mb-6 ${
            isPlaying(entry) ? 'bg-yellow-100' : ''
          }`}
        >
          <div
            className={`speaker mb-1 text-xl font-bold ${getSpeakerColor(
              entry.speaker,
            )}`}
          >
            {entry.speaker}
          </div>
          <div className="text-lg leading-relaxed text-gray-800">
            {entry.text}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Transcript
