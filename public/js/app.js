var graph = null;
var ledWidth = 16;
var ledHeight = 32;
var LedDepth = 8;

window.addEventListener('load', ()=>{
    
    drawVisualization()

    let ws = new WebSocket('ws://' + window.location.host + '/websocket')
    ws.onmessage = m =>{
        let data = ConvertToVisData(JSON.parse(m.data))
        if (data.length != 0){
            graph.setData(data)
        }
    }

});

function onclick(point) {
    console.log(point);
}

function zeroPadding(number, length){
    return (Array(length).join('0') + number).slice(-length);
}

// Called when the Visualization API is loaded.
function drawVisualization() {
    // create the data table.
    // create some shortcuts to math functions

    // specify options
    var options = {
        width: '600px',
        height: '600px',
        style: 'dot-color',
        showPerspective: false,
        showGrid: true,
        keepAspectRatio: true,
        verticalRatio: 2,
        showLegend: false,
        onclick: onclick,
        dotSizeRatio: 0.015,
        // x->x, y<->z
        xMax: ledWidth,
        xMin: 0,
        xStep: 2,
        yMax: LedDepth,
        yMin: 0,
        yStep: 2,
        zMax: ledHeight,
        zMin: 0,
        zStep: 2,
        zValueLabel: function (z) { return ledHeight-z},
        cameraPosition: {
            horizontal: -0.35,
            vertical: 0.22,
            distance: 3.0
        }
    };

    // create our graph
    var container = document.getElementById('mygraph');
    graph = new vis.Graph3d(container, getInitialData(), options);
//    setInterval(updateData, 50)
}

function getInitialData() {
    data = new vis.DataSet();
    var random = Math.random;

    for (var x = 0; x < ledWidth; x++) {
        for (var y = 0; y < ledHeight; y++) {
            for (var z = 0; z < LedDepth; z++) {
                var show = Math.round(random() * 0x100000)
                if (show % 30 == 0) {
                    data.add({ x: x, y: z, z: ledHeight-y, style: 0xff0000 });
                    dataExists = true
                }
            }
        }
    }
    return data
}

function ConvertToVisData(ledData){
    data = new vis.DataSet();
    var dataExists = false
    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 32; y++) {
            for (var z = 0; z < 8; z++) {
                var idx = z + y * 8 + x * 8 * 32;
                if (ledData[idx]){
                    c = zeroPadding(ledData[idx].toString(16),6)
                    data.add({ x: x, y: z, z: ledHeight-y, style: "#"+c });
                }

            }
        }
    }
    if(!dataExists){
        data.add({x:0, y:0, z:0, style:"#00000000"})
    }
    return data
}

function SetDataFromWebAPI() {

    $.get("api/led", function (led) {
        let data = ConvertToVisData(led)
        if (data.length != 0){
            graph.setData(data)
        }
    });
}


function updateData() {
    if (graph == null) {
        return;
    }

    //  setData()
    SetDataFromWebAPI()

}

