import { ContentPlugin } from '@rollthecloudinc/content';
import { DownloadComponent } from './download.component';
import { DownloadContentHandler } from './handlers/download-content.handler';

export const pluginDownloadContentPluginFactory  = ({ handler }: { handler: DownloadContentHandler }) => {
  return new ContentPlugin<string>({
    id: 'plugin_download',
    title: 'Plugin Download',
    selectionComponent: undefined,
    editorComponent: undefined,
    renderComponent: DownloadComponent,
    handler
  } as any);
};