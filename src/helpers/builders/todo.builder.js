import { faker } from '@faker-js/faker';

export class TodoBuilder {
  addTitle() {
    this.title = faker.book.title() + 'otempora';
    return this;
  }
  addStatus() {
    this.status = true;
    return this;
  }
  addDescription() {
    this.description = faker.lorem.sentence();
    return this;
  }

  generate() {
    return {
      title: this.title,
      doneStatus: this.status,
      description: this.description,
    };
  }
}
