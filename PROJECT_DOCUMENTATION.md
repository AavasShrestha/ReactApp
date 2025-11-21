## Document Management Frontend – Documentation

This document summarizes the app’s architecture, key modules, environment configuration, and recent work completed (yesterday and today), including new features and their user-facing behavior.

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- lucide-react (icons)

## Environment Configuration
Set via Vite `import.meta.env` variables (see `env.example`):
- `VITE_API_BASE_URL`: Base URL for all API calls. Defaults to `http://localhost:5114`.
- `VITE_API_UPLOAD_PATH`: Path for upload endpoint. Defaults to `/api/Document/upload`.
- `VITE_UPLOAD_FILE_FIELD`, `VITE_UPLOAD_CLIENTID_FIELD`, `VITE_UPLOAD_TYPE_FIELD`: Optional, used for error messages to reflect backend field names.

## Data Types
`src/types/index.ts`
- `Document` shape (normalized in the frontend):
  - `id: string`
  - `fileName: string`
  - `documentType?: string`
  - `uploadedDate: string` (ISO string)
  - `fileSize?: number`

## Services
`src/services/api.ts`

- Axios instance with
  - Base URL from `VITE_API_BASE_URL`
  - Request interceptor adds JWT `Authorization` and `Tenant-ID` (from `tokenStorage`)
  - Response interceptor normalizes errors and auto-logs out on 401

- `authApi.login(credentials)`
  - POST `/api/Login/userauthentication`
  - Persists token and tenant id on success

- `documentApi.getDocuments(clientId?)`
  - GET `/api/Document` (optionally `?clientId=...`)
  - Normalizes casing/field names from backend to the `Document` type

- `documentApi.uploadDocument(files, { clientId?, documentType? })`
  - POST multipart to `VITE_API_UPLOAD_PATH` (default `/api/Document/upload`)
  - Lets the browser set multipart boundary automatically

- `documentApi.deleteDocument(documentId)`
  - DELETE `/api/Document/{documentId}`
  - Added today to support new delete feature

- `documentApi.getDocumentUrl(fileName)`
  - Returns `${BASE_URL}/UploadedFiles/{fileName}` for direct file access

## Core Screens and Components

### Documents Page
`src/components/DocumentsPage.tsx`
- Reads `clientId` from query string using `useSearchParams`
- Loads documents via `documentApi.getDocuments(clientId?)`
- Upload controls:
  - Select multiple files
  - Enter `clientId` if not in URL
  - Optional `documentType` (falls back to file extension)
  - Robust error feedback including HTTP 400/405 messaging
- Search and filter:
  - Free-text search by `fileName`
  - Expandable filter by `documentType`
  - Clear all filters
- State/badges:
  - Loading spinner, error block with retry, refresh button
- Delete handling:
  - Receives per-item delete callback and removes deleted document from local state

### Document List
`src/components/DocumentList.tsx`
- Accepts `documents`, `searchTerm`, `filterType`, `onDelete`
- Filters documents by `fileName` and `documentType`
- Renders empty-state messaging when no matches
- Passes `onDelete` through to each `DocumentItem`

### Document Item
`src/components/DocumentItem.tsx`
- Displays key metadata: name, type, uploaded date, file size
- Preview support (modal):
  - Inline preview for `pdf` and image formats
  - Fallback messaging + “Download instead” when preview fails
- Download support:
  - Fetches blob with Axios and saves with a temporary anchor
- Image thumbnails (new):
  - For image types (`jpg`, `jpeg`, `png`, `gif`, `bmp`, `webp`) the file icon shows a 40x40 rounded inline thumbnail instead of a generic icon
- Delete support (new):
  - Red “Delete” action with confirmation modal (non-blocking UI)
  - Loading state during deletion
  - Invokes `documentApi.deleteDocument(id)` and notifies parent via `onDelete(id)`

## Authentication Context
`src/contexts/AuthContext.tsx`, `src/utils/auth.ts`
- Stores and retrieves JWT and tenant id
- Automatically attached to each request via Axios interceptor

## Recent Work (Yesterday and Today)

### Today
- Add end-to-end Delete feature
  - API: `documentApi.deleteDocument(documentId)`
  - UI: Delete button on each `DocumentItem`
  - Confirmation modal with clear warnings and loading state
  - Parent state updates: `DocumentsPage` removes item from the list on success

- Add image thumbnails in the document list
  - For common image types, the file icon is replaced with a small preview thumbnail
  - On image load error, the thumbnail hides gracefully

### Yesterday
- Document retrieval and listing
  - Fetch documents with optional `clientId` filter from URL
  - Normalization of backend payload fields to a stable `Document` shape

- Upload workflow
  - Multiple file selection
  - Optional `documentType` (falls back to detected extension)
  - Client ID taken from query or input field
  - Improved error handling and messaging for common HTTP errors (400/405)

- Search and filter UI
  - Free-text search on `fileName`
  - Expandable filter panel with `documentType` dropdown derived from current data

- General UX improvements
  - Refresh button with spinner
  - Loading and error states with retry
  - Consistent Tailwind-based styling

## How the Delete Feature Works (Flow)
1. User clicks Delete on a `DocumentItem` → confirmation modal opens.
2. On confirm, the component calls `documentApi.deleteDocument(doc.id)`.
3. On success, `onDelete(doc.id)` notifies the `DocumentsPage`.
4. `DocumentsPage` removes the item from state so the UI updates immediately.
5. Any errors are caught; the UI shows a safe non-blocking state (ready for toast integration if desired).

## How Image Thumbnails Work
1. `DocumentItem.getFileIcon` detects image extensions.
2. For images, it renders a 40x40 rounded `img` using `documentApi.getDocumentUrl(fileName)`.
3. On error, the thumbnail is hidden to avoid broken images.

## Future Enhancements (Optional)
- Toast notifications for delete/upload errors and successes
- Pagination and server-side filtering/sorting
- Inline rename and tagging
- Drag-and-drop upload with progress per file
- Role-based access checks for destructive actions


