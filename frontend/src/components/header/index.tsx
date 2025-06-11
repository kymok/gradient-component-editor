import { Toolbar } from '../inputs/toolbar';
import { useAtom } from 'jotai';
import { gamutAtom, themeAtom } from '../../store';
import { Select } from '../inputs/select';
import { Gamut } from '../../utils/gamut';
import { Switch } from '../inputs/switch';
import { MoonIcon, SunIcon } from 'lucide-react';

export const Header = () => {
  const [gamut, setGamut] = useAtom(gamutAtom);
  const [theme, setTheme] = useAtom(themeAtom); // Assuming theme is also managed by gamutAtom

  return (
    <header className="flex flex-col gap-4">
      <h1 className="font-serif font-semibold text-text-primary text-xl leading-none">Gradient Component Editor</h1>
      <Toolbar>
        <div className="flex flex-row items-center gap-4">
          <Select
            label="Gamut:"
            value={gamut}
            onValueChange={(value) => setGamut(value as Gamut)}
            items={[
              { value: 'srgb', label: 'sRGB' },
              { value: 'display-p3', label: 'Display P3' },
            ]}
          />
          <div className="flex flex-row items-center gap-1">
            <SunIcon className="w-4 h-4 text-text-primary" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(value) => setTheme(value ? 'dark' : 'light')}
            />
            <MoonIcon className="w-4 h-4 text-text-primary" />
          </div>
        </div>
      </Toolbar>
    </header >
  )
}