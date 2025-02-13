// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
// import { config } from "dotenv";
// import * as schema from "./schema";

// config({ path: ".env" });

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle({ client: sql, schema });


// import { drizzle } from 'drizzle-orm/neon-http';
// import { neon } from '@neondatabase/serverless';
// import { config } from 'dotenv';
// import * as schema from './schema';

// config({ path: '.env' });

// // Check if we have a database URL
// if (!process.env.DATABASE_URL) {
//     throw new Error('DATABASE_URL is not set in environment variables');
// }

// const sql = neon(process.env.DATABASE_URL);
// export const db = drizzle({ client: sql, schema });

// // Optional: Add a simple test function
// export async function testConnection() {
//     try {
//         // Attempt a simple query
//         const result = await sql`SELECT NOW()`;
//         console.log('Database connection successful:', result);
//         return true;
//     } catch (error) {
//         console.error('Database connection failed:', error);
//         return false;
//     }
// }

// import { drizzle } from 'drizzle-orm/neon-http';
// import { neon } from '@neondatabase/serverless';
// import { config } from 'dotenv';
// import * as schema from './schema';

// config({ path: '.env' });

// // Check if we have a database URL
// if (!process.env.DATABASE_URL) {
//     throw new Error('DATABASE_URL is not set in environment variables');
// }

// const sql = neon(process.env.DATABASE_URL);
// export const db = drizzle(sql, { schema });

// // Optional: Add a simple test function
// export async function testConnection() {
//     try {
//         // Attempt a simple query
//         const result = await sql`SELECT NOW()`;
//         console.log('Database connection successful:', result);
//         return true;
//     } catch (error) {
//         console.error('Database connection failed:', error);
//         return false;
//     }
// }

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as schema from './schema';

config({ path: '.env' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in environment variables');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export async function testConnection() {
    try {
        const result = await sql`SELECT NOW()`;
        console.log('Database connection successful:', result);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}