import { NextResponse } from "next/server"

interface Repo {
  name: string
  url: string
  updated: string
  language: string | null
  description: string | null
  stars: number
  commits: number
}

interface User {
  avatar_url: string
  login: string
  name: string
  bio: string
  followers: number
  following: number
}

interface RestRepo {
  name: string
  html_url: string
  updated_at: string
  language: string | null
}

interface GraphQLRepo {
  name: string
  stargazerCount: number
  description: string | null
  defaultBranchRef?: {
    target?: {
      history?: {
        totalCount: number
      }
    }
  }
}

interface GraphQLUserData {
  repositories: {
    nodes: GraphQLRepo[]
  }
}

interface GraphQLResponse {
  data: {
    user: GraphQLUserData
  }
}

export async function GET() {
  const username = "gravadox"
  const token = process.env.GITHUB_TOKEN
  if (!token) return NextResponse.json({ error: "GITHUB_TOKEN not set" }, { status: 500 })

  const userRes = await fetch(`https://api.github.com/users/${username}`)
  if (!userRes.ok) return NextResponse.json({ error: "User not found" }, { status: 404 })
  const user: User = await userRes.json()

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
  const reposData: RestRepo[] = await reposRes.json()

  const graphqlQuery = `
    query {
      user(login: "${username}") {
        repositories(first: 6, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            name
            stargazerCount
            description
            defaultBranchRef {
              target {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const graphqlRes = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: graphqlQuery }),
  })

  const graphqlData: GraphQLResponse = await graphqlRes.json()
  const userData = graphqlData.data.user

  const repos: Repo[] = userData.repositories.nodes.map((r: GraphQLRepo, i: number) => ({
    name: r.name,
    url: reposData[i]?.html_url ?? "#",
    updated: reposData[i]?.updated_at ?? new Date().toISOString(),
    language: reposData[i]?.language ?? null,
    description: r.description,
    stars: r.stargazerCount,
    commits: r.defaultBranchRef?.target?.history?.totalCount ?? 0,
  }))

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0)

  return NextResponse.json({
    avatar: user.avatar_url,
    username: user.login,
    name: user.name,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    totalStars,
    repos,
  })
}
