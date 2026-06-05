import { Outlet } from 'react-router-dom'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import { useUser } from '@/context/user-storage'

export default function Layout() {
  const { user } = useUser()

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Header user={user?.username} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
