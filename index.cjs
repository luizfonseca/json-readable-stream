const char = {
  BRACKET_R: "]",
  BRACKET_L: "[",
  BRACE_R: "}",
  BRACE_L: "{",
  COMMA: ",",
  COLON: ":"
};


/**
* @typedef {Object} JSONReadableStreamOptions
* @property {boolean} [shallow=false] Generate shallow JSON chunks (doesn't chunk nested objects)
*/

/**
* Converts any JS object to a JSON-compatible ReadableStream
* @param {any} object
* @param {JSONReadableStreamOptions} options
* @return {ReadableStream<Uint8Array>} stream
*/
function jsonReadableStream(inputObject, options = {}) {
  const generatorFn = options.shallow ? generateShallowJSONChunks : generateJSONChunks;

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of generatorFn(inputObject)) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }

      controller.close();
    }
  });
}


/**
* Generates a chunk of JSON data from a JS object
* Each chunk delimited to the key-value pair of the object and
* each nested object is chunked as well
* @param {any} value
*/
async function* generateJSONChunks(value) {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      yield char.BRACKET_L;
      for (let i = 0; i < value.length; i++) {
        yield* generateJSONChunks(value[i]);  // Recursive call for array elements
        if (i < value.length - 1) yield char.COMMA;  // Add commas between items
      }
      yield char.BRACKET_R;
    } else {
      yield char.BRACE_L;
      const entries = Object.entries(value);
      for (let i = 0; i < entries.length; i++) {
        const [key, nestedValue] = entries[i];
        yield `"${key}"${char.COLON}`;
        yield* generateJSONChunks(nestedValue); // Recursive call for nested objects
        if (i < entries.length - 1) yield char.COMMA;
      }
      yield char.BRACE_R;
    }
  } else {
    // Base case: value is not an object/array, so serialize directly
    yield JSON.stringify(value);
  }
}


/**
* Generates a chunk of JSON data from a JS object
* Each chunk delimited to the key-value pair of the object.
* Doesn't chunk nested objects or arrays (not as memory-efficient)
* @param {any} obj
*/
async function* generateShallowJSONChunks(obj) {
  // Using a shallow traversal to yield JSON chunks
  yield char.BRACE_L;
  const entries = Object.entries(obj);
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    yield `"${key}":${JSON.stringify(value)}`;
    if (i < entries.length - 1) yield char.COMMA;
  }
  yield char.BRACE_R;
}

exports.jsonReadableStream = jsonReadableStream;
exports.generateJSONChunks = generateJSONChunks;
exports.generateShallowJSONChunks = generateShallowJSONChunks;
