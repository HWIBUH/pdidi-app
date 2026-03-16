import { Outlet } from 'react-router-dom'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import { useUser } from '@/context/user-context'

export default function Layout() {
  const { user } = useUser()

  return (
    <div className='w-full h-full flex flex-col'>
      <Header user={user?.username} />
      <div className='flex-1 overflow-auto w-full bg-white'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}