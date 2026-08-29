# Project Rules for AI Agents

## Our setup

- pnpm (don't use npm)
- typescript (strict mode)
- Next.js (use App Router for all routing)
- tailwind (don't write inline styles and css)
- wagmi and viem for contract interaction

## General Guidelines

- Always use Tailwind CSS for all styling. Never use custom CSS or inline styles unless absolutely necessary.
- Use React Server Components when possible.
- Don't repeat code. Create reusable components and utility functions.
- Write less comments, only if its necessary.
- Do not over-engineer, write less code as possible.
- If there is a library for it, don't write it yourself and use the library.
- If there is a standard api for it, use standard api and don't write it yourself.
- Use Tailwind for responsive UI (`sm:`, `md:`, `lg:`)
- Centralize constants (like social media links and more) in a typescript file and import and use (Do not repeat urls and configs everywhere)
- You don't need to read all the project files, read only what you need for the task (keep the context window small)
- for contract integration use `src/contracts/contracts.ts` and `get<ContractName>Contract` function and then `read` or `write` objects and do NOT use wagmi generated `useWrite<ContractName><FunctionName>` directly.

## Coding rules

- Create small, focused functions/components that do one thing well.
- We don't like classes, just simply use functions.
- Don't use `interface`, use `type`
- For function syntax don't `function sum(){}` do `const sum=()=>{}`.
- Use composition over inheritance.
- Extract reusable logic into custom hooks `src/hooks/use*.ts`
- Extract reusable UI into components `src/components/*.tsx`
- Extract utility functions into `src/utils/*.ts`
- For user inputs use `src/hooks/useInput.ts` and `src/components/Input/Input.tsx`
- For validation use this `src/utils/validator.ts`
- For modifiers use this `src/utils/modifiers.ts`
- Use `next/image` `<Image />` instead of HTML `<img>` for automatic optimization and lazy loading
- For links don't do onClick and navigator, Do it with standard <Link> component when possible
- Keep numbers `bigint` and convert to `string` by `./src/utils/round-units.ts` only when you need to show something to the user
- Try to not convert `bigint` to `number`, do this only if needed

## Workflow

- **Sync as first step.** Before any task, always run: `git fetch origin dev && git rebase origin/dev` to ensure your feature branch has the latest dev changes. If rebase fails due to conflicts, resolve them immediately.
- **Sync mid-task too.** If your ongoing task takes more than ~10 minutes or spans multiple file edits, run `git fetch origin dev && git rebase origin/dev` again to catch any new dev commits and avoid merge conflicts later.
- Ask question about task before start.
- After you finished the task, simplify your code.
- After you finished the task, find repetitive code and make reusable function for it.
- After you finished the task, run linting and formatting before submitting changes. `pnpm lint --fix` and `pnpm format`

### Branches

- `main` don't touch it!
- `dev` don't commit on it, but always get this branch updates before you start something
- `feat/<something>` this is our naming convention for feature branch

Note: Always pull the `dev` latest changes before starting new work and merge it to your feature branch. Re-sync dev into your feature branch periodically during long-lived tasks.
Note: when ever a feature is done you can make a PR to `dev` (not main)
