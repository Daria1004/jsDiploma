import { expect } from "@playwright/test";
import { test } from '../src/helpers/fixtures/index';

test.describe("API challenge", () => {
 test.describe.configure({ mode: 'serial' });
  test("02 First Real Challenge", {tag: ['@id_02', '@api', '@GET', '@challenges']}, async ({ apiRequest }) => {
    let response = await apiRequest.get(`/challenges`)
    let body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.challenges.length).toBe(59); 
  });

  test("Get all todos", {tag: ['@id_03', '@GET', '@api', '@todos']}, async ({ apiRequest }) => {
    let response = await apiRequest.get(`/todos`)
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos.length).toBeGreaterThan(0);
  });
  
  test("Get a specific todo", {tag: ['@id_05', '@api', '@GET', '@todos']}, async ({ apiRequest }) => {
    let id = 1;
    let response = await apiRequest.get(`/todos/${id}`)
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos[0].id).toBe(id);
  });

  test("A todo does not exist", {tag: ['@id_06', '@api', '@GET', '@todos']}, async ({ apiRequest }) => {
    let id = 0;
    let response = await apiRequest.get(`/todos/${id}`);
    let body = await response.json();
    expect(response.status()).toBe(404);
    expect(body.errorMessages[0]).toBe(`Could not find an instance with todos/${id}`)
  });

  test("Create a todo", {tag: ['@id_09', '@api', '@POST', '@todos']}, async ({ apiRequest }) => {
    let description = '@id_09'
    let response = await apiRequest.post(`/todos`, {
      headers: {
        'content-type': 'application/json',
      },
      data:{
        title: 'Daria Otempora',
        doneStatus: true,
        description: description
      },
    }
    );
    let body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.description).toBe(description);
});

  test("Successfully update a todo", {tag: ['@id_17', '@api', '@POST', '@todos']}, async ({ apiRequest }) => {
    let id = 1;
    let response = await apiRequest.post(`/todos/${id}`, {
      headers: {
        'content-type': 'application/json',
      },
      data:{
        title: 'Daria Otempora',
        description: '@id_17',
      },
    }
    );
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.title).toBe('Daria Otempora');
    expect(body.description).toBe('@id_17');
  });

  test("Update an existing todo", {tag: ['@id_19', '@api', '@PUT', '@todos']}, async ({ apiRequest }) => {
    let id = 1;
    let description = '@id_19';
    let title = 'Daria_Otempora_id_19';
    let response = await apiRequest.put(`/todos/${id}`, {
      headers: {
        'content-type': 'application/json',
      },
      data:{
        title: title,
        doneStatus: true,
        description: description
      },
    }
    );
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.title).toBe(title);
    expect(body.description,).toBe(description);
  });

  test("Fail to update an existing todo because title is missing", {tag: ['@id_21', '@api', '@PUT', '@todos']}, async ({ apiRequest }) => {
    let id = 1;
    let description = 'Daria_Otempora_id_21'
    let response = await apiRequest.put(`/todos/${id}`, {
      headers: {
        'content-type': 'application/json',
      },
      data:{
        description: description
      },
    });

    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages[0]).toBe('title : field is mandatory');
  });
  
  test("Successfully delete a todo", {tag: ['@id_23', '@api', '@DELETE', '@todos']}, async ({ apiRequest }) => {
    let id = 1;
    let response = await apiRequest.delete(`/todos/${id}`);

    let body = await response.text();
  
    expect(response.status()).toBe(200);
    expect(body).toContain('');
  });
});
