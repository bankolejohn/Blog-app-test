

import React from 'react'

export default function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm" {...props}>
      {children}
    </div>
  )
}
