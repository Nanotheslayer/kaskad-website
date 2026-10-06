import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/navigation/Sidebar'
import Header from '../components/navigation/Header'
import PageHead from '../components/navigation/PageHead'

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    document.getElementById('main-scroll')?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setMenuOpen(true)} />
        <main id="main-scroll" className="flex-1 overflow-y-auto px-4 pb-10 pt-2 lg:px-8">
          <PageHead />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
