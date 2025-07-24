// pages/404.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Custom404() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to home or any other page
        router.replace('/Services')
    }, [])

    return null // Optional: or show a loading spinner
}
