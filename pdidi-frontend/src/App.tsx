import './App.css'
import { RouterProvider } from 'react-router-dom'
import { route } from './router/router'
import Header from './components/ui/header'
import Footer from './components/ui/footer'
import { useUser } from './context/user-hook'

function App() {

  const userContext = useUser()

  return (
    <div className='w-full h-full flex flex-col'>
      <Header user={userContext.username}/>
      <div className='w-full h-9/10 flex-1'>
        <RouterProvider router={route}/>
      </div>
      <Footer/>
    </div>
  )
}

export default App
