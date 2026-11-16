### Task 7: Image Upload & Avatar Processing

**Files:**
- Create: `src/app/api/upload/route.ts`
- Test: `tests/unit/image-upload.test.ts`

**Interfaces:**
- Consumes: Sharp image processing library.
- Produces: `POST /api/upload` endpoint returning optimized avatar URL.

- [ ] **Step 1: Write tests for image upload security**
  - Verify rejection of non-image MIME types.
  - Verify rejection of files > 2MB.
  - Verify rejection of images exceeding 4000x4000 px dimensions (decompression bomb protection).
  - Verify stripping of EXIF metadata and output conversion to WebP.
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement upload handler with Sharp in `src/app/api/upload/route.ts`**
- [ ] **Step 4: Run tests to verify pass**
- [ ] **Step 5: Commit**
  `git commit -m "feat: implement secure avatar upload and image optimization pipeline"`

---

