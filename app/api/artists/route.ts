import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  const apiKey = process.env.LASTFM_API_KEY

  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
        query
      )}&api_key=${apiKey}&format=json`
    )

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from Last.fm" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: "Server Error", detail: (err as Error).message },
      { status: 500 }
    )
  }
}
