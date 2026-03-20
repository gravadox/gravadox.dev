export const revalidate = 500 // secs
import { NextResponse } from "next/server"

interface ContributionDay {
  date: string
  contributionCount: number
}

interface Week {
  contributionDays: ContributionDay[]
}

interface ContributionsCollection {
  contributionCalendar: {
    weeks: Week[]
  }
}

interface UserData {
  user: {
    contributionsCollection: ContributionsCollection
  } | null
}

interface GraphQLError {
  message: string
  locations?: { line: number; column: number }[]
  path?: (string | number)[]
}

export async function GET(req: Request) {
  const token = process.env.GITHUB_TOKEN
  const username = "gravadox"

  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const year = searchParams.get("year")

  const dateFilter = year
    ? `(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z")`
    : ""

  const query = `
  query {
    user(login: "${username}") {
      contributionsCollection${dateFilter} {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }`

  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 500 },
  })

  const data: { data?: UserData; errors?: GraphQLError[] } = await r.json()

  if (!data?.data?.user)
    return NextResponse.json({ error: "Invalid response", raw: data }, { status: 500 })

  const days = data.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w: Week) => w.contributionDays)

  const calendar = days.map((d: ContributionDay) => ({
    date: d.date,
    count: d.contributionCount,
    symbol:
      d.contributionCount === 0 ? "*" :
      d.contributionCount < 5 ? "#" : "▮",
  }))

  const total = days.reduce((sum, d) => sum + d.contributionCount, 0)

  return NextResponse.json({ total, calendar })
}
