import { PortableTextComponents } from '@portabletext/react'
import { urlFor } from '../lib/sanity'

export const portableTextComponents: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            const imageUrl = value?.asset?.url || urlFor(value).width(800).url()
            return (
                <div style={{ margin: '2rem 0' }}>
                    <img
                        src={imageUrl}
                        alt={value.alt || ' '}
                        style={{ width: '100%', borderRadius: '12px' }}
                    />
                </div>
            )
        },
    },
    block: {
        normal: ({ children }) => <>{children}</>,
    },
}
