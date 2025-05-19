import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useAuth = () => {
  const router = useRouter()

  const signOut = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error()
      }

      toast.success('Signed out successfully')

      router.push('/sign-in')
      router.refresh()
    } catch {
      toast.error("Chould't sign out, please try again")
    }
  }

  return {
    signOut,
  }
}
