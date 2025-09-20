"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function QuickEventFinder() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search events..." className="pl-8" />
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="tech">Tech</SelectItem>
          <SelectItem value="cultural">Cultural</SelectItem>
          <SelectItem value="sports">Sports</SelectItem>
          <SelectItem value="academic">Academic</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

