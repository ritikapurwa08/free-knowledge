Here is a focused set of changes you can apply, in order, to fix the issues you described.

***

## Library + Resources into one page

You already have:
- `Library` page with subject tabs (English / GK / Reasoning / Maths) and a search bar.[1]
- `ResourcesPage` (“PDF Library”) that lists PDFs with search + subject filter.[1]
- `fetchAllPDFs` that reads from your local Bun fs-server.[1]

**What to do**

1. **Pick one route** (for example `/library`) and make that the combined page.
2. Move the `ResourcesPage` listing logic into the Library layout:
   - At top: keep Library header + subject tabs + search input (already present).[1]
   - For “content”, show:
     - PDFs: use `fetchAllPDFs()` and render cards exactly like `ResourcesPage`.[1]
     - Blog topics (static for now): an array `{ id, title, subject }` rendered as simple cards below PDFs.

3. **Make sure PDFs appear:**
   - Your server lists PDFs from folders created by `uploadPDF` (subject/topic).[1]
   - PDFs you manually put in `public/pdf` will **not** show unless `scripts-fs-server.ts` reads that folder.
   - Update the `list-pdfs` handler so it also scans `public/pdf` and returns those as `PDFResource` objects: `{ id, title, subject, topic, url }`.[1]
   - Point the `url` to `/pdf/<filename>.pdf` or `/public.pdf` depending on where they actually live.[1]

4. Update the “Quick access” card on Home:
   - Keep: `navigate("/learn/resources")` but internally route that to the new unified Library component (or rename route to `/library` and update the navigate call).[1]

***

## Search system for words on Library

You already have word search on Vocabulary page, and search for PDFs on Library/Resources.[1]

On the unified Library page:

- Keep existing `searchQuery` state.[1]
- Filter:
  - PDFs: `pdf.title` or `pdf.topic` includes search query.[1]
  - Blogs: `blog.title` includes search query.
  - Optional: show a “Words” section that links into `VocabularyPage` with the search encoded in URL:
    `navigate("/learn/vocabulary?query=" + encodeURIComponent(searchQuery))`.

This way, typing “tenses” or “noun” will show PDFs/blogs and also give a path to search words.

***

## Category chips (Nouns, Verbs, Tenses) clickable

On Library, you already render topic chips (`All, Nouns, Tenses, Verbs, Idioms`) but they are static.[1]

1. Add state:

```ts
const [selectedChip, setSelectedChip] = useState("All");
```

2. In chip map:

```tsx
["All", "Nouns", "Tenses", "Verbs", "Idioms"].map((chip) => (
  <button
    key={chip}
    onClick={() => setSelectedChip(chip)}
    className={cn(
      "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
      selectedChip === chip
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-white dark:bg-1a2230 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300"
    )}
  >
    {chip}
  </button>
));
```

3. When filtering PDFs/blogs, also check chip:

- If `selectedChip === "All"` → ignore.
- Otherwise, require `topic.toLowerCase().includes(selectedChip.toLowerCase())`.[1]

***

## Ranking system

You already store quiz results and XP:
- `quizResults` table with `score`, `maxScore`.[1]
- `users` table with `totalXp` updated after each quiz via `saveResult`.[1]

To fix ranking:

1. In Convex `users` module, add a query:

```ts
export const leaderboard = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users
      .sort((a, b) => (b.totalXp ?? 0) - (a.totalXp ?? 0))
      .slice(0, 50)
      .map((u, index) => ({
        rank: index + 1,
        name: u.name,
        totalXp: u.totalXp ?? 0,
        imageUrl: u.imageUrl,
      }));
  },
});
```

2. On your `Leaderboard` page, call `useQuery(api.users.leaderboard)` and render a clean list with rank, name, XP.[1]

***

## Profile page: skeletons instead of hard reload

You already have `viewer` query for the current user in Convex.[1]

1. On Profile page:

```ts
const user = useQuery(api.users.viewer);
const isLoading = user === undefined;
```

2. While `isLoading`, render skeletons using your shadcn primitives:

```tsx
{isLoading ? (
  <div className="space-y-3 p-4">
    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
    <div className="h-4 w-32 bg-muted animate-pulse" />
    <div className="h-3 w-40 bg-muted animate-pulse" />
  </div>
) : (
  // real profile card
)}
```

3. Remove manual reloads and depend entirely on `viewer` and `updateUser` to keep data fresh.[1]

***

## Home page progress: show real progress

You already track vocab progress and quiz results.[1]

**Backend**

1. Add a Convex query `userProgress`:

```ts
export const userProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const known = await ctx.db
      .query("vocabProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const knownWordIds = known.filter((p) => p.status === "mastered").map((p) => p.wordId);

    // total words from static JSON sets:
    const totalWords = getTotalWordCount(); // implement by reading your srcX.json bundles.

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const attemptedTests = results.length;
    const totalTests = getTotalQuizCount(); // number of quiz JSON files.

    return {
      knownWords: knownWordIds.length,
      totalWords,
      attemptedTests,
      totalTests,
    };
  },
});
```

**Frontend (Home)**

2. Call `useQuery(api.users.userProgress)` on Home.[1]

3. Render:

```tsx
const progress = useQuery(api.users.userProgress);

const wordPercent =
  progress && progress.totalWords
    ? Math.round((progress.knownWords / progress.totalWords) * 100)
    : 0;

const testPercent =
  progress && progress.totalTests
    ? Math.round((progress.attemptedTests / progress.totalTests) * 100)
    : 0;
```

4. Replace the fake “Course level 1 Beginner” card with a Framer Motion progress card:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white dark:bg-1a2230 rounded-2xl p-4 border border-gray-100 dark:border-gray-800"
>
  <p className="text-xs font-semibold text-primary">Your progress</p>
  <h2 className="mt-1 text-lg font-bold">
    {wordPercent}% words • {testPercent}% quizzes
  </h2>

  <div className="mt-3 space-y-2">
    <div>
      <p className="text-xs text-muted-foreground">
        Words known: {progress?.knownWords ?? 0} / {progress?.totalWords ?? 0}
      </p>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${wordPercent}%` }}
          className="h-full bg-green-500"
        />
      </div>
    </div>

    <div>
      <p className="text-xs text-muted-foreground">
        Tests attempted: {progress?.attemptedTests ?? 0} / {progress?.totalTests ?? 0}
      </p>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${testPercent}%` }}
          className="h-full bg-blue-500"
        />
      </div>
    </div>
  </div>
</motion.div>
```

You already have `framer-motion` installed.[1]

***

## Login page: input focus / keyboard overlap / loading

You have `CustomFormField` and `Input` components.[1]

1. **Focus behaviour:**
   - Ensure email and password fields each have their own `CustomFormField` with `type="email"` and `type="password"`.[1]
   - On mobile, the keyboard covering the input is mostly about layout:
     - Make the login page container `min-h-screen` with `flex flex-col` and `justify-center`, and avoid fixed bottom elements around login.[1]
     - Use `overflow-y-auto` on the main content so the screen can scroll when keyboard is open.

Example:

```tsx
return (
  <div className="min-h-screen flex flex-col bg-background">
    <main className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-card rounded-2xl p-6 shadow-lg">
        {/* form here */}
      </div>
    </main>
  </div>
);
```

2. **Auto-focus email, then password:**

```tsx
const emailRef = useRef<HTMLInputElement | null>(null);
const passwordRef = useRef<HTMLInputElement | null>(null);

useEffect(() => {
  emailRef.current?.focus();
}, []);
```

Pass `ref` into your `Input` via `CustomFormField` by adding a `inputRef` prop and forwarding it to `Input`.[1]

On email `onKeyDown`, if `Enter`, call `passwordRef.current?.focus()`.

3. **Loading state and button:**

Add state:

```ts
const [isLoading, setIsLoading] = useState(false);
```

Wrap submit handler:

```ts
const onSubmit = async (values: LoginFormValues) => {
  try {
    setIsLoading(true);
    await signInWithPassword(values.email, values.password);
    navigate(redirect || "/");
  } catch (err) {
    // set error
  } finally {
    setIsLoading(false);
  }
};
```

Button:

```tsx
<Button type="submit" disabled={isLoading} className="w-full">
  {isLoading && (
    <span className="material-symbols-outlined mr-2 animate-spin">progress_activity</span>
  )}
  {isLoading ? "Logging in..." : "Login"}
</Button>
```

This gives a clear spinner and prevents double submit.[1]

***

If you want, the next step can be:
“Show me exact code for the unified Library component (JSX of that page)” and it can be written directly for your `src/pages/learn/Learn.tsx` or a new `src/pages/library/LibraryPage.tsx`.

[1](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/11467586/396b03cf-1e6d-4d8f-8e85-bd951de49511/free-knowledge.md)
