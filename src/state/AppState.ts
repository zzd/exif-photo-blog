import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  RefObject,
} from 'react';
import { AnimationConfig } from '@/components/AnimateItems';
import { ShareModalProps } from '@/share';
import { InsightsIndicatorStatus } from '@/admin/insights';
import { INITIAL_UPLOAD_STATE, UploadState } from '@/admin/upload';
import { AdminData } from '@/admin/actions';
import { RecipeProps } from '@/recipe';

export type AppStateContext = {
  // CORE
  previousPathname?: string
  hasLoaded?: boolean
  setHasLoaded?: Dispatch<SetStateAction<boolean>>
  swrTimestamp?: number
  invalidateSwr?: () => void
  nextPhotoAnimation?: AnimationConfig
  setNextPhotoAnimation?: Dispatch<SetStateAction<AnimationConfig | undefined>>
  clearNextPhotoAnimation?: () => void
  shouldRespondToKeyboardCommands?: boolean
  setShouldRespondToKeyboardCommands?: Dispatch<SetStateAction<boolean>>
  // UPLOAD
  startUpload?: (onStart?: () => void) => void
  uploadInputRef?: RefObject<HTMLInputElement | null>
  uploadState: UploadState
  setUploadState?: (uploadState: Partial<UploadState>) => void
  resetUploadState?: () => void
  // MODAL
  isCommandKOpen?: boolean
  setIsCommandKOpen?: Dispatch<SetStateAction<boolean>>
  shareModalProps?: ShareModalProps
  setShareModalProps?: Dispatch<SetStateAction<ShareModalProps | undefined>>
  recipeModalProps?: RecipeProps
  setRecipeModalProps?: Dispatch<SetStateAction<RecipeProps | undefined>>
  // AUTH
  userEmail?: string
  setUserEmail?: Dispatch<SetStateAction<string | undefined>>
  isUserSignedIn?: boolean
  isUserSignedInEager?: boolean
  clearAuthStateAndRedirect?: () => void
  // ADMIN
  adminUpdateTimes?: Date[]
  registerAdminUpdate?: () => void
  refreshAdminData?: () => void
  updateAdminData?: (updatedData: Partial<AdminData>) => void
  selectedPhotoIds?: string[]
  setSelectedPhotoIds?: Dispatch<SetStateAction<string[] | undefined>>
  isPerformingSelectEdit?: boolean
  setIsPerformingSelectEdit?: Dispatch<SetStateAction<boolean>>
  insightsIndicatorStatus?: InsightsIndicatorStatus
  // DEBUG
  isGridHighDensity?: boolean
  setIsGridHighDensity?: Dispatch<SetStateAction<boolean>>
  areZoomControlsShown?: boolean
  setAreZoomControlsShown?: Dispatch<SetStateAction<boolean>>
  arePhotosMatted?: boolean
  setArePhotosMatted?: Dispatch<SetStateAction<boolean>>
  shouldDebugImageFallbacks?: boolean
  setShouldDebugImageFallbacks?: Dispatch<SetStateAction<boolean>>
  shouldShowBaselineGrid?: boolean
  setShouldShowBaselineGrid?: Dispatch<SetStateAction<boolean>>
  shouldDebugInsights?: boolean
  setShouldDebugInsights?: Dispatch<SetStateAction<boolean>>
  shouldDebugRecipeOverlays?: boolean
  setShouldDebugRecipeOverlays?: Dispatch<SetStateAction<boolean>>
} & Partial<AdminData>

export const AppStateContext = createContext<AppStateContext>({
  uploadState: INITIAL_UPLOAD_STATE,
});

export const useAppState = () => useContext(AppStateContext);
