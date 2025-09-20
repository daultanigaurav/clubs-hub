"use client"

import { X } from "lucide-react"
import { useState } from "react"

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-primary px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-primary-foreground">
          <strong className="font-semibold">Tech Fest 2024</strong>
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
            <circle cx={1} cy={1} r={1} />
          </svg>
          Register now for early bird access!
        </p>
        <a
          href="#"
          className="flex-none rounded-full bg-primary-foreground px-3.5 py-1 text-sm font-semibold text-primary shadow-sm hover:bg-primary-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
        >
          Register now <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
          onClick={() => setIsVisible(false)}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

