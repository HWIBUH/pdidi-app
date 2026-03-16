import { Outlet } from 'react-router-dom'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import { useUser } from '@/context/user-context'

export default function Layout() {
  const { user } = useUser()

  return (
    <div className='w-full h-full flex flex-col'>
      <Header user={user?.username} />
      <div className='w-full h-9/10 flex-1'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}