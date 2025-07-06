import { step } from "allure-js-commons";
export class FindBugsPage {
    
    constructor(page){
        this.page = page;
        this.onPageButton = page.getByRole('link', {class: 'what-we-offer-pagination-link', name: '10'})
        this.productLink = page.locator('li.ec_product_li').first().locator('a.ec_image_link_cover').first(); 
        this.crashBugOverlay = page.locator('.academy-bug-overlay');
  }   

    async changeItemsOnPage() {
        await step("Изменить количество отображаемых товаров на странице", async () => {
            await this.onPageButton.click();
        });
    }

    async openFirstProduct() {
        await step("Открыть первый товар", async () => {
            await this.productLink.click();
        });
    } 
}