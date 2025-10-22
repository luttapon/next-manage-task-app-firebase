// app/lib/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

// อ่านค่าจาก Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ตรวจสอบว่ามีค่าอยู่จริง
if (typeof supabaseUrl !== 'string' || !supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL. Please check your .env.local file.');
}
if (typeof supabaseAnonKey !== 'string' || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your .env.local file.');
}

// ถ้าผ่านการตรวจสอบถึงจะเรียกใช้งาน createClient
export const supabase = createClient(supabaseUrl, supabaseAnonKey);