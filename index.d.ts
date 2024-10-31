declare module '@luizfonseca/json-readable-stream' {

  type JsonReadableStreamOptions = {
    shallow?: boolean;
  };

  function JsonReadableStream(options?: JsonReadableStreamOptions): ReadableStream<Uint8Array>;
  function generateJSONChunks(obj: any): AsyncGenerator<string, void, unknown>;
  function generateShallowJSONChunks(obj: any): AsyncGenerator<string, void, unknown>;

  export { JsonReadableStream, generateJSONChunks, generateShallowJSONChunks };
}