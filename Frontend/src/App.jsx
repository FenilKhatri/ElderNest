import { lazy, Suspense } from 'react'
import './App.css'
const AppRoute = lazy(() => import("./routes/AppRoutes"));

function App() {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoute />
    </Suspense>
    </>
  )
}

export default App
