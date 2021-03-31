export interface FlexiPaneParams {
  onGridx: number,
  onGridy: number,
  onGridWidth: number,
  onGridHeight: number,
}

export interface FlexiPane {
  getId(): string,
  belongsToGrid(gridInstance: FlexiGrid, ownId: string): void,
  fitToSlot(): void,
  px_getxy(): [number, number],
  px_getWidthHeight(): [number, number],
  px_getBottomRightxy(): [number, number],
  px_setxy([pxx, pxy]: [number, number]): void,
  px_setWidthHeight([pxWidth, pxHeight]: [number, number]): void,
  px_positioning(
    [pxPickPointx, pxPickPointy]: [number, number], 
    [pxOffsetToTopLeftx, pxOffsetToTopLefty]: [number, number],
  ): void,
  px_sizing(
    [pxPickPointx, pxPickPointy]: [number, number], 
    [pxOffsetToBottomRightx, pxOffsetToBottomRighty]: [number, number],
  ): void,
  grid_getxy(): [number, number],
  grid_getWidthHeight(): [number, number],
  grid_setxy([onGridx, onGridy]: [number, number]): void,
  grid_setWidthHeight([gridWidth, gridHeight]: [number, number]): void,
  grid_positioning(
    [pxPickPointx, pxPickPointy]: [number, number], 
    [pxOffsetToTopLeftx, pxOffsetToTopLefty]: [number, number],
  ): void,
  grid_sizing(
    [pxPickPointx, pxPickPointy]: [number, number], 
    [pxOffsetToBottomRightx, pxOffsetToBottomRighty]: [number, number],
  ): void,
}

export type FlexiPaneFactory = (paneParams: FlexiPaneParams) => FlexiPane;
export const flexiPane: FlexiPaneFactory;


export interface FlexiGridParams {
  width: number,
  cols: number,
  rowHeight: number,
  gap: number,
}

export interface FlexiGrid {
  getGridParams(): FlexiGridParams,
  getPaneIds(): Array<string>,
  getPane(): FlexiPane,
  getPreviewPane(): FlexiPane,
  setPreviewPane(previewPane: FlexiPane): string,
  attachPreview(paneInstance: FlexiPane): void,
  detachPreview(): void,
  px_getCellSize(): [number, number],
  px_getGridHeight(): number,
  px_calVector(
    [pxFromx, pxFromy]: [number, number], 
    [pxTox, pxToy]: [number, number],
  ): [number, number],
  grid_getxyOfPoint([pxx, pxy]: [number, number]): [number, number],
  grid_getGridHeight(): number,
  grid_calVector(
    [pxFromx, pxFromy]: [number, number], 
    [pxTox, pxToy]: [number, number],
  ): [number, number],
  setGridParams({width, cols, rowHeight, gap}: {
    width?: number,
    cols?: number,
    rowHeight?: number,
    gap?: number,
  }): void,
  addPane(newPane: FlexiPane): string,
  removePane(): void,
  hasCollision(): boolean,
  hasPreviewCollision(): boolean,
}

export type FlexiGridFactory = (gridParams: FlexiGridParams) => FlexiGrid;
export const flexiGrid: FlexiGridFactory;
