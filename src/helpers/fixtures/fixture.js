import { test as base } from '@playwright/test';
import { App } from '../../pages/index';
import { TodoBuilder } from '../builders/index';

export const test = base.extend({
  apiURL: ['', { option: true }],
  app: async ({ page }, use) => {
    let app = new App(page);
    await app.main.open();
    await app.main.closeTutorial();
    await app.main.gotoFindBugs();
    await use(app);
  },
  apiRequest: async ({ playwright, request, apiURL }, use) => {
    let response = await request.post(apiURL + `/challenger`);
    let headers = response.headers();
    let token = headers['x-challenger'];

    const apiRequestContext = await playwright.request.newContext({
      baseURL: apiURL,
      extraHTTPHeaders: {
        'x-challenger': token,
      },
    });
    await use(apiRequestContext);
  },
  todo: async ({ apiRequest }, use) => {
    const todoBuilder = new TodoBuilder()
      .addTitle()
      .addStatus()
      .addDescription()
      .generate();

    let response = await apiRequest.post(`/todos`, {
      headers: {
        'content-type': 'application/json',
      },
      data: todoBuilder,
    });
    let body = await response.json();
    await use(body);
  },
});
