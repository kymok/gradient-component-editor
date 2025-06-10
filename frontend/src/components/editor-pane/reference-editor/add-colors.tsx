import * as Dialog from '@radix-ui/react-dialog';
import { useSetAtom, useAtomValue } from 'jotai';
import { activeParamIdAtom, getReferenceColorsAtom, setReferenceColorsAtom } from '../../../store';
import { ReferenceInternal } from '../../../store/types';
import { v4 as uuidv4 } from 'uuid';
import { extractCssColor } from '../../../utils/extract-css-color';
import { IconButton } from '../../inputs/button';
import { Check, XIcon } from 'lucide-react';
import { useState } from 'react';

export const AddColorsDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const activeParamId = useAtomValue(activeParamIdAtom);
  const references = useAtomValue(getReferenceColorsAtom(activeParamId));
  const setReferences = useSetAtom(setReferenceColorsAtom(activeParamId));
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const cssText = text;
    const colors = extractCssColor(cssText);
    const newReferences: ReferenceInternal[] = colors.map(color => ({
      id: uuidv4(),
      color,
      matchingMethod: 'lightness',
    }));
    setReferences([...references, ...newReferences]);
    setText('');
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="top-1/2 left-1/2 fixed bg-surface-background shadow-lg p-8 rounded-2xl w-[90vw] max-w-[480px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Dialog.Title className="m-0 font-serif font-semibold text-text-primary text-lg">
                Add Colors from CSS
              </Dialog.Title>
              <Dialog.Description className="text-text-secondary text-sm">
                Paste CSS code containing colors. Supported formats are hex, rgb, hsl, hwb, (ok)lch and (ok)lab. Only absolute colors will be extracted.
              </Dialog.Description>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-2'>
                <fieldset className="m-0 p-0 border-none">
                  <textarea
                    name="cssText"
                    placeholder="Paste CSS code here..."
                    className="p-2 border border-border-primary rounded-md w-full h-[200px] resize-y"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </fieldset>
                <div className="flex justify-end gap-2">
                  <IconButton
                    icon={<XIcon />}
                    onClick={() => onOpenChange(false)}
                    label='Cancel'
                    variant='danger'
                  />
                  <IconButton
                    icon={<Check />}
                    onClick={() => handleSubmit()}
                    label='Add Colors'
                  />
                </div>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
