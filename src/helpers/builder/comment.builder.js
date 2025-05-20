import { faker } from '@faker-js/faker';

export class CommentBuilder{
    addText() {
        this.text = faker.lorem.sentence();
        return this;
    }

    addName() {
        this.name = faker.person.firstName();
        return this;
    }

    addEmail() {
        this.email = faker.internet.email();
        return this;
    }

    generate() {
        return{
            text: this.text,
            name: this.name,
            email: this.email,
        };
    }
};