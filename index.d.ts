export interface FlexiPaneData {
  xByGridCell: number,
  yByGridCell: number,
  widthByGridCell: number,
  heightByGridCell: number,
}

export interface FlexiPaneState extends FlexiPaneData {
  id: string, 
  zIndexLevel: number,
}

export interface FlexiPane {
  getId(): string,
  getZIndexLevel(): number,
  getXYByPixel(): [number, number],
  getWidthHeightByPixel(): [number, number],
  getBottomRightXYByPixel(): [number, number],
  getXYByGridCell(): [number, number],
  getWidthHeightByGridCell(): [number, number],
  getCurrentState(): FlexiPaneState,

  belongsToGrid(gridInstance: FlexiGrid, ownId: string): void,
  fitToSlot(): void,
  increaseZIndexLevel(): void,
  decreaseZIndexLevel(): void,
  setXYByPixel([xByPixel, yByPixel]: [number, number]): void,
  setWidthHeightByPixel([widthByPixel, heightByPixel]: [number, number]): void,
  setXYByGridCell([xByGridCell, yByGridCell]: [number, number]): void,
  setWidthHeightByGridCell([widthByGridCell, heightByGridCell]: [number, number]): void,
  positioningByPixelWithPixels(
    [pickPointXByPixel, pickPointYByPixel]: [number, number], 
    [offsetToTopLeftXByPixel, offsetToTopLeftYByPixel]: [number, number],
  ): void,
  sizingByPixelWithPixels(
    [pickPointXByPixel, pickPointYByPixel]: [number, number], 
    [offsetToBottomRightXByPixel, offsetToBottomRightYByPixel]: [number, number],
  ): void,
  positioningByGridCellWithPixels(
    [pickPointXByPixel, pickPointYByPixel]: [number, number], 
    [offsetToTopLeftXByPixel, offsetToTopLeftYByPixel]: [number, number],
  ): void,
  sizingByGridCellWithPixels(
    [pickPointXByPixel, pickPointYByPixel]: [number, number], 
    [offsetToBottomRightXByPixel, offsetToBottomRightYByPixel]: [number, number],
  ): void,
}

export type FlexiPaneFactory = ({xByGridCell, yByGridCell, widthByGridCell, heightByGridCell}: FlexiPaneData) => FlexiPane;
export const flexiPane: FlexiPaneFactory;


export interface FlexiGridData {
  widthByPixel: number,
  numberOfColumns: number,
  rowHeightByPixel: number,
  gapByPixel: number,
}

export interface FlexiGridState extends FlexiGridData {
  previewPane: FlexiPane,
  panePreviewing: FlexiPane,
  paneIds: Array<string>,
  paneInstances: Record<string, FlexiPane>,
}

export interface FlexiGrid {
  calculateVectorByPixelFromPixels(
    [sourceXByPixel, sourceYByPixel]: [number, number], 
    [destXByPixel, destYByPixel]: [number, number],
  ): [number, number],
  calculateVectorByGridCellFromPixels(
    [sourceXByPixel, sourceYByPixel]: [number, number], 
    [destXByPixel, destYByPixel]: [number, number],
  ): [number, number],

  getGridData(): FlexiGridData,
  getPaneIds(): Array<string>,
  getPane(paneId: string): FlexiPane,
  getPreviewPane(): FlexiPane,
  getCellSizeByPixel(): [number, number],
  getGridHeightByPixel(): number,
  getGridHeightByGridCell(): number,
  getXYByGridCellFromPixel([xByPixel, yByPixel]: [number, number]): [number, number],
  getCurrentState(): FlexiGridState,

  setPreviewPaneWithRandomId(previewPane: FlexiPane): string,
  setPreviewPaneWithSpecificId(previewPane: FlexiPane, previewPaneId: string): string,
  attachPreview(paneInstance: FlexiPane): void,
  detachPreview(): void,
  setGridParameter({widthByPixel, numberOfColumns, rowHeightByPixel, gapByPixel}: {
    widthByPixel?: number,
    numberOfColumns?: number,
    rowHeightByPixel?: number,
    gapByPixel?: number,
  }): void,
  addPaneWithRandomId(newPane: FlexiPane): string,
  addPaneWithSpecificId(newPane: FlexiPane, paneId: string): string,
  removePane(): void,
  isHavingAnyCollision(): boolean,
  isHavingCollisionWithPreviewPane(): boolean,
}

export type FlexiGridFactory = ({widthByPixel, numberOfColumns, rowHeightByPixel, gapByPixel}: FlexiGridData) => FlexiGrid;
export const flexiGrid: FlexiGridFactory;

export interface PaneDumpData {
  id: string,
  xByGridCell: number,
  yByGridCell: number,
  widthByGridCell: number,
  heightByGridCell: number,
}

export interface GridDumpData {
  widthByPixel: number,
  numberOfColumns: number,
  rowHeightByPixel: number,
  gapByPixel: number,
  previewPane: PaneDumpData,
  panePreviewingId: string,
  paneInstances: Record<string, PaneDumpData>,
}

export type FlexiGridDumper = (gridInstance: FlexiGrid) => GridDumpData;
export const makeDumpDataFromGrid: FlexiGridDumper;
export type FlexiGridLoader = (gridDumpData: GridDumpData) => FlexiGrid;
export const restoreGridFromDumpData: FlexiGridLoader;

