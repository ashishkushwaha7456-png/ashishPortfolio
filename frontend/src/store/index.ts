import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  type TypedUseSelectorHook,
} from "react-redux";

/**
 * Redux is used deliberately narrowly: only UI state that several unrelated
 * parts of the tree read and write. Server data lives in React Query, and
 * anything local to one subtree stays in `useState`.
 */

/* ── UI slice ─────────────────────────────────────────────── */
interface UIState {
  commandOpen: boolean;
  mobileNavOpen: boolean;
  cursorVariant: "default" | "hover" | "text" | "view" | "hidden";
  cursorLabel: string;
  introPlayed: boolean;
  lightboxIndex: number | null;
}

const initialUI: UIState = {
  commandOpen: false,
  mobileNavOpen: false,
  cursorVariant: "default",
  cursorLabel: "",
  introPlayed: false,
  lightboxIndex: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUI,
  reducers: {
    setCommandOpen(state, action: PayloadAction<boolean>) {
      state.commandOpen = action.payload;
    },
    toggleCommand(state) {
      state.commandOpen = !state.commandOpen;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    setCursor(
      state,
      action: PayloadAction<{ variant: UIState["cursorVariant"]; label?: string }>,
    ) {
      state.cursorVariant = action.payload.variant;
      state.cursorLabel = action.payload.label ?? "";
    },
    markIntroPlayed(state) {
      state.introPlayed = true;
    },
    openLightbox(state, action: PayloadAction<number>) {
      state.lightboxIndex = action.payload;
    },
    closeLightbox(state) {
      state.lightboxIndex = null;
    },
  },
});

export const {
  setCommandOpen,
  toggleCommand,
  setMobileNavOpen,
  setCursor,
  markIntroPlayed,
  openLightbox,
  closeLightbox,
} = uiSlice.actions;

/* ── Filters slice (projects & blog listing) ──────────────── */
interface FiltersState {
  projectCategory: string;
  projectTech: string;
  projectQuery: string;
  blogCategory: string;
  blogTag: string;
  blogQuery: string;
  view: "grid" | "list";
}

const initialFilters: FiltersState = {
  projectCategory: "all",
  projectTech: "all",
  projectQuery: "",
  blogCategory: "all",
  blogTag: "all",
  blogQuery: "",
  view: "grid",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState: initialFilters,
  reducers: {
    setProjectCategory(state, action: PayloadAction<string>) {
      state.projectCategory = action.payload;
    },
    setProjectTech(state, action: PayloadAction<string>) {
      state.projectTech = action.payload;
    },
    setProjectQuery(state, action: PayloadAction<string>) {
      state.projectQuery = action.payload;
    },
    setBlogCategory(state, action: PayloadAction<string>) {
      state.blogCategory = action.payload;
    },
    setBlogTag(state, action: PayloadAction<string>) {
      state.blogTag = action.payload;
    },
    setBlogQuery(state, action: PayloadAction<string>) {
      state.blogQuery = action.payload;
    },
    setView(state, action: PayloadAction<"grid" | "list">) {
      state.view = action.payload;
    },
    resetProjectFilters(state) {
      state.projectCategory = "all";
      state.projectTech = "all";
      state.projectQuery = "";
    },
    resetBlogFilters(state) {
      state.blogCategory = "all";
      state.blogTag = "all";
      state.blogQuery = "";
    },
  },
});

export const {
  setProjectCategory,
  setProjectTech,
  setProjectQuery,
  setBlogCategory,
  setBlogTag,
  setBlogQuery,
  setView,
  resetProjectFilters,
  resetBlogFilters,
} = filtersSlice.actions;

/* ── Store ────────────────────────────────────────────────── */
export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiSlice.reducer,
      filters: filtersSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
