import React from 'react'

export default function CardFooter({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center p-6 pt-0" {...props}>
      {children}
    </div>
  )
}