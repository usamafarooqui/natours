const fs = require("fs");
// how to increase thread box size
const crypto = require("crypto"); // for heavy task

// to calculate time

const start = Date.now();

// by defaut size is four but we can set it to 128
process.env.UV_THREADPOOL_SIZE = 1;

setTimeout(() => {
  console.log("pehlay time out se bol raha hun");
}, 0);

setImmediate(() => console.log("pehlay imdeiat se bol raha hun"));

fs.readFile("test-file.txt", () => {
  console.log("file parh li");
  console.log("-------------------------------------------");

  setTimeout(() => {
    console.log("dusre time out se bol raha hun");
  }, 3000);

  setImmediate(() => console.log("dusre imdeiat se bol raha hun"));

  process.nextTick(() => console.log("koi process hoga"));

  // sync se event loop block hoajeyga
  crypto.pbkdf2Sync("password", "salt", 10000, 1024, "sha512");
  console.log(Date.now() - start, "password encrypted");

  crypto.pbkdf2Sync("password", "salt", 10000, 1024, "sha512");
  console.log(Date.now() - start, "password encrypted");

  crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password without sync wala encrypted");
  });

  crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password without sync wala encrypted");
  });
  crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password without sync wala encrypted");
  });
});

console.log("top level code");
