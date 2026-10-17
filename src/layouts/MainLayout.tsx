import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/navigation/Sidebar'
import Header from '../components/navigation/Header'
import PageHead from '../components/navigation/PageHead'
import PageErrorBoundary from './PageErrorBoundary'

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLElement>(null)

  // Прокручивается <main>, а не окно, поэтому при смене страницы сбрасываем его прокрутку сами
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setMenuOpen(true)} />
        <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-10 pt-2 lg:px-8">
          {/* @container: страницы подстраиваются под ширину области контента */}
          <div className="mx-auto w-full max-w-[1680px] @container">
            <PageHead />
            {/* key: при переходе на другую страницу граница ошибки сбрасывается */}
            <PageErrorBoundary key={pathname}>
              <Outlet />
            </PageErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}
