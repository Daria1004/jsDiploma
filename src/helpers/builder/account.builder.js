import { faker } from '@faker-js/faker';

export class AccountBuilder{
    addEmail() {
        this.email = faker.internet.email();
        return this;
    }

    generate() {
        return{
            email: this.email,
        };
    }
};