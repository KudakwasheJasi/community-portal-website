# TODO: Fix Register Test Failures

## Steps to Complete
- [x] Update register.test.tsx to use screen.getByTestId('password-input') for password input queries
- [x] Update register.test.tsx to use screen.getByTestId('confirm-password-input') for confirm password input queries
- [x] Remove conditional checks for getByTestId in the 'calls register function with correct data' test
- [x] Install @types/jest-dom to resolve TypeScript errors
- [x] Run tests to verify fixes
