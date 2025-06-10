import { Tabs } from 'radix-ui'
import { Collection } from './collection-editor';
import { ContrastGrid } from './contrast-grid-view';
import { ContrastReferences } from './contrast-reference-editor';
import { Tools } from './tools-editor';
import { PaneHeader } from '../layout';

export const CollectionPane = () => {
  return (
    <div className="flex flex-col gap-6 w-[512px] shrink-0">
      <Tabs.Root defaultValue='collection'>
        <div className="flex flex-col gap-6">
          <Tabs.List className="flex flex-row justify-start items-center gap-6 p-0 cursor-pointer">
            <Tabs.Trigger value='collection' asChild>
              <div className='-mb-1 pb-1 border-transparent border-b-[1px] data-[state=active]:border-b-text-primary'>
                <PaneHeader>Collection</PaneHeader>
              </div>
            </Tabs.Trigger>
            <Tabs.Trigger value='contrast-grid' asChild>
              <div className='-mb-1 pb-1 border-transparent border-b-[1px] data-[state=active]:border-b-text-primary'>
                <PaneHeader>Contrast Grid</PaneHeader>
              </div>
            </Tabs.Trigger>
            <Tabs.Trigger value='tools' asChild>
              <div className='-mb-1 pb-1 border-transparent border-b-[1px] data-[state=active]:border-b-text-primary'>
                <PaneHeader>Tools</PaneHeader>
              </div>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value='collection'>
            <Collection />
          </Tabs.Content>
          <Tabs.Content value='contrast-grid'>
            <div className="flex flex-col gap-6">
              <ContrastReferences />
              <ContrastGrid />
            </div>
          </Tabs.Content>
          <Tabs.Content value='tools'>
            <Tools />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};
