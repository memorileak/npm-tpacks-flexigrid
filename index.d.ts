export interface FlexiPaneData {
  xByGridCell: number,
  yByGridCell: number,
  widthByGridCell: number,
  heightByGridCell: number,
}

export interface FlexiPane {
  getId(): string,
  getZIndexLevel(): number,
  getXYByPixel(): [number, number],
  getWidthHeightByPixel(): [number, number],
  getBottomRightXYByPixel(): [number, number],
  getXYByGridCell(): [number, number],
  getWidthHeightByGridCell(): [number, number],

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
  getXYByGridCellFromPixel([xByPixel, yByPixel]: [number, number]): [number, number],
  getGridHeightByGridCell(): number,

  setPreviewPane(previewPane: FlexiPane): string,
  attachPreview(paneInstance: FlexiPane): void,
  detachPreview(): void,
  setGridParameter({widthByPixel, numberOfColumns, rowHeightByPixel, gapByPixel}: {
    widthByPixel?: number,
    numberOfColumns?: number,
    rowHeightByPixel?: number,
    gapByPixel?: number,
  }): void,
  addPane(newPane: FlexiPane): string,
  removePane(): void,
  isHavingAnyCollision(): boolean,
  isHavingCollisionWithPreviewPane(): boolean,
}

export type FlexiGridFactory = ({widthByPixel, numberOfColumns, rowHeightByPixel, gapByPixel}: FlexiGridData) => FlexiGrid;
export const flexiGrid: FlexiGridFactory;
