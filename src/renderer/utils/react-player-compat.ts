/**
 * Compatibility helpers for react-player v3, whose ref is the underlying
 * HTMLVideoElement instead of the v2 class instance.
 */
export type ReactPlayerRef = HTMLVideoElement;

export const getInternalPlayer = (
    ref: null | ReactPlayerRef | undefined,
): HTMLMediaElement | undefined => {
    return ref ?? undefined;
};

export const seekPlayerTo = (ref: ReactPlayerRef, seconds: number) => {
    ref.currentTime = seconds;
};
