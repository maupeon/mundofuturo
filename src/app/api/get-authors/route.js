// app/api/get-authors/route.js
import client from '@/lib/contentful'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await client.getEntries({ content_type: 'author' })

    if (!response.items) {
      return NextResponse.json({ error: 'No authors found' }, { status: 404 })
    }

    const authors = response.items.map((item) => ({
      id: item.fields.slug,
      name: item.fields.name,
      bio: item.fields.description || '',
      picture: item.fields.photo?.fields?.file?.url || '',
    }))

    return NextResponse.json(authors, { status: 200 })
  } catch (error) {
    console.error('Error fetching authors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 },
    )
  }
}
