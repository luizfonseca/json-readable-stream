declare module '@luizfonseca/json-readable-stream' {

  type JsonReadableStreamOptions = {
    shallow?: boolean;
  };

  function jsonReadableStream(inputObject: any, options?: JsonReadableStreamOptions): ReadableStream<Uint8Array>;
  function generateJSONChunks(obj: any): AsyncGenerator<string, void, unknown>;
  function generateShallowJSONChunks(obj: any): AsyncGenerator<string, void, unknown>;

  export { jsonReadableStream, generateJSONChunks, generateShallowJSONChunks };
}