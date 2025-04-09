import { cookies } from "next/headers"

export async function getUser() {
  const token = cookies().get("auth_token")?.value

  if (!token) {
    return null
  }

  try {
    // In a real app, you would verify the JWT token
    // and fetch user data from your database or API

    // For demo purposes, return a mock user
    return {
      id: "user123",
      name: "John Doe",
      email: "user@example.com",
    }
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function isAuthenticated() {
  const user = await getUser()
  return !!user
}

export async function logout() {
  cookies().delete("auth_token")
}
