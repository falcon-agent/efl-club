'use client'

import React, { useState, useEffect, forwardRef, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import HTMLFlipBook from 'react-pageflip'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

// Initialize the PDF.js worker precisely mapped to the installed pdfjs-dist version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFPageProps {
  pageNumber: number
  width: number
}

// react-pageflip natively requires forwarded Refs to inject the physical 3D CSS transform matrix
const PDFPage = forwardRef<HTMLDivElement, PDFPageProps>(({ pageNumber, width }, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-white shadow-xl overflow-hidden flex justify-center items-center h-full w-full border-r border-stone-200"
    >
      <Page
        pageNumber={pageNumber}
        width={width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
  )
})
PDFPage.displayName = 'PDFPage'

export default function FlipbookViewer({ pdfUrl }: { pdfUrl: string }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [windowWidth, setWindowWidth] = useState(0)
  const flipBookRef = useRef<any>(null)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError(err: Error) {
    console.error('PDF Load Error:', err)
    setError('Failed to load the PDF document. It might be corrupted or inaccessible.')
    setLoading(false)
  }

  // Dynamic layout calculations
  // If viewport is small (<768px), render a single page at a time. Otherwise, render a 2-page spread.
  const isMobile = windowWidth > 0 && windowWidth < 768

  // Calculate standard 8.5x11 vertical ratio widths automatically scaling down
  const pageRatio = 1.294
  const padding = isMobile ? 32 : 128
  
  // The max width of the ENTIRE book
  const availableWidth = windowWidth - padding
  
  // In single page mode, bookWidth = pageWidth. In dual page mode, bookWidth = 2 * pageWidth
  const PAGE_WIDTH = isMobile ? availableWidth : Math.min(availableWidth / 2, 500)
  const PAGE_HEIGHT = PAGE_WIDTH * pageRatio

  if (windowWidth === 0) return null // Prevent hydration mismatches

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[600px] relative bg-stone-100/50 rounded-3xl p-4 sm:p-12 mb-20 overflow-hidden">
      
      {loading && !error && (
        <div className="absolute inset-0 z-10 bg-stone-50/80 backdrop-blur-sm flex flex-col justify-center items-center rounded-3xl">
           <Loader2 className="w-10 h-10 text-sky-600 animate-spin mb-4" />
           <p className="text-stone-600 font-bold tracking-tight animate-pulse">Rendering Magazine Physics...</p>
        </div>
      )}

      {error ? (
        <div className="p-8 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center gap-3">
           <span>{error}</span>
        </div>
      ) : (
        <div className="relative w-full flex justify-center py-4">
          <Document 
             file={pdfUrl} 
             onLoadSuccess={onDocumentLoadSuccess} 
             onLoadError={onDocumentLoadError}
             className="flex justify-center shadow-2xl rounded-sm"
          >
            {numPages > 0 && (
              // @ts-ignore - react-pageflip types are slightly outdated
              <HTMLFlipBook
                ref={flipBookRef}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                size="fixed"
                minWidth={300}
                maxWidth={600}
                minHeight={400}
                maxHeight={800}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                usePortrait={isMobile} // Flips to single page mode automatically on narrow viewports
                className="bg-transparent"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <PDFPage 
                    key={`page_${index + 1}`} 
                    pageNumber={index + 1} 
                    width={PAGE_WIDTH} 
                  />
                ))}
              </HTMLFlipBook>
            )}
          </Document>

          {/* Desktop Navigation Overlays */}
          {!isMobile && numPages > 0 && (
             <>
                <button 
                  onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 lg:-ml-12 bg-white shadow-xl p-4 rounded-full text-stone-600 hover:text-sky-600 hover:-translate-x-1 transition-all z-20"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button 
                  onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 lg:-mr-12 bg-white shadow-xl p-4 rounded-full text-stone-600 hover:text-sky-600 hover:translate-x-1 transition-all z-20"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
             </>
          )}

        </div>
      )}
      
      {isMobile && numPages > 0 && (
          <p className="text-stone-500 font-medium text-sm mt-8 mx-auto flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-sky-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            Swipe logically left or right to flip pages
          </p>
      )}
    </div>
  )
}
