import './App.css'
import { RouterProvider } from 'react-router-dom'
import { route } from './router/router'
import Header from './components/ui/header'
import Footer from './components/ui/footer'

function App() {

  return (
    <div className='w-full h-full flex flex-col'>
      <Header/>
      <div className='w-full flex flex-1 justify-center items-center'>
        <RouterProvider router={route}/>
      </div>
      <Footer/>
    </div>
  )
}

export default App
