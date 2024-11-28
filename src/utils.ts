export const normalize = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\-\/\s]/g, '')
        .trim();
};

export const fetchSearchKey = async () => {
    try {
        const url = 'https://howlongtobeat.com';
        const response = await fetchNoCors(url);

        if (response.status === 200) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const scripts = doc.querySelectorAll('script');

            for (const script of scripts) {
                if (script.src.includes('_app-')) {
                    const scriptUrl = url + new URL(script.src).pathname;
                    const scriptResponse = await fetchNoCors(scriptUrl);

                    if (scriptResponse.status === 200) {
                        const scriptText = await scriptResponse.text();

                        const pattern =
                            /\/api\/search\/"\.concat\("([a-zA-Z0-9]+)"\)\.concat\("([a-zA-Z0-9]+)"\)/;
                        const matches = scriptText.match(pattern);

                        if (matches && matches[1] && matches[2]) {
                            const apiKey = `${matches[1]}${matches[2]}`;
                            console.log('HLTB API Key:', apiKey);
                            return apiKey;
                        }
                    }
                }
            }

            console.error('HLTB - failed to get API key!');
        } else {
            console.error('HLTB', response);
        }
    } catch (error) {
        console.error('Error fetching HLTB API key:', error);
    }

    return null;
};
