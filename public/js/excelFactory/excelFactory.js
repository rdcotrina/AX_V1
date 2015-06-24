/**
 * Created by DAVID on 5/03/15.
 */
var excelFactory_ = function(){

    var _private = {};

    _private.setData = function(dataServer){
        var json = '[', kk;
        /*recorrido de la data*/
        for(var i in dataServer.data){
            json += '[';
            /*recorrido de los campos segun rows configurados*/
            for(var r in dataServer.rows){
                if(dataServer.rows[r].field !== undefined){
                    kk = eval('dataServer.data['+i+'].'+dataServer.rows[r].field);
                    kk = kk.replace(/("|')/gi,'');
                    json += '"'+kk+'",';
                }
            }
            json = json.substring(0, json.length-1);
            json += '],';
        }
        json = json.substring(0, json.length-1);
        json += ']';

        return json;
    };

    _private.setColumns = function(dataServer){
        var col = '[';
        for(var i in dataServer.rows){
            var type   = (dataServer.rows[i].type !== undefined)?dataServer.rows[i].type:'string',
                width  = (dataServer.rows[i].width !== undefined)?dataServer.rows[i].width:50,
                formatNumber = '';

            if(dataServer.rows[i].field !== undefined){
                if(type.toLowerCase() === 'number'){
                    formatNumber = 'style: basicReport.predefinedFormatters.currency.id,';
                }

                col += '{';
                col +=      'id: "'+dataServer.rows[i].field+'",';
                col +=      'name: "'+dataServer.rows[i].title+'",';
                col +=      'type: "'+type+'",';
                col +=      formatNumber;
                col +=      'width: "'+width+'"';
                col += '},';
            }
        }
        col = col.substring(0, col.length-1);
        col += '];';

        return col;
    };

    _private.worksheetData = function(dataServer){

        var head = '[[';

        for(var i in dataServer.rows){
            var titulo  = (dataServer.rows[i].title !== undefined)?dataServer.rows[i].title:'';

            if(dataServer.rows[i].field !== undefined){
                head += '{';
                head +=      'value: "'+titulo+'",';
                head +=      'metadata: {style: basicReport.predefinedFormatters.header.id, type: "string"}';
                head += '},';
            }
        }
        head = head.substring(0, head.length-1);
        head += ']];';

        return head;
    };

    var _public = {};

    _public.create = function(dataServer){
        require.config({
            text: 'public/js/excelFactory/js/text.js',
            paths: {
                JSZip: 'public/js/excelFactory/Excel/JSZip'
            },
            shim: {
                'JSZip': {
                    exports: 'JSZip'
                }
            }
        });

        require(['public/js/excelFactory/excel-builder','public/js/excelFactory/Template/BasicReport'], function (builder, BasicReport) {
            var jsonData = _private.setData(dataServer);

            var data = JSON.parse(jsonData);
            var basicReport = new BasicReport();

            var columns = eval(_private.setColumns(dataServer));

            var worksheetData = eval(_private.worksheetData(dataServer)).concat(data);

            basicReport.setHeader([
                {bold: true, text: 'Generic Report'}, '', ''
            ]);
            basicReport.setData(worksheetData);
            basicReport.setColumns(columns);
            basicReport.setFooter([
                '', '', 'Page &P of &N'
            ]);

            var url = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'+builder.createFile(basicReport.prepare());
            window.open(url, "_self", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes");

        });

    };

    return _public;

};

var excelFactory = new excelFactory_();