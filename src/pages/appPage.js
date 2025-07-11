import { AccountPage, ExtraStoredPage, FindBugsPage, ForgotPasswordPage, MainPage, StorePage } from './index'

export class App {
    constructor(page){
        this.page = page;
        this.main = new MainPage(page);
        this.extraStored = new ExtraStoredPage(page);
        this.findBugs = new FindBugsPage(page);
        this.forgotPassword = new ForgotPasswordPage(page);
        this.account = new AccountPage(page);
        this.store = new StorePage(page);
    };
}
