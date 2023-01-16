import { RemoteError } from "./RemoteError";

describe("RemoteError", () => {
  it("is an error", (done) => {
    const e = new RemoteError({ name: "ExampleError", message: "ExampleMessage" });
    expect(e).toBeInstanceOf(Error);
    done();
  });
  it("has the expected name", (done) => {
    const e = new RemoteError({ name: "ExampleError", message: "ExampleMessage" });
    expect(e.name).toStrictEqual("ExampleError");
    done();
  });
  it("has the expected message", (done) => {
    const e = new RemoteError({ name: "ExampleError", message: "ExampleMessage" });
    expect(e.message).toStrictEqual("ExampleMessage");
    done();
  });
});
