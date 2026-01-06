# Supabase Database Setup Guide

This directory contains SQL schema and configuration files for the Care Link Supabase database.

## Files

- **`schema.sql`** - Main database schema with tables, indexes, RLS policies, and functions
- **`seed.sql`** - Sample data and example queries for testing

## Quick Setup

### 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details and wait for setup to complete

### 2. Run the Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the entire contents of `schema.sql`
4. Paste and click "Run"

### 3. Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable Email provider (enabled by default)
3. Optional: Enable other providers (Google, GitHub, etc.)
4. Configure email templates under **Authentication** > **Email Templates**

### 4. Configure Storage (Optional)

For health records file uploads:

1. Go to **Storage**
2. Create a new bucket named `health-records`
3. Make it **Private** (not public)
4. The RLS policies are already defined in the schema

### 5. Get Your Credentials

1. Go to **Settings** > **API**
2. Copy your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon Public Key** (for client-side)
   - **Service Role Key** (for server-side - keep secret!)

## Database Schema

### Tables Overview

#### `profiles`
Extends Supabase auth.users with additional user information:
- Personal details (name, phone, DOB, gender)
- Medical info (blood group, allergies, conditions)
- Emergency contacts
- Preferences

#### `chat_sessions`
Stores chat conversation sessions:
- User reference
- Session type (diagnostic/mental-health)
- Activity timestamps
- Session summary and tags

#### `chat_messages`
Individual messages within chat sessions:
- Role (user/assistant/system)
- Message content
- Token usage tracking
- Model information

#### `medicine_reminders` (Optional)
Medicine reminder system:
- Medicine details and dosage
- Schedule and frequency
- Start/end dates

#### `health_records` (Optional)
Document storage metadata:
- Document type and title
- File URL (stored in Supabase Storage)
- Upload date

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled to ensure users can only access their own data:

- ✅ Users can only view/edit their own profile
- ✅ Users can only access their own chat sessions
- ✅ Users can only see messages from their sessions
- ✅ Users can only manage their own reminders and records

### Automatic Profile Creation

When a user signs up through Supabase Auth, a profile is automatically created via trigger.

## Usage Examples

### JavaScript/TypeScript Integration

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

// Sign up a new user
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
})

// Create a chat session
const { data: session } = await supabase
  .from('chat_sessions')
  .insert({
    session_type: 'diagnostic',
    title: 'Headache consultation'
  })
  .select()
  .single()

// Add a message
await supabase
  .from('chat_messages')
  .insert({
    session_id: session.id,
    role: 'user',
    content: 'I have a headache'
  })

// Get chat history
const { data: history } = await supabase
  .rpc('get_chat_history', {
    p_user_id: user.id,
    p_session_type: 'diagnostic',
    p_limit: 10
  })

// Get full conversation
const { data: messages } = await supabase
  .rpc('get_conversation', {
    p_session_id: session.id
  })
```

## Helper Functions

### `get_chat_history(p_user_id, p_session_type, p_limit, p_offset)`
Get paginated list of chat sessions with message counts.

**Parameters:**
- `p_user_id` - User UUID
- `p_session_type` - 'diagnostic' or 'mental-health' (NULL for all)
- `p_limit` - Number of results (default: 10)
- `p_offset` - Offset for pagination (default: 0)

### `get_conversation(p_session_id)`
Get all messages for a specific chat session.

**Parameters:**
- `p_session_id` - Session UUID

**Security:** Automatically verifies user has access to the session.

## Maintenance

### Backup

Supabase automatically backs up your database. You can also create manual backups:

1. Go to **Database** > **Backups** in Supabase dashboard
2. Click "Create backup"

### Monitoring

Monitor your database usage:
1. Go to **Database** > **Usage**
2. Check table sizes, query performance
3. Set up alerts for quota limits

### Migrations

For schema changes:
1. Create a new migration file
2. Test in development
3. Apply to production via Supabase dashboard

## Environment Variables

Add these to your `.env` file:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Security Best Practices

1. ✅ Never expose service role key in client-side code
2. ✅ Use anon key for client-side operations
3. ✅ RLS policies are your first line of defense
4. ✅ Validate all user inputs
5. ✅ Use prepared statements (Supabase handles this)
6. ✅ Regularly audit RLS policies
7. ✅ Enable 2FA for your Supabase account
8. ✅ Monitor database logs for suspicious activity

## Troubleshooting

### "Permission denied" errors
- Check RLS policies are correctly applied
- Verify user is authenticated
- Ensure user ID matches in policies

### "Table doesn't exist"
- Verify schema.sql ran successfully
- Check for syntax errors in SQL
- Ensure you're connected to the correct project

### Slow queries
- Check indexes are created
- Use EXPLAIN ANALYZE to debug
- Consider adding more indexes for your use case

## Next Steps

1. ✅ Run schema.sql in Supabase
2. ✅ Configure authentication providers
3. ✅ Set up storage buckets
4. ✅ Test with sample data
5. Update your app to use Supabase client
6. Implement authentication in your UI
7. Connect chat interface to database

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [SQL Tutorial](https://supabase.com/docs/guides/database)
