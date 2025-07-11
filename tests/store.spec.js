import { expect } from '@playwright/test';
import { test } from '../src/helpers/fixtures/index';
import { CommentBuilder } from '../src/helpers/builders/index';
import { step } from "allure-js-commons";

test.describe('Карточка товара', () => {
  test('Changing currency should not freeze the page', {tag: ['@store_page', '@ui', '@03', '@crash']}, async ({ app }) => { //выбрать другую валюту
    await app.findBugs.openFirstProduct();
    await app.store.changeCurrency("EUR");
    
    await step("Краш баг сообщение видимо", async () => {
      await expect(app.store.crashBugOverlay)
      .toContainText('You found a crash bug, examine the page for 5 seconds.');
    });
 });

test('Manufacturer link should not lead to error page', {tag: ['@extra/stored/hdx/_page', '@ui', '@16', '@functional']},async ({ app }) => {
    await app.findBugs.openFirstProduct();
    await app.store.gotoManufacturer();

    await step("Краш баг сообщение видимо", async () => {
      await expect(app.extraStored.errorContainer).toBeVisible();
      await expect(app.extraStored.errorContainer).toContainText("Oops! That page can’t be found.");
    });
  });

  test('Comment form should not freeze the page on submission', {tag: ['@store_page', '@ui', '@02', '@crash']}, async ({ app }) => { //оставить комментарий
    const commentBuilder = new CommentBuilder()
            .addText()
            .addName()
            .addEmail()
            .generate();

    await app.findBugs.openFirstProduct();
    await app.store.addComment(commentBuilder);

    await step("Краш баг сообщение видимо", async () => {
      await expect(app.store.crashBugOverlay)
      .toContainText('You found a crash bug, examine the page by clicking on any button for 5 seconds.');
    });
  });
});