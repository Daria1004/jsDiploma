import { expect } from '@playwright/test';
import { test } from '../src/helpers/fixtures/index';
import { TodoBuilder } from '../src/helpers/builders';

test.describe('API challenge', () => {
  test(
    '02 First Real Challenge',
    { tag: ['@id_02', '@api', '@GET', '@challenges'] },
    async ({ apiRequest }) => {
      let response = await apiRequest.get(`/challenges`);
      let body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.challenges.length).toBe(59);
    },
  );

  test(
    'Get all todos',
    { tag: ['@id_03', '@GET', '@api', '@todos'] },
    async ({ apiRequest }) => {
      let response = await apiRequest.get(`/todos`);
      let body = await response.json();
      expect(response.status()).toBe(200);
      expect(body.todos.length).toBeGreaterThan(0);
    },
  );

  test(
    'Get a specific todo',
    { tag: ['@id_05', '@api', '@GET', '@todos'] },
    async ({ apiRequest, todo }) => {
      let response = await apiRequest.get(`/todos/${todo.id}`);
      let body = await response.json();
      expect(response.status()).toBe(200);
      expect(body.todos[0].id).toBe(todo.id);
    },
  );

  test(
    'A todo does not exist',
    { tag: ['@id_06', '@api', '@GET', '@todos'] },
    async ({ apiRequest }) => {
      let id = 0;
      let response = await apiRequest.get(`/todos/${id}`);
      let body = await response.json();
      expect(response.status()).toBe(404);
      expect(body.errorMessages[0]).toBe(
        `Could not find an instance with todos/${id}`,
      );
    },
  );

  test(
    'Create a todo',
    { tag: ['@id_09', '@api', '@POST', '@todos'] },
    async ({ apiRequest }) => {
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
      expect(response.status()).toBe(201);
      expect(body.description).toBe(todoBuilder.description);
    },
  );

  test(
    'Successfully update a todo',
    { tag: ['@id_17', '@api', '@POST', '@todos'] },
    async ({ apiRequest, todo }) => {
      const todoBuilder = new TodoBuilder()
        .addTitle()
        .addDescription()
        .generate();
      let response = await apiRequest.post(`/todos/${todo.id}`, {
        headers: {
          'content-type': 'application/json',
        },
        data: {
          title: todoBuilder.title,
          description: todoBuilder.description,
        },
      });
      let body = await response.json();
      expect(response.status()).toBe(200);
      expect(body.title).toBe(todoBuilder.title);
      expect(body.description).toBe(todoBuilder.description);
    },
  );

  test(
    'Fail to update an existing todo because title is missing',
    { tag: ['@id_21', '@api', '@PUT', '@todos'] },
    async ({ apiRequest, todo }) => {
      const todoBuilder = new TodoBuilder().addDescription().generate();
      let response = await apiRequest.put(`/todos/${todo.id}`, {
        headers: {
          'content-type': 'application/json',
        },
        data: {
          description: todoBuilder.description,
        },
      });

      let body = await response.json();
      expect(response.status()).toBe(400);
      expect(body.errorMessages[0]).toBe('title : field is mandatory');
    },
  );

  test(
    'Successfully delete a todo',
    { tag: ['@id_23', '@api', '@DELETE', '@todos'] },
    async ({ apiRequest, todo }) => {
      let response = await apiRequest.delete(`/todos/${todo.id}`);
      let body = await response.text();

      expect(response.status()).toBe(200);
      expect(body).toContain('');
    },
  );
});
