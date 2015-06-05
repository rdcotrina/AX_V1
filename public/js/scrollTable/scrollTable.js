/*
 * Documento   : scrollTtable v.1.0 ... se modifico desde table_scroll.js (internet)
 * Creado      : mayo 2015
 * Autor       : RD
 * Descripcion : crea los scroll de una tabla
 */
(function($){
    
    "use strict";
    
    var CELL_INDEX_DATA = '_sg_index_';
    var CELL_SPAN_ADJUSTMENTS = '_sg_adj_';
    
    $.fn.extend({
        
        scrollable: function(opts){
            
            var $this = this;
            
            var _private = {};
            
            _private._currentTouch = null;
            
            _private._columnsCount = -1;
            
            _private.startFrom = 0;
            
            _private.widget = null;
            
            var defaults = {
                rowsInHeader: null,
                rowsInFooter: null,
                fixedColumnsLeft: 0,
                fixedColumnsRight: 0,
                rowsInScrollableArea: 10,
                columnsInScrollableArea: 5,
                overflowY: 'auto', /*scroll, auto*/
                overflowX: 'auto' /*scroll, auto*/
            };
            
            var options = $.extend(defaults, opts);
            
            var _create = function () {
                _private._columnsCount = -1;
                _private._currentTouch = null;
                _ensureSettings();
                _private.startFrom = 0;
                _setActualCellIndexes();
                _yInitScroll();
                _yUpdateRowsVisibility();
                _xInitScroll();
                _xUpdateColumnsVisibility();
                _yUpdateScrollHeights();

                $($this).on("mousewheel", $.proxy(_tableMouseWheel, $this));
                $($this).on("DOMMouseScroll", $.proxy(_tableMouseWheel, $this)); // Firefox
                $($this).on('touchstart', $.proxy(_touchStart, $this));
                $($this).on('touchmove', $.proxy(_touchMove, $this));
                $($this).on('touchend', $.proxy(_touchEnd, $this));
            };
                
            var _ensureSettings = function() {
                if (options.rowsInHeader == null) {

                    if (_table().tHead)
                        options.rowsInHeader = _table().tHead.rows.length;
                    else
                        options.rowsInHeader = 1;
                }

                if (options.rowsInFooter == null) {
                    if (_table().tFoot)
                        options.rowsInFooter = _table().tFoot.rows.length;
                    else
                        options.rowsInFooter = 0;
                }
            };
            
            var _xGetNumberOfColumns = function () {
                if (_private._columnsCount != -1)
                    return _private._columnsCount;

                _private._columnsCount = Math.max.apply(null, $(_table().rows).map(function () { return this.cells.length; }).get());

                if ($('.sg-v-scroll-cell', _private.widget).length > 0)
                    _private._columnsCount -= 1;

                return _private._columnsCount;
            };
            
            var _xNumberOfScrollableColumns = function() {
                var width = _xGetNumberOfColumns() - options.fixedColumnsLeft - options.fixedColumnsRight;
                if(width < 1)
                    return 1;
                return width;
            };
            
            var _xScrollWidth = function() {
                var width = _xGetNumberOfColumns() - options.fixedColumnsLeft - options.fixedColumnsRight;
                if (width > options.columnsInScrollableArea)
                    return options.columnsInScrollableArea;
                if (width < 1)
                    return 1;
                return width;
            };
            
            var _xScrollNeeded = function() {
                var width = _xGetNumberOfColumns() - options.fixedColumnsLeft - options.fixedColumnsRight;
                return width > options.columnsInScrollableArea;
            };
            
            var _xInitScroll = function() {
                if (_xGetNumberOfColumns() < (options.fixedColumnsLeft + options.fixedColumnsRight))
                    return;

                if (_xScrollNeeded() || options.overflowX == 'scroll') {

                    var row = _table().insertRow(_table().rows.length);

                    if (options.fixedColumnsLeft > 0) {
                        var $cell = $(row.insertCell(0));
                        $cell.attr('colspan', options.fixedColumnsLeft);
                    }

                    var $container = $(row.insertCell(1));
                    $container.attr('colspan', _xScrollWidth());
                    $container.addClass('sg-x-scroll-cell');
                    $container.attr('id','scrollFoot_'+$($this).attr('id'));

                    var $widthDivContainer = $('<div class="sg-h-scroll-container"></div>');
                    $widthDivContainer.css('overflow-x', 'scroll');
                    $widthDivContainer.css('margin-right', '-20000px');
                    $widthDivContainer.width($container.width());

                    var $widthDiv = $('<div style="height: 1px;"></div>');
                    $widthDiv.width((_xNumberOfScrollableColumns() / _xScrollWidth()) * $container.width());
                    $widthDiv.appendTo($widthDivContainer);

                    $widthDivContainer.appendTo($container);
                    $widthDivContainer.scroll($.proxy(_xUpdateColumnsVisibility, this));

                    if (options.fixedColumnsRight > 0) {
                        var $cell = $(row.insertCell(2));
                        $cell.attr('colspan', options.fixedColumnsRight + 
                            ($('.sg-v-scroll-cell', _private.widget).length > 0 ? 1 : 0));
                    }
                }
            };
            
            var _xCurrentRelativeScrollLeft = function () {
                var $widthDivContainer = $('.sg-h-scroll-container', _private.widget);
                return $widthDivContainer.scrollLeft() / $widthDivContainer.width();
            };
            
            var _xScrollDelta = function () {
                var widthContainer = $('.sg-h-scroll-container', _private.widget);
                return $('div', widthContainer).width() - widthContainer.width();
            };
            
            var _xScrollableColumnsCount = function () {
                return _xNumberOfScrollableColumns() - _xScrollWidth();
            };
            
            var _xColumnScrollStep = function () {
                if (_xScrollableColumnsCount() == 0)
                    return 0;
                return _xScrollDelta() / _xScrollableColumnsCount();
            };
            
            var _setColumnVisibility = function(index, visible, start, end) {
                var rows = _table().rows;

                for (var rowIndex = start; rowIndex < end; rowIndex++) {
                    var row = rows[rowIndex];

                    for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {

                        //in this cycle body we can't use jQuery because this code is critical for performance

                        var cell = row.cells[cellIndex];
                        var cIndex = cell[CELL_INDEX_DATA];
                        if (cIndex == index) {

                            if (!cell.colSpan || cell.colSpan == 1) // apply visibility only for cells with colspan = 1
                            {
                                if (visible && cell.style.display == 'none')
                                    cell.style.display = '';

                                if (!visible && cell.style.display != 'none')
                                    cell.style.display = 'none';
                            }
                        }
                    }
                }
            };

            var _xFirstVisibleColumnWidth = function () {
                for (var i = options.rowsInHeader; i < _table().rows.length - options.rowsInFooter - $('.sg-h-scroll-container', _private.widget).length; i++) {
                    if ($(_table().rows[i]).css('display') != 'none') {
                        for (var j = options.fixedColumnsLeft; j < _xGetNumberOfColumns() - options.fixedColumnsRight; j++) {
                            if ($(_table().rows[i].cells[j]).css('display') != 'none')
                                return $(_table().rows[i].cells[j]).width();
                        }
                    }
                }
                return 0;
            };

            var _xLastVisibleColumnWidth = function () {
                for (var i = options.rowsInHeader; i < _table().rows.length - options.rowsInFooter - $('.sg-h-scroll-container', _private.widget).length; i++) {
                    if ($(_table().rows[i]).css('display') != 'none') {
                        for (var j = _xGetNumberOfColumns() - options.fixedColumnsRight - 1; j >= options.fixedColumnsLeft ; j--) {
                            if ($(_table().rows[i].cells[j]).css('display') != 'none')
                                return $(_table().rows[i].cells[j]).width();
                        }
                    }
                }
                return 0;
            };

            var _xUpdateColumnsVisibility = function() {
                if (!_xScrollNeeded())
                    return;

                var leftContainer = $('.sg-h-scroll-container', _private.widget);

                var startFromX = Math.floor(leftContainer.scrollLeft() / _xColumnScrollStep());
                var relativeLeft = _xCurrentRelativeScrollLeft();
                for (var i = options.fixedColumnsLeft; i < _xGetNumberOfColumns() - options.fixedColumnsRight; i++) {
                    var visible = false;

                    if (i >= options.fixedColumnsLeft + startFromX
                            &&
                            i < options.fixedColumnsLeft + startFromX + options.columnsInScrollableArea
                    ) {
                        visible = true;
                    }

                    _setColumnVisibility(i, visible, 0, _table().rows.length - 1 /* ignore scrolling row */);
                }
                _xUpdateScrollWidths();
            };

            var _xUpdateScrollWidths = function () {

                var leftContainer = $('.sg-h-scroll-container', _private.widget);
                var $container = leftContainer.closest('td');
                leftContainer.width($container.width());
                var $widthDiv = $('div', leftContainer);
                $widthDiv.width((_xNumberOfScrollableColumns() / _xScrollWidth()) * $container.width());
            };

            // vertical scrolling methods
            var _yScrollHeight = function() {
                var height = _table().rows.length - options.rowsInHeader - options.rowsInFooter;
                if ($('.sg-h-scroll-container', _private.widget).length > 0)
                    height--;

                if (height > options.rowsInScrollableArea)
                    return options.rowsInScrollableArea;
                if (height < 1)
                    return 1;
                return height;
            };
        
            var _yNumberOfScrollableRows = function () {
                var height = _table().rows.length - options.rowsInHeader - options.rowsInFooter;
                if ($('.sg-h-scroll-container', _private.widget).length > 0)
                    height--;

                if (height < 1)
                    return 1;
                return height;
            };

            var _yScrollNeeded = function() {
                var height = _table().rows.length - options.rowsInHeader - options.rowsInFooter;
                if ($('.sg-h-scroll-container', _private.widget).length > 0)
                    height--;
                return height > options.rowsInScrollableArea;
            };

            var _yInitScroll = function () {

                if (_table().rows.length < (options.rowsInHeader + options.rowsInFooter))
                    return;

                if (_yScrollNeeded() || options.overflowY == 'scroll') {
                    var $cell = $(_table().rows[0].insertCell(_table().rows[0].cells.length));
                    $cell.attr('rowspan', options.rowsInHeader);

                    var $container = $(_table().rows[options.rowsInHeader + _private.startFrom].insertCell(_table().rows[options.rowsInHeader + _private.startFrom].cells.length));
                    $container.attr('rowspan', _yScrollHeight());
                    $container.attr('width', "1px");
                    $container.addClass('sg-v-scroll-cell');

                    var $heightDivContainer = $('<div class="sg-v-scroll-container"></div>');
                    $heightDivContainer.css('overflow-y', 'scroll');
                    $heightDivContainer.height($container.height());

                    var $heightDiv = $('<div style="width: 1px;"></div>');
                    $heightDiv.height((_yNumberOfScrollableRows() / _yScrollHeight()) * $container.height());
                    $heightDiv.appendTo($heightDivContainer);

                    $heightDivContainer.appendTo($container);
                    _attachToEndScrolling($heightDivContainer, $.proxy(_yUpdateRowsVisibility, this));

                    if (options.rowsInFooter != 0) {
                        var firstBotomRow = _table().rows[_yNumberOfScrollableRows() + options.rowsInHeader];
                        var $bottomCell = $(firstBotomRow.insertCell(firstBotomRow.cells.length));
                        $bottomCell.attr('rowspan', options.rowsInFooter);
                    }
                }
            };

            var _yCurrentRelativeScrollTop = function() {
                var $heightDivContainer = $('.sg-v-scroll-container', _private.widget);
                return $heightDivContainer.scrollTop() / $heightDivContainer.height();
            };

            var _yMoveScrollToRightRow = function(oldRelativeTop) {
                var trCurrentContainer = $('.sg-v-scroll-cell', _private.widget).closest('tr').get(0);
                var trTargetContainer = _table().rows[options.rowsInHeader + _private.startFrom];

                var $heightDivContainer = $('.sg-v-scroll-container', _private.widget);
                var $heightDiv = $('div', $heightDivContainer);

                if (trCurrentContainer != trTargetContainer) {
                    var $newCell = $(trTargetContainer.insertCell(trTargetContainer.cells.length));
                    $newCell.attr('rowspan', _yScrollHeight());
                    $newCell.addClass('sg-v-scroll-cell');
                    $newCell.attr('width', "1px");

                    var scrollDiv = $('.sg-v-scroll-container', $(trCurrentContainer));
                    scrollDiv.height(0);
                    scrollDiv.appendTo($newCell);
                    trCurrentContainer.deleteCell(trCurrentContainer.cells.length - 1);

                    $heightDivContainer.height($newCell.height());
                    $heightDiv.height((_yNumberOfScrollableRows() / _yScrollHeight()) * $newCell.height());

                    $heightDivContainer.scrollTop(oldRelativeTop * $heightDivContainer.height());
                    $heightDivContainer.get(0);
                }
            };

            var _yScrollDelta = function () {
                var topContainer = $('.sg-v-scroll-container', _private.widget);
                return $('div', topContainer).height() - topContainer.height();
            };

            var _yScrollableRowsCount = function() {
                return _yNumberOfScrollableRows() - _yScrollHeight();
            };

            var _yRowScrollStep = function () {
                if (_yScrollableRowsCount() == 0)
                    return 0;
                return _yScrollDelta() / _yScrollableRowsCount();
            };

            var _yUpdateScrollHeights = function () {

                var topContainer = $('.sg-v-scroll-container', _private.widget);
                var $container = topContainer.closest('td');
                topContainer.hide();
                topContainer.height($container.height());
                var $heightDiv = $('div', topContainer);
                $heightDiv.height((_yNumberOfScrollableRows() / _yScrollHeight()) * $container.height());
                topContainer.show();
            };

            var _yFirstVisibleRowHeight = function(){
                for (var i = options.rowsInHeader; i < _table().rows.length - options.rowsInFooter - $('.sg-h-scroll-container', _private.widget).length; i++) {
                    if ($(_table().rows[i]).css('display') != 'none') {
                        return $(_table().rows[i]).height();
                    }
                }
                return 0;
            };

            var _yLastVisibleRowHeight = function () {
                for (var i = _table().rows.length - options.rowsInFooter - $('.sg-h-scroll-container', _private.widget).length - 1; i >= options.rowsInHeader; i--) {
                    if ($(_table().rows[i]).css('display') != 'none') {
                        return $(_table().rows[i]).height();
                    }
                }
                return 0;
            };

            var _yUpdateRowsVisibility = function () {

                if (!_yScrollNeeded())
                    return;

                var topContainer = $('.sg-v-scroll-container', _private.widget);

                var startFrom = Math.floor(topContainer.scrollTop() / _yRowScrollStep());
                var relativeTop = _yCurrentRelativeScrollTop();

                for (var i = options.rowsInHeader; i < _table().rows.length - options.rowsInFooter - $('.sg-h-scroll-container', _private.widget).length; i++) {
                    var visible = false;

                    if (i >= options.rowsInHeader + startFrom
                            &&
                            i < options.rowsInHeader + startFrom + options.rowsInScrollableArea
                    ) {
                        visible = true;
                    }

                    if (visible) {
                        $(_table().rows[i]).show();
                    } else {
                        $(_table().rows[i]).hide();
                    }
                }

                if (_private.startFrom != startFrom) {
                    _private.startFrom = startFrom;
                    _yMoveScrollToRightRow(relativeTop);
                }
            };

            var _attachToEndScrolling = function (element, handler) {
                element.scroll(function() {
                    clearTimeout(element.data('scrollTimer'));

                    $.data($this, 'scrollTimer', setTimeout(function () {
                        handler.apply(this);
                    }, 300));
                });
            };

            var _tableMouseWheel = function (event) {
        
                var up = false;
                var down = false;
                var original = event.originalEvent;
                if (original.wheelDelta) {
                    if (original.wheelDelta >= 120) {
                        up = true;
                    }
                    else {
                        if (original.wheelDelta <= -120) {
                            down = true;
                        }
                    }
                }

                if (original.detail) {
                    if (original.detail == -3)
                        up = true;
                    else
                        if (original.detail == 3)
                            down = true;
                }

                var $heightDivContainer = $('.sg-v-scroll-container', _private.widget);
                var delta = 0;

                if (up) 
                    delta = _yRowScrollStep() + 1;
                if(down)
                    delta = - _yRowScrollStep() - 1;

                if (delta != 0) {
                    $heightDivContainer.scrollTop($heightDivContainer.scrollTop() - delta);
                }
                event.preventDefault();
            };

            var _touchStart = function (event) {
                if (event.originalEvent.touches && event.originalEvent.touches.length == 1) {
                    var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    _private._currentTouch = { X: touch.pageX, Y: touch.pageY };
                    event.preventDefault();
                    event.stopPropagation();
                }
            };

            var _touchMove = function (event) {
                if (event.originalEvent.touches && event.originalEvent.touches.length == 1 && _private._currentTouch != null) {
                    var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

                    var newTouch = { X: touch.pageX, Y: touch.pageY };
                    var deltaX = _private._currentTouch.X - newTouch.X;
                    var deltaY = _private._currentTouch.Y - newTouch.Y;

                    var $heightDivContainer = $('.sg-v-scroll-container', _private.widget);
                    if (deltaY > 0) { 
                        var rowToHideHeight = _yFirstVisibleRowHeight();
                        if (rowToHideHeight != 0 && deltaY > rowToHideHeight) {
                            $heightDivContainer.scrollTop($heightDivContainer.scrollTop() + (_yRowScrollStep() + 1))
                            _private._currentTouch.Y -= rowToHideHeight;
                            _yUpdateRowsVisibility();
                        }
                    }
                    else {
                        var rowToHideHeight = _yLastVisibleRowHeight();
                        if (rowToHideHeight != 0 && deltaY < -1 * rowToHideHeight) {
                            $heightDivContainer.scrollTop($heightDivContainer.scrollTop() - (_yRowScrollStep() + 1))
                            _private._currentTouch.Y += rowToHideHeight;
                            _yUpdateRowsVisibility();
                        }
                    }

                    var $widthDivContainer = $('.sg-h-scroll-container', _private.widget);
                    if (deltaX > 0) {
                        var columnToHideWidth = _xFirstVisibleColumnWidth();
                        if (columnToHideWidth != 0 && deltaX > columnToHideWidth) {
                            $widthDivContainer.scrollLeft($widthDivContainer.scrollLeft() + (_xColumnScrollStep() + 1))
                            _private._currentTouch.X -= rowToHideHeight;
                        }
                    }
                    else {
                        var columnToHideWidth = this._xLastVisibleColumnWidth();
                        if (columnToHideWidth != 0 && deltaX < -1 * columnToHideWidth) {
                            $widthDivContainer.scrollLeft($widthDivContainer.scrollLeft() - (_xColumnScrollStep() + 1))
                            _private._currentTouch.X += columnToHideWidth;
                        }
                    }
                    event.preventDefault();
                    event.stopPropagation();
                }
            };

            var _touchEnd = function (event) {
                _private._currentTouch = null
            };
        
            var _table = function() {
                _private.widget = $('#'+$($this).attr('id'));
                return _private.widget[0];
            };

            var _setActualCellIndexes = function() {
                var rows = _table().rows;

                for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                    var row = rows[rowIndex];
                    var indAdjustments = $(row).get(0)[CELL_SPAN_ADJUSTMENTS];
                    if (!indAdjustments)
                        indAdjustments = [];

                    for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {

                        var prevCellEndsAt = cellIndex - 1;

                        if (cellIndex > 0) {
                            var $prevCell = $(row.cells[cellIndex - 1]);
                            prevCellEndsAt = $prevCell.get(0)[CELL_INDEX_DATA];
                            if ($prevCell.attr('colspan')) {
                                prevCellEndsAt += _getColSpan($prevCell) - 1;
                            }
                        }

                        var $cell = $(row.cells[cellIndex]);
                        var indexToSet = prevCellEndsAt + 1;

                        for (var i = 0; i < indAdjustments.length; i++) {
                            if (indAdjustments[i].index <= indexToSet) {
                                indexToSet += indAdjustments[i].adjustment;
                                indAdjustments[i].adjustment = 0;
                            }
                        }

                        $cell.get(0)[CELL_INDEX_DATA] = indexToSet;

                        if ($cell.attr('rowspan') > 1 ) {
                            var span = $cell.attr('rowspan');

                            for (var rowShift = rowIndex + 1; rowShift < rowIndex + span && rowShift < rows.length; rowShift++) {
                                var $shiftedRow = $(rows[rowShift]);
                                var adjustments = $shiftedRow.get(0)[CELL_SPAN_ADJUSTMENTS];
                                if (!adjustments)
                                    adjustments = [];
                                adjustments.push({ index: indexToSet, adjustment: _getColSpan($cell) });
                                $shiftedRow.get(0)[CELL_SPAN_ADJUSTMENTS] = adjustments;
                            }
                        }
                    }
                }
            };

            var _getColSpan = function($cell) {
                if ($cell.data('scroll-span'))
                    return $cell.data('scroll-span');

                if ($cell.attr('colspan'))
                    return $cell.attr('colspan') * 1;

                return 1;
            };
        
            return this.each(function() {
                _create();
            });
        
        }
        
    });
    
})(jQuery);