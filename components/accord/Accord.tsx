"use client"

import Link from 'next/link'

function Accord({title}: {title: string}) {

  return (
    <div className="flex flex-col space-y-2 p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <button className="bg-gray-200 px-3 py-1 rounded-md text-sm">
          {title}
        </button>
      </div>
    </div>
  )
}

export default Accord