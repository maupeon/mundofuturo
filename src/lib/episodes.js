import fetch from 'node-fetch'
import client from './contentful'

// Replace with your actual Spotify client ID and client secret
const client_id = 'f635daee146d476fbe7db590a9545b96'
const client_secret = 'f51d211baeca44d594579e2d6e961b6a'

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      `Failed to get access token from Spotify: ${data.error_description}`,
    )
  }

  return data.access_token
}

export async function getAllEpisodes() {
  const res = await client.getEntries({
    content_type: 'audioFile',
    include: 2,
  })
  const SPOTIFY_API_URL =
    'https://api.spotify.com/v1/shows/5ZldFoVYM0Orm9ai06t0o4/episodes'

  const ACCESS_TOKEN = await getAccessToken()

  const response = await fetch(SPOTIFY_API_URL, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch episodes from Spotify')
  }

  const data = await response.json()

  const episodes = data.items.map(
    ({ id, name, description, release_date, audio_preview_url }) => {
      // Extract the number from the episode name
      const episodeNumberMatch = name.match(/\d+/)
      const episodeNumber = episodeNumberMatch ? episodeNumberMatch[0] : null

      // Find the matching item from res.items based on the episode number
      const matchingItem = res.items.find((item) => {
        const tituloNumberMatch = item.fields.titulo.match(/\d+/)
        const tituloNumber = tituloNumberMatch ? tituloNumberMatch[0] : null
        return tituloNumber === episodeNumber
      })
      return {
        id,
        title: name,
        published: new Date(release_date),
        description,
        tldr: matchingItem?.fields?.tldr || null,
        recommendations: matchingItem?.fields?.recommendations
          ? matchingItem.fields.recommendations.map((recommendation) => {
              const author = recommendation.fields?.author?.fields || {} // Extract author details if available
              return {
                id: recommendation.sys.id, // Recommendation ID
                link: recommendation.fields?.link || null, // Recommendation link
                imageUrl:
                  recommendation.fields?.imageUrl?.fields?.file?.url || '',
                mediaType: recommendation.fields?.mediaType || null, // Recommendation media type
                title: recommendation.fields?.title || null, // Recommendation title
                description: recommendation.fields?.description || null, // Recommendation description
                author: {
                  id: recommendation.fields?.author?.sys.id || null, // Author ID
                  name: author.name || null, // Author name
                  bio: author.description || null, // Author bio
                  picture: author.photo?.fields?.file?.url || '',
                },
              }
            })
          : null,
        content: matchingItem
          ? matchingItem?.fields?.srt?.fields?.file.url
          : null, // Spotify API does not provide content field
        audio: {
          src:
            matchingItem && matchingItem.fields.archivoMp3
              ? matchingItem.fields.archivoMp3.fields.file.url
              : audio_preview_url,
          type: 'audio/mpeg', // Assuming the type based on common audio formats
        },
      }
    },
  )
  return episodes
}
