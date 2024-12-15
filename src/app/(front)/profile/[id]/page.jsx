import React from 'react'

export default function UserProfile({params}) {
  return (
    <div>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum nemo sit atque tempora dolorum et vero labore, deserunt suscipit adipisci ipsum enim cum reprehenderit debitis aliquid asperiores, veritatis maiores accusantium.</p>

      <p>{params.id}</p>
    </div>
  )
}
