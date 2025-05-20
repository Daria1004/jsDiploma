import { step } from "allure-js-commons";
export class StorePage {
    constructor(page) {
        this.page = page;
        this.manufacturerLink = page.locator('div#manufacturer-bug').locator('a');
        this.currencySelect = page.locator('#ec_currency_conversion');
        this.commentForm = page.locator('form.comment-form').locator('textarea#comment');
        this.nameForm = page.locator('form.comment-form').locator('input#author');
        this.emailForm = page.locator('form.comment-form').locator('input#email');
        this.buttonPostComment = page.locator('form.comment-form').locator('input#submit');
        this.signUpLink = page.locator('.ec_cart_input_row').getByRole('link', {name: "Sign Up"});
    }   

    async gotoManufacturer() {
        await step("Переход по ссылке на страницу Производителя", async () => {
            await this.manufacturerLink.click();
        })
    } 

    async changeCurrency(value) {
        await step("Изменить валюту", async () => {
            this.currencySelect.selectOption(value);
        })
    } 

    async gotoSignUp() {
        await step("Переход на страницу Account", async () => {
            this.signUpLink.click();
        })
    } 

    async addComment(comment) {
        await step("Добавить комментарий к товару", async () => {
            await this.commentForm.click();
            await this.commentForm.fill(comment.text);
            await this.nameForm.click();
            await this.nameForm.fill(comment.name);
            await this.emailForm.click();
            await this.emailForm.fill(comment.email);
            await this.buttonPostComment.click();
        });
    } 
};
