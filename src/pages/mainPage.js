import { step } from "allure-js-commons";
export class MainPage {
    constructor(page) {
        this.page = page;
        this.findBugsLink = page.getByRole('link', { name: 'Find Bugs' });
        this.baseURL = '/';
        this.popupTutorialCloseButton = page.getByRole('button', {class: '.pum-close.popmake-close', name: '×'})
    }   

    async gotoFindBugs() {
        await step("Переход на страницу Find Bugs", async () => {
            await this.findBugsLink.click();
        });
    } 

    async open() {
        await step("Открытие сайта AcademyBugs.com", async () => {
            await this.page.goto(this.baseURL);
        });
    } 

    async closeTutorial() {
        await step("Закрыть туториал", async () => {
            const visible = await this.popupTutorialCloseButton.isVisible();
            if (visible)
                await this.popupTutorialCloseButton.click();
        });
    } 
};

