/*
  # Fix tasks table structure and RLS policies

  1. Table Changes
    - Add auto-increment to tasks.id column (make it SERIAL/BIGSERIAL)
    - Ensure proper default values for required fields
    
  2. Security Updates
    - Clean up duplicate RLS policies
    - Ensure proper policies for authenticated users
    - Add policies that work with the current authentication setup

  3. Notes
    - The tasks table currently has a bigint id without auto-increment
    - Multiple conflicting RLS policies need to be consolidated
    - Need to ensure user_id is properly set for new tasks
*/

-- First, let's fix the tasks table structure
-- Make the id column auto-incrementing
DO $$
BEGIN
  -- Check if the id column is already a sequence
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'id' 
    AND column_default LIKE 'nextval%'
  ) THEN
    -- Create a sequence for the tasks id
    CREATE SEQUENCE IF NOT EXISTS tasks_id_seq;
    
    -- Set the id column to use the sequence
    ALTER TABLE tasks ALTER COLUMN id SET DEFAULT nextval('tasks_id_seq');
    
    -- Set the sequence ownership
    ALTER SEQUENCE tasks_id_seq OWNED BY tasks.id;
    
    -- Set the current value of the sequence to be higher than existing ids
    PERFORM setval('tasks_id_seq', COALESCE((SELECT MAX(id) FROM tasks), 0) + 1);
  END IF;
END $$;

-- Clean up existing RLS policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated insert" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated read" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated update" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to delete tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to delete their tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to insert tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to select tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to select their tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to update tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to update their tasks" ON tasks;
DROP POLICY IF EXISTS "Allow fallback or authenticated insert" ON tasks;
DROP POLICY IF EXISTS "Allow fallback user to insert tasks" ON tasks;
DROP POLICY IF EXISTS "Authenticated users can insert" ON tasks;

-- Create clean, simple RLS policies
CREATE POLICY "Users can read their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Ensure the user_id column has a proper default
ALTER TABLE tasks ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Make sure RLS is enabled
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;