import { EditorPane } from './components/editor-pane'
import { ToastBar, Toaster } from 'react-hot-toast'
import { CheckIcon } from 'lucide-react'
import { CollectionPane } from './components/collection-pane'
import { Header } from './components/header'
import { useAtom } from 'jotai'
import { themeAtom } from './store'
import { useEffect } from 'react'
import { HotKeys } from 'react-hotkeys'

function App() {
  const [theme, setTheme] = useAtom(themeAtom);
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <HotKeys
      keyMap={{
        'TOGGLE_THEME': 't',
      }}
      handlers={{
        TOGGLE_THEME: handleToggleTheme,
      }}
      className='focus:outline-none'
    >
      <div
        className="flex flex-col gap-8 bg-background p-16 min-h-screen text-base"
        style={{
          transition: 'background-color 0.2s ease',
        }}
      >
        <Header />
        <div className="flex flex-row gap-16">
          <EditorPane />
          <CollectionPane />
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            className: '',
            duration: 1000,
            style: {
              background: 'var(--color-background)',
              color: 'var(--color-text-primary)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px 0 var(--toast-shadow)',
              border: '1px solid var(--toast-border)',
              padding: '8px 16px',
            },
            icon: <CheckIcon width={16} height={16} color='var(--color-toast-icon)' />,
          }}
        >
          {(t) => (
            <ToastBar toast={t} style={{
              ...t.style,
              animation: t.visible ? 'toast-in 0.3s ease' : 'toast-out 0.3s ease forwards',
            }} />
          )}
        </Toaster>
      </div>
    </HotKeys>
  )
}

export default App
