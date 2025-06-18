import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: "bsg3746e",
    dataset: "production",
    apiVersion: "2023-06-19",
    token: "skC2QdihnYiqC9m3Qh4svOYs2goDI6AHx4jKFhrD1AVIs2XXOK3kXEl1VPaseRf3GvV6GQB24KFhCCOY2jhCXIvttKh7rqxqmLdHqO7iFSvYsK45d4L7wZbzZkPvWrQFrxIcHJJIweSdIiDo5W78DTIl90Rm4AKCGN25ozRDg2WNbkGsMK0Q",
    useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}