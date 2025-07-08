import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker';

function getAuthToken(){
   x_auth_token_valid = headers["X-Auth-Token"]
}

test.describe("API challenge", () => {
 test.describe.configure({ mode: 'serial' });

  let URL = "https://apichallenges.herokuapp.com";
  let token = '';
  let x_auth_token_valid = '';

  test.beforeAll(async ({ request, playwright }) => {
    if (token.length == 0) {
      let response = await request.post(`${URL}/challenger`);
      let headers = response.headers();
      token = headers["x-challenger"];
      console.log('Это токен ' + token);

      expect(headers).toEqual(
        expect.objectContaining({ "x-challenger": expect.any(String) }),
      );
    }
    if (x_auth_token_valid.length == 0) {
      const requestAuthenticated = await playwright.request.newContext({
        httpCredentials: {
          username: 'admin',
          password: 'password'
        }
      });
      
      let response = await requestAuthenticated.post(`${URL}/secret/token`, {
        headers: {
          'x-challenger': token
        }
      });
      let headers = response.headers();
      x_auth_token_valid = headers["x-auth-token"];
      console.log('Это auth токен ' + x_auth_token_valid);
      expect(headers).toEqual(
        expect.objectContaining({ "x-auth-token": expect.any(String) }),
      )
    }
  });

  test("02 First Real Challenge", {tag: ['@id_02', '@GET', '@challenges']}, async ({ request }) => {
    let response = await request.get(`${URL}/challenges`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
    expect(body.challenges.length).toBe(59); 
  });

  test("Get all todos", {tag: ['@id_03', '@GET', '@todos']}, async ({ request }) => {
    let response = await request.get(`${URL}/todos`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos.length).toBeGreaterThan(0);
  });
  
  test("Nouns should be plural", {tag: ['@id_04', '@GET', '@todo']}, async ({ request }) => {
    let response = await request.get(`${URL}/todo`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(404);
  });

  test("Get a specific todo", {tag: ['@id_05', '@GET', '@todos']}, async ({ request }) => {
    let id = 1;
    let response = await request.get(`${URL}/todos/${id}`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos[0].id).toBe(id);
  });

  test("A todo does not exist", {tag: ['@id_06', '@GET', '@todos']}, async ({ request }) => {
    let id = 0;
    let response = await request.get(`${URL}/todos/${id}`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    expect(response.status()).toBe(404);
    expect(body.errorMessages[0]).toBe(`Could not find an instance with todos/${id}`)
  });
});
