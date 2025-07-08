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

  test("Get only headers", {tag: ['@id_08', '@HEAD', '@todos']}, async ({ request }) => {
    let response = await request.head(`${URL}/todos`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['x-challenger']).toBeTruthy();
  });

  test("Create a todo", {tag: ['@id_09', '@POST', '@todos']}, async ({ request }) => {
    let description = '@id_09'
    let response = await request.post(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
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

test("Validation on the `doneStatus` field", {tag: ['@id_10', '@POST', '@todos']}, async ({ request }) => {
  let response = await request.post(`${URL}/todos`, {
    headers: {
      'x-challenger': token,
      'content-type': 'application/json',
    },
    data:{
      title: 'Daria Otempora',
      doneStatus: 'true',
      description: '@id_10'
    }
  });

  let body = await response.json();
  expect(response.status()).toBe(400);
  expect(body.errorMessages[0]).toBe('Failed Validation: doneStatus should be BOOLEAN but was STRING');
});

  test("Title too long", {tag: ['@id_11', '@POST', '@todos']}, async ({ request }) => {
    let title = faker.lorem.sentence(51).substring(0, 51);
    let response = await request.post(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'content-type': 'application/json',
      },
      data:{
        title: title,
        doneStatus: true,
        description: '@id_11'
      },
    }
    );
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages[0]).toBe('Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50');
  });

  test("Description too long", {tag: ['@id_12', '@POST', '@todos']}, async ({ request }) => {
    let description = faker.lorem.sentence(200).substring(0, 201);
    let response = await request.post(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
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
    expect(response.status()).toBe(400);
    expect(body.errorMessages[0]).toBe('Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200');
  });

  test("Max out content", {tag: ['@id_13', '@POST', '@todos']}, async ({ request }) => {
    let title = faker.lorem.sentence(51).substring(0, 50);
    let description = faker.lorem.sentence(200).substring(0, 200);
    let response = await request.post(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'content-type': 'application/json',
      },
      data:{
        title: title,
        doneStatus: true,
        description: description
      },
    }
    );
    expect(response.status()).toBe(201);
    expect(title.length).toBe(50);
    expect(description.length).toBe(200);
  });

  test("Content too long", {tag: ['@id_14', '@POST', '@todos']}, async ({ request }) => {

    let description = faker.lorem.sentence(5000).substring(0, 5000);
    let response = await request.post(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
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
    expect(response.status()).toBe(413);
    expect(body.errorMessages[0]).toBe('Error: Request body too large, max allowed is 5000 bytes');
  });

  test("Extra", {tag: ['@id_15', '@POST', '@todos']}, async ({ request }) => {

    let response = await request.post(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'content-type': 'application/json',
      },
      data:{
        title: 'Daria Otempora',
        description: '@id_15',
        priority: 'high'
      },
    }
    );
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages[0]).toBe('Could not find field: priority');
  });

  test("Unsuccessfully create a todo", {tag: ['@id_16', '@PUT', '@todos']}, async ({ request }) => {
    let id = 1004;
    let response = await request.put(`${URL}/todos/${id}`, {
      headers: {
        'x-challenger': token,
        'content-type': 'application/json',
      },
      data:{
        title: 'Daria Otempora',
        doneStatus: true,
        description: '@id_16',
      },
    }
    );
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages[0]).toBe('Cannot create todo with PUT due to Auto fields id');
  });

  test("Successfully update a todo", {tag: ['@id_17', '@POST', '@todos']}, async ({ request }) => {
    let id = 1;
    let response = await request.post(`${URL}/todos/${id}`, {
      headers: {
        'x-challenger': token,
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

  test("Todo does not exist", {tag: ['@id_18', '@POST', '@todos']}, async ({ request }) => {
    let id = 1004;
    let response = await request.post(`${URL}/todos/${id}`, {
      headers: {
        'x-challenger': token,
        'content-type': 'application/json',
      },
      data:{
        title: 'Daria Otempora',
        description: '@id_17',
      },
    }
    );
    let body = await response.json();
    expect(response.status()).toBe(404);
    expect(body.errorMessages[0]).toBe('No such todo entity instance with id == 1004 found');
  });

  test("Update an existing todo", {tag: ['@id_19', '@PUT', '@todos']}, async ({ request }) => {
    let id = 1;
    let description = '@id_19';
    let title = 'Daria_Otempora_id_19';
    let response = await request.put(`${URL}/todos/${id}`, {
      headers: {
        'x-challenger': token,
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

  test("Update an existing todo partially", {tag: ['@id_20', '@PUT', '@todos']}, async ({ request }) => {
    let id = 1;
    let title = 'Daria_Otempora_id_20'
    let response = await request.put(`${URL}/todos/${id}`, {
      headers: {
        'x-challenger': token,
        'content-type': 'application/json',
      },
      data:{
        title: title
      },
    });
    
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.title).toBe(title);
  });
  
  test("Fail to update an existing todo because title is missing", {tag: ['@id_21', '@PUT', '@todos']}, async ({ request }) => {
    let id = 1;
    let description = 'Daria_Otempora_id_21'
    let response = await request.put(`${URL}/todos/${id}`, {
      headers: {
        'x-challenger': token,
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
  
  test("Update todo with no amend id", {tag: ['@id_22', '@PUT', '@todos']}, async ({ request }) => {
    let id = 1;
    let description = '@id_22'
    let response = await request.put(`${URL}/todos/${id}`, {
      headers: {
        'x-challenger': token,
        'content-type': 'application/json',
      },
      data:{
        id: 1004,
        description: description
      },
    });

    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages[0]).toBe('Can not amend id from 1 to 1004');
  });

  test("Successfully delete a todo", {tag: ['@id_23', '@DELETE', '@todos']}, async ({ request }) => {
    let id = 1;
    let response = await request.delete(`${URL}/todos/${id}`, {
      headers: {
        'x-challenger': token
      }
    });

    let body = await response.text();
  
    expect(response.status()).toBe(200);
    expect(body).toContain('');
  });

  test("Check the 'Allow' header ", {tag: ['@id_24', '@OPTIONS', '@todos']}, async ({ request }) => {
    let response = await request.fetch(`${URL}/todos`, {
      method: 'options',
      headers: {
        'x-challenger': token
      }
    });
    expect(response.headers()).toHaveProperty("allow", "OPTIONS, GET, HEAD, POST");
  });

  test("Return XML response", {tag: ['@id_25', '@GET', '@todos']}, async ({ request }) => {
    let response = await request.get(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'accept': 'application/xml'
      }
    });
    let body = await response.text();
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/xml');
    expect(body).toContain('<todo')
  });

  test("Return JSON response", {tag: ['@id_26', '@GET', '@todos']}, async ({ request }) => {
    let response = await request.get(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'accept': 'application/json'
      }
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/json');
    expect(Array.isArray(body.todos)).toBe(true)
  });

  test("Return ANY response", {tag: ['@id_27', '@GET', '@todos']}, async ({ request }) => {
    let response = await request.get(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'accept': '*/*'
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/json');
  });

  test("XML pref", {tag: ['@id_28', '@GET', '@todos']}, async ({ request }) => {
    let response = await request.get(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'accept':  'application/xml, application/json'
      }
    });

    let body = await response.text();
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/xml');
    expect(body).toContain('<todo')
  });

  test("No `Accept` header" , {tag: ['@id_29', '@GET', '@todos']}, async ({ request }) => {
    let response = await request.get(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'accept': ''
      }
    });

    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/json');
    expect(body).toHaveProperty('todos');
  });

  test("Invalid Accept Header" , {tag: ['@id_30', '@GET', '@todos']}, async ({ request }) => {
    let response = await request.get(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'accept': 'application/gzip'
      }
    });

    let body = await response.json();
    expect(response.status()).toBe(406);
    expect(body.errorMessages[0]).toBe('Unrecognised Accept Type');
  });

  test("Create a todo using Content-Type `application/xml`" , {tag: ['@id_31', '@POST', '@todos']}, async ({ request }) => {
    let response = await request.post(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'Content-Type': 'application/xml',
        'accept': 'application/xml'
      },
      data: '<todo><doneStatus>true</doneStatus><description>@id_31</description><title>Daria Otempora</title></todo>'
    }
    );
    let body = await response.text();
    expect(response.status()).toBe(201);
    expect(body).toContain('<id>');
    expect(body).toContain('<description>@id_31</description>');
  });

  test("Create a todo using Content-Type `application/json`" , {tag: ['@id_32', '@POST', '@todos']}, async ({ request }) => {
    let description = '@id_32'
    let response = await request.post(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      data:{
        title: 'Daria_Otempora_id_32',
        doneStatus: true,
        description: description
      },
    });
    let body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.description).toBe(description);
  });

  test("Unsupported content type" , {tag: ['@id_33', '@POST', '@todos']}, async ({ request }) => {
    let response = await request.post(`${URL}/todos`, {
      headers: {
        'x-challenger': token,
        'Content-Type': 'text/html'
      },
      data: ''
    });
    let body = await response.json();
    expect(response.status()).toBe(415);
    expect(body.errorMessages[0]).toContain('Unsupported Content Type');
  });

  test("Invalid Basic Auth" , {tag: ['@id_48', '@POST', '@authentication']}, async ({ playwright }) => {
    const requestAuthenticated = await playwright.request.newContext({
      httpCredentials: {
        username: 'user',
        password: 'passwd'
      }
    });
    
    let response = await requestAuthenticated.post(`${URL}/secret/token`, {
      headers: {
        'x-challenger': token
      }
    });
    expect(response.status()).toBe(401);
  });

  test("Valid Basic Auth" , {tag: ['@id_49', '@POST', '@authentication']}, async ({ playwright }) => {
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
    expect(response.status()).toBe(201);
  });

  test("Invalid X-AUTH-TOKEN returns 403 Forbidden" , {tag: ['@id_50', '@GET', '@authorization']}, async ({ request }) => {
    let x_auth_token = '1234'
    let response = await request.get(`${URL}/secret/note`, {
      headers: {
        'x-challenger': token,
        'x-auth-token': x_auth_token
      }
    });
    expect(response.status()).toBe(403);
    expect(response.statusText()).toBe('Forbidden');
  });

  test("X-AUTH-TOKEN no presents" , {tag: ['@id_51', '@GET', '@authorization']}, async ({ request }) => {
    let response = await request.get(`${URL}/secret/note`, {
      headers: {
        'x-challenger': token
      }
    });
    expect(response.status()).toBe(401);
    expect(response.statusText()).toBe('Unauthorized');
  });

  test("Valid X-AUTH-TOKEN returns 200" , {tag: ['@id_52', '@GET', '@authorization']}, async ({ request }) => {
    let response = await request.get(`${URL}/secret/note`, {
      headers: {
        'x-challenger': token,
        'x-auth-token': x_auth_token_valid
      }
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('note')
  });
  
  test("Post note with valid auth token" , {tag: ['@id_53', '@POST', '@authorization']}, async ({ request }) => {
    let note = '@id_53'
    let response = await request.post(`${URL}/secret/note`, {
      headers: {
        'x-challenger': token,
        'x-auth-token': x_auth_token_valid
      },
      data: {
        note: note
      } 
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('note')
  });

  test("Post note when no X-AUTH-TOKEN present" , {tag: ['@id_54', '@POST', '@authorization']}, async ({ request }) => {
    let note = '@id_54'
    let response = await request.post(`${URL}/secret/note`, {
      headers: {
        'x-challenger': token
      },
      data: {
        note: note
      } 
    });
    expect(response.status()).toBe(401);
    expect(response.statusText()).toBe('Unauthorized');
  });

  test("Post note when invalid X-AUTH-TOKEN" , {tag: ['@id_55', '@POST', '@authorization']}, async ({ request }) => {
    let note = '@id_55'
    let response = await request.post(`${URL}/secret/note`, {
      headers: {
        'x-challenger': token,
        'x-auth-token': '1234'
      },
      data: {
        note: note
      } 
    });
    expect(response.status()).toBe(403);
    expect(response.statusText()).toBe('Forbidden');
  });

  test("Using the X-AUTH-TOKEN value as an Authorization Bearer token" , {tag: ['@id_56', '@GET', '@authorization']}, async ({ request }) => {
    let response = await request.get(`${URL}/secret/note`, {
      headers: {
        'x-challenger': token,
        'Authorization': `Bearer ${x_auth_token_valid}`
      }
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('note')
  });

  test("Post note with valid Bearer token" , {tag: ['@id_57', '@POST', '@authorization']}, async ({ request }) => {
    let note = '@id_57'
    let response = await request.post(`${URL}/secret/note`, {
      headers: {
        'x-challenger': token,
        'Authorization': `Bearer ${x_auth_token_valid}`
      },
      data: {
        note: note
      } 
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('note');
    expect(body.note).toBe(note);
  });

  test("Filter only done todos", {tag: ['@id_07', '@GET', '@todos']}, async ({ request }) => {
    let response = await request.get(`${URL}/todos?doneStatus=true`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('todos');
    if (body.todos.length > 0)
      body.todos.forEach(todo => {
        expect(todo).toHaveProperty('doneStatus', true);
    });
  });
});
