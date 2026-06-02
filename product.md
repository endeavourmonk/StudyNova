# StudyNova - Product Requirements Document (PRD)

## Overview

**StudyNova** is an AI-powered study notes platform that helps students generate structured learning material from any topic in seconds.

Instead of manually creating notes, students can enter a topic and instantly receive high-quality AI-generated notes organized into a consistent study format. Students can then edit, manage, search, and test themselves using AI-generated quizzes.

The goal is to provide the fastest path from:

**Topic → Structured Notes → Self Assessment**

---

# Problem Statement

Students spend excessive time:

- Creating notes manually
- Organizing study material
- Summarizing concepts
- Creating revision resources
- Testing their understanding

Existing note-taking tools focus on storage rather than learning.

StudyNova focuses on AI-assisted knowledge generation and revision.

---

# MVP Goals

### Primary Goal

Allow students to generate high-quality study notes from a topic using AI.

### Secondary Goals

- Organize notes by subject
- Manage notes efficiently
- Generate quizzes from notes
- Provide a modern and intuitive user experience

---

# Target Users

### Students

- College students
- Engineering students
- Placement preparation candidates
- Self-learners
- Certification learners

---

# Core User Journey

1. User signs up
2. User creates a subject
3. User enters a topic
4. AI generates structured notes
5. Notes are saved automatically
6. User edits notes if needed
7. User generates quiz
8. User attempts quiz
9. Dashboard tracks activity

---

# MVP Features

## P0 - Authentication

### Requirements

- Email + Password Authentication
- Secure password hashing
- Session-based authentication
- Protected routes

### Tech

- Auth.js
- Credentials Provider

---

# P0 - Subject Management

Subjects act as organizational containers.

Examples:

- DBMS
- Operating Systems
- React
- Node.js
- Data Structures

### CRUD Operations

#### Create Subject

Fields:

- name

#### Read Subjects

Display all user subjects.

#### Update Subject

Rename subject.

#### Delete Subject

Delete subject and associated notes.

---

# P0 - AI Note Generation

## Core Feature

### Input

- Subject
- Topic

Example:

Subject: DBMS

Topic: Normalization

### AI Output Structure

The generated note MUST always follow this structure:

# Title

## Overview

Brief explanation of the topic.

## Key Concepts

Important concepts and definitions.

## Detailed Explanation

In-depth breakdown of concepts.

## Real World Examples

Practical applications and examples.

## Interview / Exam Questions

5 relevant questions.

## Summary

Concise bullet-point revision notes.

---

## User Actions

### Generate Note

One-click note generation.

### Save Note

Automatically save generated note.

### Regenerate Note

Optional future enhancement.

---

# P0 - Notes Management

## Create Note

AI-generated notes are created automatically.

Optional manual creation allowed.

---

## Read Notes

View:

- All Notes
- Notes by Subject

---

## Search Notes

Search across:

- Title
- Topic
- Content

---

## Update Notes

Editable fields:

- Title
- Content

---

## Delete Notes

Permanent deletion.

---

# P0 - AI Quiz Generation

Generate quiz from an existing note.

### Input

Selected Note

### Output

5-8 MCQs

Structure:

- Question
- 4 Options
- Correct Answer

---

## Quiz Attempt

User can:

- Select answers
- Submit quiz

### Result

Display:

- Score
- Correct Answers
- Incorrect Answers

---

# P0 - Dashboard

### Statistics

Display:

- Total Subjects
- Total Notes
- Total Quizzes

### Recent Activity

Show:

- Recently Generated Notes
- Recently Updated Notes

### Quick Actions

Buttons:

- New Subject
- Generate Note

---

# Nice To Have (Only If Time Permits)

## Dark Mode

Theme switching.

---

## Export Notes

Export as:

- Markdown
- PDF

---

## Tags

Simple note tags.

Examples:

- Interview
- Revision
- Important

---

# Explicitly Out of Scope

Do NOT implement:

- Flashcards
- Spaced Repetition
- PDF Upload
- YouTube Processing
- File Parsing
- OCR
- RAG
- Vector Databases
- Semantic Search
- Chat With Notes
- Collaboration
- Sharing
- Teacher Dashboard
- Admin Dashboard
- Notifications
- Learning Planner
- Calendar Features
- Version History

---

# Functional Requirements

## Authentication

User must only access their own data.

---

## Authorization

Every Subject, Note, and Quiz must belong to a specific user.

Users cannot access other users' resources.

---

## Validation

Validate:

- Subject Name
- Topic Input
- Note Content

Using Zod schemas.

---

# Non Functional Requirements

## Performance

- Initial page load under 3 seconds
- Optimized server components
- Streaming AI responses if possible

---

## Security

- Password hashing using bcrypt
- Input validation
- Protected API routes
- ORM-based database access

---

## Accessibility

- Keyboard navigation
- Semantic HTML
- Responsive design

---

# Recommended Tech Stack

## Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

- Next.js Route Handlers
- Server Actions

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- Auth.js

## AI

- Gemini 2.5 Flash
- Vercel AI SDK

## Validation

- Zod

## Deployment

- Vercel
- Neon PostgreSQL

---

# Database Schema

## User

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())

  subjects  Subject[]
  notes     Note[]
}
```

## Subject

```prisma
model Subject {
  id        String   @id @default(cuid())
  name      String
  userId    String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  notes     Note[]
}
```

## Note

```prisma
model Note {
  id          String   @id @default(cuid())
  title       String
  topic       String
  content     String   @db.Text
  subjectId   String
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  subject      Subject @relation(fields: [subjectId], references: [id])
  user         User @relation(fields: [userId], references: [id])
  quizzes      Quiz[]
}
```

## Quiz

```prisma
model Quiz {
  id            String   @id @default(cuid())
  noteId        String
  questionsJson Json
  createdAt     DateTime @default(now())

  note          Note @relation(fields: [noteId], references: [id])
}
```

---

# Page Structure

```text
/
├── login
├── register

/dashboard
├── overview
├── subjects
├── notes
├── notes/[id]
├── quiz/[id]
```

---

# Success Criteria

A user can:

- Register and login
- Create subjects
- Generate AI-powered notes
- Edit notes
- Search notes
- Generate quizzes
- Attempt quizzes
- View learning statistics

The application should feel like a production-ready EdTech SaaS product rather than a CRUD assignment.
