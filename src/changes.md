
# Changes Log

## Iframe Processing Restructuring

### Files Reorganized:
1. Moved iframe utilities from `/utils/iframe-utils.ts` to `/components/quiz/custom-games/utils/iframe-utils.ts`
2. Updated imports in related files to point to new location
3. Simplified iframe processing structure

### Main Changes:
- Centralized iframe processing in custom games module
- Maintained same functionality but improved organization
- Updated all related import paths
- Fixed duplicate export issues in iframe-utils.ts
- Corrected import paths in:
  - src/app/iframe-demo/page.tsx
  - src/pages/IframeDemo.tsx
  - src/components/quiz/components/GameContainer.tsx

### Details:
- Changed imports from `@/utils/iframe-utils` to `@/components/quiz/custom-games/utils/iframe-utils`
- Removed duplicate export declarations in iframe-utils.ts
- Removed old file from utils directory
