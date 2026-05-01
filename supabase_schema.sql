-- EDURO SCHOLAR SUPABASE SCHEMA
-- This script creates the necessary tables for the Eduro Scholar platform.
-- If you get "already exists" errors, you can either ignore them or use the DROP commands below for a clean slate.

-- OPTIONAL: Uncomment the following lines if you want to reset your database (WARNING: DELETES ALL DATA)
-- DROP TABLE IF EXISTS public.follows CASCADE;
-- DROP TABLE IF EXISTS public.forums CASCADE;
-- DROP TABLE IF EXISTS public.chats CASCADE;
-- DROP TABLE IF EXISTS public.posts CASCADE;
-- DROP TABLE IF EXISTS public.attempts CASCADE;
-- DROP TABLE IF EXISTS public.transactions CASCADE;
-- DROP TABLE IF EXISTS public.questions CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. PROFILES TABLE
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        create table public.profiles (
          id uuid references auth.users on delete cascade primary key,
          email text unique,
          display_name text,
          photo_url text,
          role text default 'student',
          wallet_balance numeric default 0,
          is_verified_teacher boolean default false,
          stats jsonb default '{}'::jsonb,
          monnify_account_number text,
          monnify_bank_name text,
          wallet_id text unique,
          following_count int default 0,
          followers_count int default 0,
          status text,
          stream text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
    END IF;
END $$;

-- 2. QUESTIONS TABLE
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'questions') THEN
        create table public.questions (
          id uuid default gen_random_uuid() primary key,
          text text not null,
          options jsonb not null,
          correct_option int not null,
          category text,
          subject text,
          level text,
          exam_type text,
          reward numeric default 0,
          creator_id uuid references public.profiles(id),
          creator_name text,
          status text default 'pending',
          rejection_reason text,
          usage_count int default 0,
          rating_sum numeric default 0,
          rating_count int default 0,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
    END IF;
END $$;

-- 3. TRANSACTIONS TABLE
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
        create table public.transactions (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.profiles(id) on delete cascade,
          amount numeric not null,
          type text not null, -- 'deposit', 'withdrawal', 'royalty', 'payment'
          status text default 'completed',
          description text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
    END IF;
END $$;

-- 4. ATTEMPTS TABLE (Quiz Results)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'attempts') THEN
        create table public.attempts (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.profiles(id) on delete cascade,
          subject text,
          score numeric,
          total_questions int,
          duration int, -- seconds
          timestamp timestamp with time zone default timezone('utc'::text, now()) not null
        );
    END IF;
END $$;

-- 5. POSTS TABLE (Social)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'posts') THEN
        create table public.posts (
          id uuid default gen_random_uuid() primary key,
          author_id uuid references public.profiles(id) on delete cascade,
          author_name text,
          author_photo text,
          content text,
          image text,
          likes_count int default 0,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
    END IF;
END $$;

-- 6. CHATS TABLE
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chats') THEN
        create table public.chats (
          id uuid default gen_random_uuid() primary key,
          sender_id uuid references public.profiles(id) on delete cascade,
          receiver_id uuid references public.profiles(id) on delete cascade,
          text text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
    END IF;
END $$;

-- 7. FORUMS TABLE (Streams)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'forums') THEN
        create table public.forums (
          id uuid default gen_random_uuid() primary key,
          author_id uuid references public.profiles(id) on delete cascade,
          author_name text,
          stream text default 'General',
          text text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
    END IF;
END $$;

-- 8. FOLLOWS TABLE
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'follows') THEN
        create table public.follows (
          id uuid default gen_random_uuid() primary key,
          follower_id uuid references public.profiles(id) on delete cascade,
          following_id uuid references public.profiles(id) on delete cascade,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          unique(follower_id, following_id)
        );
    END IF;
END $$;

-- ROW LEVEL SECURITY (RLS)
-- Use DO blocks to avoid errors if policies already exist
DO $$ 
BEGIN
    -- Profiles
    alter table public.profiles enable row level security;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone.') THEN
        create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile.') THEN
        create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
    END IF;

    -- Questions
    alter table public.questions enable row level security;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'questions' AND policyname = 'Questions are viewable by everyone.') THEN
        create policy "Questions are viewable by everyone." on public.questions for select using (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'questions' AND policyname = 'Authenticated users can insert questions.') THEN
        create policy "Authenticated users can insert questions." on public.questions for insert with check (auth.role() = 'authenticated');
    END IF;

    -- Posts
    alter table public.posts enable row level security;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Posts are viewable by everyone.') THEN
        create policy "Posts are viewable by everyone." on public.posts for select using (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Authenticated users can insert posts.') THEN
        create policy "Authenticated users can insert posts." on public.posts for insert with check (auth.role() = 'authenticated');
    END IF;
END $$;

