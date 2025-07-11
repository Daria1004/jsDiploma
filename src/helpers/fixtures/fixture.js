import { test as base } from '@playwright/test';
import { App } from '../../pages/index';

export const test = base.extend ({
    apiURL: ["", { option: true }],
    app: async ({page}, use) => {
        let app = new App(page);
        await app.main.open();
        await app.main.closeTutorial();
        await app.main.gotoFindBugs();  
        await use(app);
    },
    apiRequest: async ({ playwright, request, apiURL }, use) => {
        let response = await request.post(apiURL + `/challenger`);
        let headers = response.headers();
        let token = headers["x-challenger"];
        
        const apiRequestContext = await playwright.request.newContext({
            baseURL: apiURL,
            extraHTTPHeaders: {
                "x-challenger": token,
            }
        });
        await use(apiRequestContext);
    },
});