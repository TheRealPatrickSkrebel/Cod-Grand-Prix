import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojawistvkfybzgfbwygq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qYXdpc3R2a2Z5YnpnZmJ3eWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNjE2NDEsImV4cCI6MjA1NzgzNzY0MX0.IbOQlALHeBEe5AO8T3rk5n4h-8xslIX7HkOnsvGk6TM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;