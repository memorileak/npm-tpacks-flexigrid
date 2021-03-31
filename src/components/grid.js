const {genid} = require('../utils/genid');

function flexiGrid({width, cols, rowHeight, gap}) {
  let _width = typeof width === 'number' ? width : 1280;
  let _cols = typeof cols === 'number' ? cols : 24;
  let _rowHeight = typeof rowHeight === 'number' ? rowHeight : 80;
  let _gap = typeof gap === 'number' ? gap : 5;
  let _previewPane = null;
  let _paneInPreview = null;
  const _paneIds = [];
  const _paneInstances = {};

  function isTwoPanesCollided(paneInstance1, paneInstance2) {
    const [x1, y1] = paneInstance1.grid_getxy();
    const [w1, h1] = paneInstance1.grid_getWidthHeight();
    const [x2, y2] = paneInstance2.grid_getxy();
    const [w2, h2] = paneInstance2.grid_getWidthHeight();
    return (
      x1 <= x2 + w2 - 1 && x1 + w1 - 1 >= x2
      && y1 <= y2 + h2 - 1 && y1 + h1 - 1 >= y2
    );
  }

  function getGridParams() {
    return {
      width: _width,
      cols: _cols,
      rowHeight: _rowHeight,
      gap: _gap,
    };
  }

  function getPaneIds() {
    return [..._paneIds];
  }

  function getPane(paneId) {
    return _paneInstances[paneId] || null;
  }

  function getPreviewPane() {
    return _previewPane;
  }

  function setPreviewPane(previewPane) {
    const previewPaneId = genid();
    _previewPane = previewPane;
    previewPane.belongsToGrid(gridInstance, previewPaneId);
    return previewPaneId;
  }

  function attachPreview(paneInstance) {
    _paneInPreview = paneInstance;
    _previewPane.grid_setxy(paneInstance.grid_getxy());
    _previewPane.grid_setWidthHeight(paneInstance.grid_getWidthHeight());
  }

  function detachPreview() {
    _paneInPreview = null;
  }

  function px_getCellSize() {
    const cellWidth = (_width - _gap * (_cols - 1)) / _cols;
    const cellHeight = _rowHeight;
    return [cellWidth, cellHeight];
  }

  function px_getGridHeight() {
    let height = 0;
    for (let i = 0; i < _paneIds.length; i += 1) {
      const [, bry] = getPane(_paneIds[i]).px_getBottomRightxy();
      height = (height < bry) ? bry : height;
    }
    return height;
  }

  function px_calVector([pxFromx, pxFromy], [pxTox, pxToy]) {
    return [pxTox - pxFromx, pxToy - pxFromy];
  }

  function grid_getxyOfPoint([pxx, pxy]) {
    const cellSize = px_getCellSize();
    const gridx = Math.floor(pxx / (cellSize[0] + _gap));
    const gridy = Math.floor(pxy / (cellSize[1] + _gap));
    return [gridx, gridy];
  }

  function grid_getGridHeight() {
    const [, gridMaxy] = grid_getxyOfPoint([0, px_getGridHeight()]);
    return gridMaxy + 1;
  }

  function grid_calVector([pxFromx, pxFromy], [pxTox, pxToy]) {
    const [gridFromx, gridFromy] = grid_getxyOfPoint([pxFromx, pxFromy]);
    const [gridTox, gridToy] = grid_getxyOfPoint([pxTox, pxToy]);
    return [gridTox - gridFromx, gridToy - gridFromy];
  }

  function setGridParams({width, cols, rowHeight, gap}) {
    if (typeof width === 'number') {
      _width = width;
    }
    if (typeof cols === 'number') {
      _cols = cols;
    }
    if (typeof rowHeight === 'number') {
      _rowHeight = rowHeight;
    }
    if (typeof gap === 'number') {
      _gap = gap;
    }
  }

  function addPane(newPane) {
    const paneId = genid();
    _paneIds.push(paneId);
    _paneInstances[paneId] = newPane;
    newPane.belongsToGrid(gridInstance, paneId);
    return paneId;
  }

  function removePane(paneId) {
    const paneIdIndex = _paneIds.findIndex((id) => id === paneId);
    _paneIds.splice(paneIdIndex, 1);
    _paneInstances[paneId].belongsToGrid(null, null);
    delete _paneInstances[paneId];
  }

  function hasCollision() {
    let panesToConsider = [];
    if (_paneInPreview) {
      panesToConsider = (
        _paneIds
          .filter((pId) => (pId !== _paneInPreview.getId()))
          .map((pId) => getPane(pId))
      ).concat(
        [getPreviewPane()]
      );
    } else {
      panesToConsider = _paneIds.map((pId) => getPane(pId));
    }
    for (let i = 0; i < panesToConsider.length - 1; i += 1) {
      for (let j = i + 1; j < panesToConsider.length; j += 1) {
        if (isTwoPanesCollided(panesToConsider[i], panesToConsider[j])) {
          return true;
        }
      }
    }
    return false;
  }

  function hasPreviewCollision() {
    const previewPane = getPreviewPane();
    let panesToConsider = [];
    if (_paneInPreview) {
      panesToConsider = (
        _paneIds
          .filter((pId) => (pId !== _paneInPreview.getId()))
          .map((pId) => getPane(pId))
      );
      for (let i = 0; i < panesToConsider.length; i += 1) {
        if (isTwoPanesCollided(previewPane, panesToConsider[i])) {
          return true;
        }
      }
    }
    return false;
  }

  const gridInstance = {
    getGridParams,
    getPaneIds,
    getPane,
    getPreviewPane,
    setPreviewPane,
    attachPreview,
    detachPreview,
    px_getCellSize,
    px_getGridHeight,
    px_calVector,
    grid_getxyOfPoint,
    grid_getGridHeight,
    grid_calVector,
    setGridParams,
    addPane,
    removePane,
    hasCollision,
    hasPreviewCollision,
  };

  return gridInstance;
};

module.exports = {flexiGrid};
