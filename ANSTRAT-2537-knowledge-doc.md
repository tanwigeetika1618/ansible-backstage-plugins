# ANSTRAT-2537: Portal BUI Adoption — Knowledge Guide

> **Audience:** Engineers new to this work (Tanwi, Rakesh)
> **Last updated:** Oct 28, 2026
> **Status:** Kick-off Oct 29, 2026

---

## 1. What is this project about? (The Big Picture)

We're modernizing the **Ansible Self-Service Portal** — a set of frontend plugins that run inside **Red Hat Developer Hub (RHDH)**, which is built on top of **Backstage** (an open-source developer portal framework by Spotify).

The portal lets users browse automation content (job templates, execution environments, collections, git repositories) and launch self-service automation tasks — all from a web UI.

**The problem:** Our frontend code was written using older patterns and libraries. RHDH 2.1+ is adopting a new frontend framework called **BUI (Backstage UI / New Frontend System)**, and our plugins need to align with it or they won't work properly in future RHDH releases.

**Our job:** Migrate the portal's frontend code to use BUI-aligned patterns, reduce custom code, and leverage standard Backstage/RHDH components wherever possible.

---

## 2. What is BUI? (Backstage UI / New Frontend System)

BUI is the **new way** Backstage organizes frontend plugins. Think of it as a building code for plugins.

### Old system vs New system

| Aspect | Old (Legacy) | New (BUI / NFS) |
|---|---|---|
| Plugin entry point | `plugin.ts` with `createPlugin()` | `alpha.tsx` with `createFrontendPlugin()` |
| Pages | `createRoutableExtension()` | `PageBlueprint.make()` |
| APIs | `createApiFactory()` | `ApiBlueprint.make()` |
| Styling | MUI v4 `makeStyles` + `className` | MUI v5 `sx` prop |
| Component library | `@material-ui/core` (MUI v4) | `@mui/material` (MUI v5) |
| Icons | `@material-ui/icons` | `@mui/icons-material` |
| Lab components | `@material-ui/lab` | Promoted into `@mui/material` |
| Theme access | `theme.palette.type` | `theme.palette.mode` |

### The BUI Shell Rule
> "BUI for the shell; Backstage and themed MUI inside loaders."

This means: the plugin's **registration, routing, and sidebar items** must use BUI patterns. But the actual **page content** (what users see) can still use standard Backstage components and MUI — as long as it's MUI v5.

### What's `alpha.tsx`?
Every plugin has (or will have) an `alpha.tsx` file — it's the plugin's "passport" in the BUI world. It declares:
- What pages the plugin provides (via `PageBlueprint`)
- What APIs it offers (via `ApiBlueprint`)
- What sidebar items it shows
- What permissions gate access

Both `alpha.tsx` (new) and `plugin.ts` (old) exist side by side for dual RHDH 1.10/2.1 support. Over time, `plugin.ts` will be removed.

### What's `compatWrapper`?
A bridge component that wraps old MUI v4 components so they render inside the BUI shell. Our migration goal is to **remove** the need for `compatWrapper` by making components BUI-native.

---

## 3. What is ANSTRAT-2537? (Our Jira Epic)

**ANSTRAT-2537** = "Portal BUI Adoption" — the parent Jira item for all our work.

### Goals
1. Migrate all frontend plugins from MUI v4 to MUI v5 ✅ (Phase 1 done)
2. Convert `makeStyles` styling to `sx` prop (Phase 2 in progress)
3. Replace custom components with standard Backstage/RHDH equivalents where possible
4. Reduce custom code percentage (currently ~40-50% custom, target: much lower)
5. Make plugins work natively in the BUI/NFS frontend system
6. Remove `AppThemeFixer` and `compatWrapper` dependencies

### Our Scope (what we DO)
- ✅ Frontend TypeScript/React code migration
- ✅ Figuring out what can be migrated vs must stay custom, with reasoning
- ✅ Updating/adding tests for migrated code
- ✅ Creating Jira epics and tickets
- ✅ SDP (System Design Plan) document
- ✅ Coordinating with UX (Ran) and Docs team

### NOT our scope
- ❌ Backend code changes
- ❌ Designing new UI
- ❌ Building new features
- ❌ ANSTRAT-2497 workspace restructuring (different team)

---

## 4. How does ANSTRAT-2497 relate?

**ANSTRAT-2497** is a **separate but related** effort by the platform team.

| | ANSTRAT-2537 (Us) | ANSTRAT-2497 (Platform Team) |
|---|---|---|
| **What** | BUI adoption — migrate UI code | Plugin architecture restructuring |
| **Focus** | Frontend components, styling, imports | Workspace layout, plugin packages, extension system |
| **Dependency** | We depend on 2497's extension APIs | They don't depend on us |
| **Key deliverables** | MUI v5 migration, custom code reduction | `portal-extension-api`, `portal-extension-host`, `portal-plugin-sdk` packages |

### What ANSTRAT-2497 gives us
- **`@ansible/portal-extension-api`** — APIs for registering tabs, cards, actions across plugins
- **`@ansible/portal-extension-host`** — The host that renders registered extensions
- **`@ansible/portal-plugin-sdk`** — Shared hooks and components any plugin can reuse
- **`@ansible/portal-core`** — Native frontend host and configurable navigation

### The dependency
When we see TypeScript errors like `Cannot find module '@ansible/portal-extension-api'`, that's because ANSTRAT-2497's packages aren't fully linked in our workspace yet. **These are NOT bugs we introduced** — they're workspace wiring issues that will resolve as 2497 progresses.

---

## 5. The Codebase — What Lives Where

### Repository
- **Repo:** `ansible/ansible-backstage-plugins` (GitHub)
- **Our fork:** `tanwigeetika1618/ansible-backstage-plugins`
- **Branch:** `bui/wave1-foundation-mui-v5-migration`

### Plugin Map

| Plugin | Package | What it does |
|---|---|---|
| `portal-scaffolder` | `@ansible/portal-scaffolder` | **Our main target** — Self-service UI (templates, tasks, EEs, collections, git repos) |
| `backstage-rhaap` | `@ansible/plugin-backstage-rhaap` | Ansible sidebar & frontend pages |
| `backstage-rhaap-common` | `@ansible/backstage-rhaap-common` | Shared types, API client, permissions |
| `catalog-backend-module-rhaap` | (backend) | Syncs AAP resources into catalog |
| `scaffolder-backend-module` | (backend) | Custom scaffolder actions |

### File Organization (portal-scaffolder)
```
src/
├── alpha.tsx                    # BUI entry point
├── plugin.ts                    # Legacy entry point
├── routes.ts                    # Route references
├── components/
│   ├── Home/                    # Template catalog home page
│   ├── CreateTask/              # Task creation wizard
│   ├── RunTask/                 # Task execution + monitoring
│   ├── TaskList/                # Task history
│   ├── CatalogItemDetails/      # Template detail page
│   ├── ExecutionEnvironments/   # EE catalog, details, builder
│   ├── CollectionsCatalog/      # Collections browsing
│   ├── GitRepositories/         # Git repo browsing
│   ├── Scaffolder/              # Custom form field extensions
│   │   ├── AAResourcePicker/
│   │   ├── CollectionsPicker/
│   │   ├── ScmSelector/
│   │   └── ... (9 more)
│   ├── SidebarItems/            # Navigation items
│   └── common/                  # Shared small components
└── utils/                       # Utility functions
```

---

## 6. The Migration — Phase by Phase

### Phase 1: Import Path Migration ✅ DONE
**What:** Change every `@material-ui` import to `@mui`

```tsx
// BEFORE (MUI v4)
import { Button, Box } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Alert from '@material-ui/lab/Alert';

// AFTER (MUI v5)
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@mui/material/Alert';  // promoted from lab!
```

**Also fixed MUI v5 breaking changes:**
- `theme.palette.type` → `theme.palette.mode`
- `color="textSecondary"` → `color="text.secondary"`
- `getOptionSelected` → `isOptionEqualToValue` (Autocomplete)
- `getContentAnchorEl` removed (Menu)
- `Skeleton variant="rect"` → `"rectangular"`
- Select onChange type: `ChangeEvent` → `SelectChangeEvent`

**Result:** 64 source files migrated, 0 `@material-ui` imports remain.

### Phase 2: makeStyles → sx prop (IN PROGRESS)
**What:** Convert the old `makeStyles` + `className={classes.X}` pattern to MUI v5's `sx` prop

```tsx
// BEFORE (makeStyles pattern)
const useStyles = makeStyles(theme => ({
  card: {
    padding: theme.spacing(2),
    borderRadius: 8,
  },
}));

function MyComponent() {
  const classes = useStyles();
  return <Card className={classes.card}>...</Card>;
}

// AFTER (sx prop pattern)
const cardSx = (theme: Theme) => ({
  padding: theme.spacing(2),
  borderRadius: '8px',
}) as const;

function MyComponent() {
  return <Card sx={cardSx}>...</Card>;
}
```

**Why this matters:** `makeStyles` is deprecated in MUI v5. The `sx` prop is the native, recommended way. It's also what BUI expects.

### Phase 3: Test File Migration (PLANNED)
- 45 test files still import from `@material-ui`
- Lower priority since test files don't ship to production
- Same mechanical changes as Phase 1

### Phase 4: Journey-Level Migration (FUTURE — needs UX sign-off)
Each "journey" (user workflow) will be reviewed by UX (Ran) who decides per component:
- **Replace** — swap with a standard Backstage/RHDH component
- **Wrap** — keep our component but wrap it in BUI patterns
- **Keep** — leave as custom (with justification)

**Journey migration order:** Collections → EE → Git → Home/Templates → backstage-rhaap

### Phase 5: Custom Code Reduction (FUTURE)
- Replace custom tables/lists with Backstage `<Table>` component
- Replace custom pagination with Backstage pagination
- Move shared styles into `portal-plugin-sdk`
- Remove `AppThemeFixer` and `compatWrapper`

---

## 7. Key Concepts You'll Encounter

### `sx` prop
MUI v5's inline styling system. Like `style={}` but with superpowers:
- Access to theme (`padding: theme.spacing(2)`)
- Responsive breakpoints (`[theme.breakpoints.up('md')]: {...}`)
- Pseudo-selectors (`'&:hover': {...}`)
- Nested selectors (`'& .MuiTab-root': {...}`)

### Theme
A JavaScript object that holds design tokens — colors, spacing, breakpoints, typography. Every MUI component can access it. Key properties:
- `theme.palette.mode` — `'light'` or `'dark'`
- `theme.palette.primary.main` — primary brand color
- `theme.spacing(n)` — consistent spacing (8px units)
- `theme.breakpoints.up('md')` — responsive media query

### `SystemStyleObject<Theme>`
A TypeScript type for style objects that use the `sx` prop. Used when you define styles as constants outside the component.

### Entity
In Backstage, everything is an "Entity" — a job template, an execution environment, a collection, a git repo. They live in the catalog and have metadata (name, namespace, annotations, labels).

### Scaffolder
Backstage's template system. Users fill in a form (defined by a template YAML), and the scaffolder runs actions (create project, launch job, etc.). Our custom form fields (AAPResourcePicker, CollectionsPicker, etc.) are "scaffolder field extensions."

---

## 8. Development Workflow

### Setup
```bash
git clone https://github.com/tanwigeetika1618/ansible-backstage-plugins.git
cd ansible-backstage-plugins
./install-deps                    # Install all dependencies
git checkout bui/wave1-foundation-mui-v5-migration
```

### Useful commands
```bash
# Type check (fast, single plugin)
npx tsc --noEmit -p workspaces/self-service/plugins/portal-scaffolder

# Lint a single file
npx eslint --fix workspaces/self-service/plugins/portal-scaffolder/src/path/to/File.tsx

# Format a file
npx prettier --write workspaces/self-service/plugins/portal-scaffolder/src/path/to/File.tsx

# Run tests for one plugin
yarn workspace @ansible/portal-scaffolder test --watch=false

# Start dev server (if you want to visually test)
yarn start
```

### Git workflow
```bash
# Always push to fork, NEVER to upstream
git push myfork bui/wave1-foundation-mui-v5-migration

# Don't open PRs on upstream until work is reviewed
# PR on upstream = visible to entire team immediately
```

---

## 9. Team & Contacts

| Person | Role | Timezone |
|---|---|---|
| **Tanwi** | SE, Pod Lead for 2537 | India |
| **Rakesh** | ASE, assigned to 2537 | India |
| **Brad Thornton** | Sr PSE, technical guide | US |
| **Nilashish Chakraborty** | PSE, architect | India |
| **Craig Brandt** | PM | Ireland |
| **Ran Elimelech** | UX, component disposition | — |

---

## 10. Reference Links

- **BUI Architecture Doc:** [PR #894 on ansible-rhdh-plugins](https://github.com/ansible/ansible-rhdh-plugins/pull/894)
- **Portal UI Audit Doc:** [Google Doc](https://docs.google.com/document/d/1uZBFd7jxC6wnzXciEPlI-FZcFQEKp6hHsrSHhNeDFuo/edit)
- **Engineering Gist:** [Nilashish's Gist](https://gist.github.com/NilashishC/26eceae06190acc9fc1a8a10e085df22)
- **BUI Routing PR:** [PR #744](https://github.com/ansible/ansible-backstage-plugins/pull/744)
- **MUI v4→v5 Migration Guide:** [MUI Official](https://mui.com/material-ui/migration/migration-v4/)
- **Backstage New Frontend System:** [Backstage Docs](https://backstage.io/docs/frontend-system/)

---

## 11. Glossary

| Term | Meaning |
|---|---|
| **AAP** | Ansible Automation Platform — the backend our portal talks to |
| **RHDH** | Red Hat Developer Hub — the product that runs Backstage + our plugins |
| **BUI / NFS** | Backstage UI / New Frontend System — the new plugin architecture |
| **MUI** | Material UI — the React component library (v4 = old, v5 = current) |
| **`makeStyles`** | Old MUI v4 way to define CSS-in-JS styles (deprecated) |
| **`sx` prop** | New MUI v5 way to apply styles inline with theme access |
| **Scaffolder** | Backstage's template execution system |
| **Entity** | Any item in the Backstage catalog (template, EE, collection, repo) |
| **PAH** | Private Automation Hub — hosts collections and EEs |
| **EE** | Execution Environment — container image for running Ansible |
| **`compatWrapper`** | Bridge component for old plugins in new BUI shell (we want to remove it) |
| **`alpha.tsx`** | BUI entry point file for a plugin |
| **Blueprint** | BUI concept — a declarative definition of a page, API, or sidebar item |
