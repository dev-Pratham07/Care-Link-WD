-- Seed Data for Care Link Database
-- This file contains sample data for testing (DO NOT USE IN PRODUCTION)

-- Note: This assumes you have test users created in Supabase Auth
-- Replace the UUIDs with actual user IDs from your Supabase auth.users table

-- ============================================================================
-- SAMPLE DATA (for development/testing only)
-- ============================================================================

-- Insert sample profiles (only if they don't exist)
-- You'll need to replace these UUIDs with real ones from auth.users
/*
INSERT INTO public.profiles (
  id, 
  email, 
  full_name, 
  phone_number,
  gender,
  blood_group
) VALUES
(
  'YOUR_USER_UUID_HERE',
  'test@example.com',
  'Test User',
  '+1234567890',
  'male',
  'O+'
)
ON CONFLICT (id) DO NOTHING;
*/

-- ============================================================================
-- EXAMPLE QUERIES
-- ============================================================================

-- Get all chat sessions for a user
-- SELECT * FROM public.chat_sessions WHERE user_id = 'YOUR_USER_UUID';

-- Get messages for a specific session
-- SELECT * FROM public.chat_messages WHERE session_id = 'SESSION_UUID' ORDER BY created_at;

-- Get chat history with message count
-- SELECT * FROM public.get_chat_history('YOUR_USER_UUID', NULL, 10, 0);

-- Create a new chat session
/*
INSERT INTO public.chat_sessions (user_id, session_type, title)
VALUES ('YOUR_USER_UUID', 'diagnostic', 'Headache consultation')
RETURNING id;
*/

-- Add messages to a session
/*
INSERT INTO public.chat_messages (session_id, role, content)
VALUES 
  ('SESSION_UUID', 'user', 'I have a headache'),
  ('SESSION_UUID', 'assistant', 'I understand you have a headache. Can you tell me more about it?');
*/

-- Get full conversation
-- SELECT * FROM public.get_conversation('SESSION_UUID');

-- ============================================================================
-- CLEANUP (for testing)
-- ============================================================================

-- Delete all messages for a session
-- DELETE FROM public.chat_messages WHERE session_id = 'SESSION_UUID';

-- Delete a chat session (will cascade delete messages)
-- DELETE FROM public.chat_sessions WHERE id = 'SESSION_UUID';

-- Reset all data (DANGEROUS - only for development)
/*
TRUNCATE TABLE public.chat_messages CASCADE;
TRUNCATE TABLE public.chat_sessions CASCADE;
TRUNCATE TABLE public.medicine_reminders CASCADE;
TRUNCATE TABLE public.health_records CASCADE;
-- Note: Don't truncate profiles as it's linked to auth.users
*/
