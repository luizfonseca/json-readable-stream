# JSON Readable Stream

Simple utility package to convert any JS object to a JSON ReadableStream. Useful for browser environments, Node.JS, WebAssembly and other environments that support ReadableStream.

## Installation

```bash
npm install @luizfonseca/json-readable-stream
```

## Supported environments

- Node.JS (v18 or higher)
- Browsers (Chrome, Firefox, Safari, Edge, etc.)
- WebAssembly (as long as the environment supports the global `ReadableStream`)

## Usage

```js
import { jsonReadableStream } from '@luizfonseca/json-readable-stream';

const object = {
  name: 'Luiz',
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
  result += new TextDecoder().decode(chunk));
}

console.log(result);
```

Output:

```
{"name":"Luiz","age":30,"address":{"street":"Rua das Flores","city":"São Paulo","state":"SP","zipCode":123456}}
```
