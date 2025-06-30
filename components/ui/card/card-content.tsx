import React from 'react'

export default function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="p-6 pt-0" {...props}>
      {children}
    </div>
  )
}