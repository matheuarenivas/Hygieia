# Welcome to Hygieia 👋

# Hygieia

A health and fitness app built with React Native and Supabase.

## Environment Setup & Security

This project uses environment variables for sensitive configuration. To set up:

1. Copy `.env.example` to `.env`
2. Fill in your actual API keys and credentials
3. NEVER commit the `.env` file to Git

### Security Guidelines

- ⚠️ Never commit API keys or secrets to the repository
- ⚠️ Always use environment variables for sensitive data
- ✅ Use Row Level Security on all Supabase tables
- ✅ Ensure your Supabase project has proper security settings

### Development Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Set up the required tables (see below for schema)
3. Configure environment variables as described above
4. Run the development server with `npm start` or `yarn start`

## Database Schema

```sql
-- Add your schema here
```
```

## Step 8: Delete the Existing key.env File

After ensuring your keys are properly stored in the new `.env` file:

```bash
# Delete the old key.env file
rm hygieia/key.env
```

## Step 9: Add eas.json for Production Builds

1. Create a file called `eas.json` in the root of your project:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "preview"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

## IMPORTANT: Rotate Your Supabase Key

Since your current key was exposed in a file, you should rotate it:

1. Go to https://app.supabase.com/
2. Select your project
3. Go to Project Settings → API
4. Click "Rotate API Keys" for your anon/public key
5. Update your new `.env` file with the new key

By following these specific instructions, you'll properly secure your sensitive credentials and ensure your project follows security best practices.