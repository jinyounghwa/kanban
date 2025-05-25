export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Board {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  name: string;
  board_id: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  column_id: string;
  label_color?: string;
  assignee_id?: string;
  position: number;
  created_at: string;
  updated_at: string;
}
