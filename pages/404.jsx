// pages/404.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Custom404() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to home page
        router.replace('/')
    }, [router])

    return null // Optional: or show a loading spinner
}
