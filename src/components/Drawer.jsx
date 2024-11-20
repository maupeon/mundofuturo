'use client'
import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRegLightbulb, FaTimes } from 'react-icons/fa'
import { RecommendationCard } from './recommendations/RecommendationCard'
export default function Drawer({ recommendations }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const drawerRef = useRef(null)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setIsDrawerOpen(false)
    }
  }

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('overflow-hidden')
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.body.classList.remove('overflow-hidden')
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDrawerOpen])

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="fixed right-4 top-1/2 z-40 mb-20 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <FaRegLightbulb className="h-6 w-6" aria-label="Recommendations" />
      </button>
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-[40vw] max-w-full overflow-scroll bg-white shadow-lg"
          >
            <div className="relative h-full w-full p-6">
              <FaTimes
                onClick={toggleDrawer}
                className="absolute right-4 top-4 h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-800"
                aria-label="Close"
              />
              <h2 className="mb-4 text-xl font-bold">
                Recomendaciones del Episodio
              </h2>
              {recommendations &&
                recommendations.map((item) => (
                  <RecommendationCard key={item.id} item={item} />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
