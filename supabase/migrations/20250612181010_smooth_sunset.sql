/*
  # Fix Tasks Table RLS and Structure

  1. Database Structure
    - Keep existing identity column for tasks.id (no changes needed)
    - Ensure user_id column has proper default value
    
  2. Security
    - Clean up existing RLS policies to avoid conflicts
    - Create comprehensive RLS policies for authenticated users
    - Enable RLS on tasks table
    
  3. Changes
    - Remove conflicting RLS policies
    - Add clean, simple policies for CRUD operations
    - Set proper default for user_id column
*/

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
DROP POLICY IF EXISTS "Users can read their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

-- Ensure the user_id column has a proper default (only if it doesn't already have one)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'user_id' 
    AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE tasks ALTER COLUMN user_id SET DEFAULT auth.uid();
  END IF;
END $$;

-- Make sure RLS is enabled
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

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