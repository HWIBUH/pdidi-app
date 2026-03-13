import './App.css'
import { RouterProvider } from 'react-router-dom'
import { route } from './router/router'

function App() {

  return (
    <>
      <RouterProvider router={route}/>
    </>
  )
}

export default App
