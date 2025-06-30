import React from 'react'

export default function CardHeader({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex flex-col space-y-1.5 p-6" {...props}>
      {children}
    </div>
  )
}