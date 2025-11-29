# Community Portal - Connect Client and Backend

## Completed Tasks
- [x] Enable CORS in Backend/src/main.ts to allow requests from Next.js client
- [x] Change backend port to 5000 to match client's API_URL
- [x] Update client/src/services/api.ts to match backend endpoints:
  - Auth: register, login, profile
  - Users: get all users
  - Posts: get all, get one, create with file upload
  - Events: get all, register for event
- [x] Add type annotations to fix TypeScript errors in api.ts
- [x] Verify events controller has register endpoint (already exists)

## Next Steps
- [ ] Start the backend server
- [ ] Start the client server
- [ ] Test API connections (register, login, get posts, etc.)
- [ ] Fix any connection issues
- [ ] Update client components to use the new API functions
- [ ] Test full user flow: register -> login -> view dashboard -> create post -> register for event

## Notes
- Backend runs on port 5000
- Client expects API at http://localhost:5000
- CORS enabled for http://localhost:3000 (Next.js dev server)
- JWT authentication implemented
- File upload supported for posts
