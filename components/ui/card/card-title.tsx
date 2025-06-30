import React from 'react'

export default function CardTitle({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className="text-2xl font-semibold leading-none tracking-tight" {...props}>
      {children}
    </h3>
  )
}