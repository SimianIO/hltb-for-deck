import { definePlugin, staticClasses } from '@decky/ui';
import { routerHook } from '@decky/api';
import { FaGamepad } from 'react-icons/fa';
import { patchAppPage } from './patches/LibraryApp';
import { QuickAccessView } from './components/QuickAccessView/QuickAccessView';
import contextMenuPatch, {
    LibraryContextMenu,
} from './patches/LibraryContextMenu';
import { LoadingScreen } from './components/LoadingScreen';
import { fetchSearchKey } from './utils'; // Import fetchSearchKey

export default definePlugin(async () => {
    // Fetch the API key during initialization
    const apiKey = await fetchSearchKey();
    if (!apiKey) {
        console.error('HLTB Plugin: Failed to fetch API key.');
    } else {
        console.log('HLTB Plugin: API key fetched successfully:', apiKey);
        // Optionally: Store the API key globally if needed
        // Example: window.hltbApiKey = apiKey;
    }

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
