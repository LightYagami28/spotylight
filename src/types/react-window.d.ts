declare module 'react-window' {
    import type * as React from 'react';

    type CSSProperties = React.CSSProperties;
    type ReactNode = React.ReactNode;
    type Ref<T> = React.Ref<T>;

    interface ListOnScrollProps {
        scrollDirection: 'backward' | 'forward';
        scrollOffset: number;
        scrollUpdateWasRequested: boolean;
    }

    interface ListOnItemsRenderedProps {
        overscanStartIndex: number;
        overscanStopIndex: number;
        visibleStartIndex: number;
        visibleStopIndex: number;
    }

    interface ListChildComponentProps<T = unknown> {
        data: T;
        index: number;
        isScrolling?: boolean;
        style: CSSProperties;
    }

    interface FixedSizeListProps<T = unknown> {
        children: (props: ListChildComponentProps<T>) => ReactNode;
        height: number;
        initialScrollOffset?: number;
        itemCount: number;
        itemData?: T;
        itemSize: number;
        onItemsRendered?: (props: ListOnItemsRenderedProps) => void;
        onScroll?: (props: ListOnScrollProps) => void;
        outerRef?: Ref<HTMLDivElement>;
        width: number;
    }

    export class FixedSizeList<T = unknown> extends React.Component<FixedSizeListProps<T>> {
        scrollTo(scrollOffset: number): void;
        scrollToItem(index: number, align?: 'auto' | 'center' | 'end' | 'smart' | 'start'): void;
    }

    export type { ListChildComponentProps, ListOnItemsRenderedProps, ListOnScrollProps };
}
