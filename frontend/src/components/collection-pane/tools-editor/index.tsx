import { Download, Upload } from 'lucide-react';
import { IconButton } from '../../inputs/button';
import { useStore } from 'jotai';
import { exportGradientData } from '../../../store/export';
import { importGradientData } from '../../../store/index';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { Section } from '../../layout';

export const Tools = () => {
  const store = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportGradientData(store.get);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = store.set(importGradientData, text);

      if (result.success) {
        toast.success('Data imported successfully', {
          duration: 3000,
        });
      } else {
        toast.error(`Import failed`);
      }
    } catch (error) {
      console.error('Failed to read file:', error);
      toast.error('Failed to read file');
    }

    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <Section title="Parameters">
      <div className="flex flex-col gap-1">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
        <IconButton
          icon={<Upload />}
          label="Load from file"
          onClick={handleImport}
        />
        <IconButton
          icon={<Download />}
          label="Export to file"
          onClick={handleExport}
        />
      </div>
    </Section>
  );
}
