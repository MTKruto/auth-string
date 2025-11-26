import { Client } from "@mtkruto/mtkruto";
import { findApiCredentials } from "./find_api_credentials.ts";
import { isApiHashValid } from "./is_api_hash_valid.ts";

let apiId: number | null = null;
let apiHash: string | null = null;

const apiCredentials = findApiCredentials();
if (apiCredentials !== null) {
  console.log(`${apiCredentials.apiId.envVar}=${apiCredentials.apiId.value}`);
  console.log(
    `${apiCredentials.apiHash.envVar}=${apiCredentials.apiHash.value}`,
  );
  console.log();
  if (
    !prompt(
      "The above credentials were found in your environment.\nDo you want to use them? [Y/n]",
    )?.toLowerCase().startsWith("n")
  ) {
    apiId = apiCredentials.apiId.value;
    apiHash = apiCredentials.apiHash.value;
  } else {
    console.log();
  }
}

if (apiId === null || apiHash === null) {
  console.log(
    "API credentials can be obtained from <https://my.telegram.org/apps/>.",
  );
}

while (apiId === null || apiId < 0) {
  const result = prompt("Enter API ID:");
  if (result !== null) {
    apiId = parseInt(result);
  }
}

while (!apiHash || !isApiHashValid(apiHash)) {
  const result = prompt("Enter API hash:");
  if (result !== null) {
    apiHash = result;
  }
}

const client = new Client({
  apiId,
  apiHash,
});

console.log();
try {
  await client.connect();
  console.log("Connected to Telegram.");
} catch (err) {
  console.log("Failed to connect to Telegram:", err);
}

try {
  await client.signIn();
} catch (err) {
  console.log();
  console.log("Failed to sign in:", err);
}

const authString = await client.exportAuthString();

console.log();
console.log("The auth string for the current session is:");
console.log(authString);
console.log();
await client.disconnect();
