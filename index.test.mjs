import test from 'node:test'
import assert from 'node:assert'
import crypto from 'node:crypto'
import { jsonReadableStream } from './index.mjs'

test("jsonReadableStream - simple object", async () => {
  const object = {
    name: 'Sebas',
    age: 30,
    address: {
      street: 'Rua das Flores',
      city: 'São Paulo',
      state: 'SP',
      zipCode: 123456
    }
  };

  const stream = jsonReadableStream(object);

  let result = '';
  for await (const chunk of stream) {
    result += new TextDecoder().decode(chunk);
  }

  assert.strictEqual(result, '{"name":"Sebas","age":30,"address":{"street":"Rua das Flores","city":"São Paulo","state":"SP","zipCode":123456}}');

});

test("jsonReadableStream - array", async () => {
  const object = [
    'Sebas',
    30,
    {
      street: 'Rua das Flores',
      city: 'São Paulo',
      state: 'SP',
      zipCode: 123456
    }
  ];

  const stream = jsonReadableStream(object);

  let result = '';
  for await (const chunk of stream) {
    result += new TextDecoder().decode(chunk);
  }

  assert.strictEqual(result, '["Sebas",30,{"street":"Rua das Flores","city":"São Paulo","state":"SP","zipCode":123456}]');
});


test("jsonReadableStream - nested object", async () => {
  const object = {
    name: 'Sebas',
    age: 30,
    address: {
      street: 'Rua das Flores',
      city: 'São Paulo',
      state: 'SP',
      zipCode: 123456
    }
  };

  const stream = jsonReadableStream(object);

  let result = '';
  for await (const chunk of stream) {
    result += new TextDecoder().decode(chunk);
  }

  assert.strictEqual(result, '{"name":"Sebas","age":30,"address":{"street":"Rua das Flores","city":"São Paulo","state":"SP","zipCode":123456}}');
});

test("jsonReadableStream - shallow", async () => {
  const object = {
    name: 'Sebas',
    age: 30,
    address: {
      street: 'Rua das Flores',
      city: 'São Paulo',
      state: 'SP',
      zipCode: 123456
    }
  };

  const stream = jsonReadableStream(object, { shallow: true });

  let result = '';
  for await (const chunk of stream) {
    result += new TextDecoder().decode(chunk);
  }

  assert.strictEqual(result, '{"name":"Sebas","age":30,"address":{"street":"Rua das Flores","city":"São Paulo","state":"SP","zipCode":123456}}');
});



test("jsonReadableStream - nested array", async () => {
  const object = [
    'Sebas',
    30,
    {
      street: 'Rua das Flores',
      city: 'São Paulo',
      state: 'SP',
      zipCode: [
        123556,
        "saopaulozip"
      ]
    }
  ];

  const stream = jsonReadableStream(object);

  let result = '';
  for await (const chunk of stream) {
    result += new TextDecoder().decode(chunk);
  }

  assert.strictEqual(result, '["Sebas",30,{"street":"Rua das Flores","city":"São Paulo","state":"SP","zipCode":[123556,"saopaulozip"]}]');
});


test("jsonReadableStream - very big object", async () => {
  const object = {
    name: 'Sebas',
    age: 30,
    address: {
      street: 'Rua das Flores',
      city: 'São Paulo',
      state: 'SP',
      zipCode: 123456
    },
  };

  for (let i = 0; i < 1000; i++) {
    object[`key${i}`] = `value${i}${crypto.randomBytes(1024 * 100).toString('hex')}`;
  }

  const stream = jsonReadableStream(object);

  let result = '';
  for await (const chunk of stream) {
    result += new TextDecoder().decode(chunk);
  }

  assert.ok(result.length > 1000000);
});

test("jsonReadableStream - very big object - shallow", async () => {
  const object = {
    name: 'Sebas',
    age: 30,
    address: {
      street: 'Rua das Flores',
      city: 'São Paulo',
      state: 'SP',
      zipCode: 123456
    },
  };

  for (let i = 0; i < 1000; i++) {
    object[`key${i}`] = `value${i}${crypto.randomBytes(1024 * 100).toString('hex')}`;
  }

  const stream = jsonReadableStream(object, { shallow: true });

  let result = '';
  for await (const chunk of stream) {
    result += new TextDecoder().decode(chunk);
  }

  assert.ok(result.length > 1000000);
});


test("jsonReadableStream - very big object - no textdecoder", async () => {
  const object = {
    name: 'Sebas',
    age: 30,
  };

  for (let i = 0; i < 1000; i++) {
    object[`key${i}`] = `value${i}${crypto.randomBytes(1024 * 100).toString('hex')}`;
  }

  const stream = jsonReadableStream(object);

  const result = [];
  for await (const chunk of stream) {
    result.push(chunk)
  }

  assert.ok(result.length > 0);
});

// Only to track the duration in comparison with the stream version
test('json.stringify - very big object', async () => {
  const object = {
    name: 'Sebas',
    age: 30,
    address: {
      street: 'Rua das Flores',
      city: 'São Paulo',
      state: 'SP',
      zipCode: 123456
    },
  };

  for (let i = 0; i < 1000; i++) {
    object[`key${i}`] = `value${i}${crypto.randomBytes(1024 * 100).toString('hex')}`;
  }

  const result = JSON.stringify(object);

  assert.ok(result.length > 1000000);
});
