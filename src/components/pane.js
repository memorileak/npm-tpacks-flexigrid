const {zeroOrientedFloor} = require('../utils/floor.js');

function flexiPane({xByGridCell, yByGridCell, widthByGridCell, heightByGridCell}) {
  let thisXByGridCell = makeValidXByGridCell(typeof xByGridCell === 'number' ? xByGridCell : 0);
  let thisYByGridCell = makeValidYByGridCell(typeof yByGridCell === 'number' ? yByGridCell : 0);
  let thisWidthByGridCell = makeValidWidthByGridCell(typeof widthByGridCell === 'number' ? widthByGridCell : 2);
  let thisHeightByGridCell = makeValidHeightByGridCell(typeof heightByGridCell === 'number' ? heightByGridCell : 2);
  let thisZIndexLevel = 0;
  let thisGridInstance = null;
  let thisOwnId = null;

  function makeValidXByGridCell(xByGridCell) {
    if (xByGridCell < 0) {
      return 0;
    }    
    return xByGridCell;
  }

  function makeValidYByGridCell(yByGridCell) {
    if (yByGridCell < 0) {
      return 0;
    }    
    return yByGridCell;
  }

  function makeValidWidthByGridCell(widthByGridCell) {
    return (widthByGridCell < 1) ? 1 : widthByGridCell;
  }

  function makeValidHeightByGridCell(heightByGridCell) {
    return (heightByGridCell < 1) ? 1 : heightByGridCell;
  }

  function getId() {
    return thisOwnId;
  }

  function getZIndexLevel() {
    return thisZIndexLevel;
  }

  function getXYByPixel() {
    const cellSizeByPixel = thisGridInstance.getCellSizeByPixel();
    const gridData = thisGridInstance.getGridData();
    const xByPixel = thisXByGridCell * (cellSizeByPixel[0] + gridData.gapByPixel);
    const yByPixel = thisYByGridCell * (cellSizeByPixel[1] + gridData.gapByPixel);
    return [xByPixel, yByPixel];
  }

  function getWidthHeightByPixel() {
    const cellSize = thisGridInstance.getCellSizeByPixel();
    const gridData = thisGridInstance.getGridData();
    const widthByPixel = thisWidthByGridCell * cellSize[0] + (thisWidthByGridCell - 1) * gridData.gapByPixel;
    const heightByPixel = thisHeightByGridCell * cellSize[1] + (thisHeightByGridCell - 1) * gridData.gapByPixel;
    return [widthByPixel, heightByPixel];
  }

  function getBottomRightXYByPixel() {
    const cellSizeByPixel = thisGridInstance.getCellSizeByPixel();
    const gridData = thisGridInstance.getGridData();
    const topLeftXByPixel = thisXByGridCell * (cellSizeByPixel[0] + gridData.gapByPixel);
    const topLeftYByPixel = thisYByGridCell * (cellSizeByPixel[1] + gridData.gapByPixel);
    const widthByPixel = thisWidthByGridCell * cellSizeByPixel[0] + (thisWidthByGridCell - 1) * gridData.gapByPixel;
    const heightByPixel = thisHeightByGridCell * cellSizeByPixel[1] + (thisHeightByGridCell - 1) * gridData.gapByPixel;
    return [topLeftXByPixel + widthByPixel, topLeftYByPixel + heightByPixel];
  }

  function getXYByGridCell() {
    return [thisXByGridCell, thisYByGridCell];
  }

  function getWidthHeightByGridCell() {
    return [thisWidthByGridCell, thisHeightByGridCell];
  }


  function belongsToGrid(gridInstance, ownId) {
    thisGridInstance = gridInstance;
    thisOwnId = ownId;
  }

  function fitToSlot() {
    thisXByGridCell = makeValidXByGridCell(Math.round(thisXByGridCell));
    thisYByGridCell = makeValidYByGridCell(Math.round(thisYByGridCell));
    thisWidthByGridCell = makeValidWidthByGridCell(Math.round(thisWidthByGridCell));
    thisHeightByGridCell = makeValidHeightByGridCell(Math.round(thisHeightByGridCell));
  }

  function increaseZIndexLevel() {
    thisZIndexLevel += 1;
  }

  function decreaseZIndexLevel() {
    if (thisZIndexLevel > 0) {
      thisZIndexLevel -= 1;
    }
  }

  function setXYByPixel([xByPixel, yByPixel]) {
    if (typeof xByPixel === 'number' && typeof yByPixel === 'number') {
      const cellSizeByPixel = thisGridInstance.getCellSizeByPixel();
      const gridData = thisGridInstance.getGridData();
      thisXByGridCell = makeValidXByGridCell(xByPixel / (cellSizeByPixel[0] + gridData.gapByPixel));
      thisYByGridCell = makeValidYByGridCell(yByPixel / (cellSizeByPixel[1] + gridData.gapByPixel));
    } else {
      console.error('Pane.setXYByPixel: x, y must be numbers');
    }
  }

  function setWidthHeightByPixel([widthByPixel, heightByPixel]) {
    if (typeof widthByPixel === 'number' && typeof heightByPixel === 'number') {
      const cellSizeByPixel = thisGridInstance.getCellSizeByPixel();
      const gridData = thisGridInstance.getGridData();
      thisWidthByGridCell = makeValidWidthByGridCell((widthByPixel + gridData.gapByPixel) / (cellSizeByPixel[0] + gridData.gapByPixel));
      thisHeightByGridCell = makeValidHeightByGridCell((heightByPixel + gridData.gapByPixel) / (cellSizeByPixel[1] + gridData.gapByPixel));
    } else {
      console.error('Pane.setWidthHeightByPixel: width, height must be numbers');
    }
  }

  function setXYByGridCell([xByGridCell, yByGridCell]) {
    if (typeof xByGridCell === 'number' && typeof yByGridCell === 'number') {
      thisXByGridCell = makeValidXByGridCell(xByGridCell);
      thisYByGridCell = makeValidYByGridCell(yByGridCell);
    } else {
      console.error('Pane.setXYByGridCell: x, y must be numbers');
    }
  }

  function setWidthHeightByGridCell([widthByGridCell, heightByGridCell]) {
    if (typeof widthByGridCell === 'number' && typeof heightByGridCell === 'number') {
      thisWidthByGridCell = makeValidWidthByGridCell(widthByGridCell);
      thisHeightByGridCell = makeValidHeightByGridCell(heightByGridCell);
    } else {
      console.error('Pane.setWidthHeightByGridCell: width, height must be numbers');
    }
  }

  function positioningByPixelWithPixels([pickPointXByPixel, pickPointYByPixel], [offsetToTopLeftXByPixel, offsetToTopLeftYByPixel]) {
    setXYByPixel([
      pickPointXByPixel + offsetToTopLeftXByPixel,
      pickPointYByPixel + offsetToTopLeftYByPixel,
    ]);
  }

  function sizingByPixelWithPixels([pickPointXByPixel, pickPointYByPixel], [offsetToBottomRightXByPixel, offsetToBottomRightYByPixel]) {
    const [topLeftXByPixel, topLeftYByPixel] = getXYByPixel();
    const [bottomRightXByPixel, bottomRightYByPixel] = [
      pickPointXByPixel + offsetToBottomRightXByPixel,
      pickPointYByPixel + offsetToBottomRightYByPixel,
    ];
    setWidthHeightByPixel([
      bottomRightXByPixel - topLeftXByPixel + 1,
      bottomRightYByPixel - topLeftYByPixel + 1,
    ]);
  }

  function positioningByGridCellWithPixels([pickPointXByPixel, pickPointYByPixel], [offsetToTopLeftXByPixel, offsetToTopLeftYByPixel]) {
    const cellSizeByPixel = thisGridInstance.getCellSizeByPixel();
    const gridData = thisGridInstance.getGridData();
    const [pickPointXByGridCell, pickPointYByGridCell] = thisGridInstance.getXYByGridCellFromPixel([pickPointXByPixel, pickPointYByPixel]);
    const [offsetToTopLeftXByGridCell, offsetToTopLeftYByGridCell] = [
      zeroOrientedFloor(offsetToTopLeftXByPixel / (cellSizeByPixel[0] + gridData.gapByPixel)),
      zeroOrientedFloor(offsetToTopLeftYByPixel / (cellSizeByPixel[1] + gridData.gapByPixel)),
    ];
    setXYByGridCell([
      pickPointXByGridCell + offsetToTopLeftXByGridCell,
      pickPointYByGridCell + offsetToTopLeftYByGridCell,
    ]);
  }

  function sizingByGridCellWithPixels([pickPointXByPixel, pickPointYByPixel], [offsetToBottomRightXByPixel, offsetToBottomRightYByPixel]) {
    const cellSizeByPixel = thisGridInstance.getCellSizeByPixel();
    const gridData = thisGridInstance.getGridData();
    const [pickPointXByGridCell, pickPointYByGridCell] = thisGridInstance.getXYByGridCellFromPixel([pickPointXByPixel, pickPointYByPixel]);
    const [offsetToBottomRightXByGridCell, offsetToBottomRightYByGridCell] = [
      zeroOrientedFloor(offsetToBottomRightXByPixel / (cellSizeByPixel[0] + gridData.gapByPixel)),
      zeroOrientedFloor(offsetToBottomRightYByPixel / (cellSizeByPixel[1] + gridData.gapByPixel)),
    ];
    const [topLeftXByGridCell, topLeftYByGridCell] = getXYByGridCell();
    const [bottomRightXByGridCell, bottomRightYByGridCell] = [
      pickPointXByGridCell + offsetToBottomRightXByGridCell,
      pickPointYByGridCell + offsetToBottomRightYByGridCell,
    ];
    setWidthHeightByGridCell([
      bottomRightXByGridCell - topLeftXByGridCell + 1,
      bottomRightYByGridCell - topLeftYByGridCell + 1,
    ]);
  }

  return {
    getId,
    getZIndexLevel,
    getXYByPixel,
    getWidthHeightByPixel,
    getBottomRightXYByPixel,
    getXYByGridCell,
    getWidthHeightByGridCell,

    belongsToGrid,
    fitToSlot,
    increaseZIndexLevel,
    decreaseZIndexLevel,
    setXYByPixel,
    setWidthHeightByPixel,
    setXYByGridCell,
    setWidthHeightByGridCell,
    positioningByPixelWithPixels,
    sizingByPixelWithPixels,
    positioningByGridCellWithPixels,
    sizingByGridCellWithPixels,
  };
};

module.exports = {flexiPane};
