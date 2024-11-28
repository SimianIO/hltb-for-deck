import { definePlugin, staticClasses } from '@decky/ui';
import { routerHook } from '@decky/api';
import { FaGamepad } from 'react-icons/fa';
import { patchAppPage } from './patches/LibraryApp';
import { QuickAccessView } from './components/QuickAccessView/QuickAccessView';
import contextMenuPatch, {
    LibraryContextMenu,
} from './patches/LibraryContextMenu';
import { LoadingScreen } from './components/LoadingScreen';
import { fetchSearchKey } from './utils';

// Define the initializePlugin function
async function initializePlugin() {
    const apiKey = await fetchSearchKey();
    if (apiKey) {
        console.log('Successfully fetched API key:', apiKey);
        // Store or pass the key if needed
    } else {
        console.error('Failed to fetch HLTB API key.');
    }
}

// Main plugin definition
export default definePlugin(async () => {
    await initializePlugin(); // Call initializePlugin during setup

    const libraryContextMenuPatch = contextMenuPatch(LibraryContextMenu);
    const libraryAppPagePatch = patchAppPage();
    routerHook.addRoute('/hltb-for-deck/loading', LoadingScreen);

    return {
        title: <div className={staticClasses.Title}>HLTB for Deck</div>,
        icon: <FaGamepad />,
        content: <QuickAccessView />,
        onDismount() {
            libraryContextMenuPatch?.unpatch();
            routerHook.removePatch('/library/app/:appid', libraryAppPagePatch);
            routerHook.removeRoute('/hltb-for-deck/loading');
        },
    };
});
