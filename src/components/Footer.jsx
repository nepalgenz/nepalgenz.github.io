import { useEffect, useState } from 'react'

export default function Footer() {
  const [count, setCount] = useState(null)

  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/nepalgenz/visits/up')
      .then(r => r.json())
      .then(data => setCount(data.count))
      .catch(() => setCount(null))
  }, [])

  return (
    <footer className="site-footer">
      <span className="visitor-counter">
        👁 {count !== null ? count.toLocaleString() : '…'} visitors
      </span>
    </footer>
  )
}
