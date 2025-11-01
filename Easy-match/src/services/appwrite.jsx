// src/services/appwrite.js
import {
  Client,
  Account,
  Databases,
  Storage,
  ID,
  Query,
  Permission,
  Role
} from "appwrite";

export const Config = {
  endpoint: "https://fra.cloud.appwrite.io/v1",
  projectId: "6900565500379e809a51",
  databaseId: "6901cd7c002ec1d95ca6",
  userCollectionId: "6901cda000116830f234",
  COLLECTION_PURCHASES: "6901ef6b002809a00030",
  COLLECTION_POSTS: "6901e1b90017f45e3bdd",
  photoBucketId: "6901e0a3001b8c8a7eb7",
  APPWRITE_API_KEY: 'standard_820626698353c6bf5d37d1829f22a5e9e6cb57fa918dea10b9bfa81cff514ecbe7ccbbeca84e4109b5dfadad0b6777b77393d2adca4089c548807764006f6fbae7249fa17202dfc330cc1bee836999dc340baac6550d54117a72ad47a0b4826c4bb34c75121ec14d904e79b959b7bb76fca02e31b7306c2967dba69a8ebac8cc',
};

// ✅ Initialize Appwrite Client (NO .setPlatform for web)
const client = new Client()
  .setEndpoint(Config.endpoint)
  .setProject(Config.projectId);

// ✅ Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query, Permission, Role };

// ✅ Create new user + document
export const createUser = async ({ name, email, password, age, location, gender }) => {
  try {
    // 1️⃣ Create account
    const newAccount = await account.create(ID.unique(), email, password, name);

    // 2️⃣ Create session
    await account.createEmailPasswordSession(email, password);

    // 3️⃣ Create profile in database
    const newUserDoc = await databases.createDocument(
      Config.databaseId,
      Config.userCollectionId,
      newAccount.$id, // use same ID as account
      {
        userId: newAccount.$id,
        name,
        email,
        age: parseFloat(age),
        location,
        gender,
        role: "user",
      },
      [
        Permission.read(Role.any()), // public read allowed
        Permission.update(Role.user(newAccount.$id)),
        Permission.delete(Role.user(newAccount.$id)),
      ]
    );

    return { newAccount, newUserDoc };
  } catch (error) {
    console.error("CreateUser Error:", error);
    throw new Error(error.message || "Something went wrong");
  }
};

// ✅ Utility functions
export const getAccount = () => account.get();
export const logout = () => account.deleteSession("current");