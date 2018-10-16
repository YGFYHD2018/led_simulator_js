var graph = null;

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
        verticalRatio: 0.25,
        showLegend: false,
        onclick: onclick,
        dotSizeRatio: 0.01,
        xMax: 15,
        xMin: 0,
        yMax: 31,
        yMin: 0,
        zMax: 7,
        zMin: 0,
        xStep: 2,
        yStep: 2,
        zStep: 2,
        cameraPosition: {
            horizontal: -0.35,
            vertical: 0.22,
            distance: 1.8
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

    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 32; y++) {
            for (var z = 0; z < 8; z++) {
                var show = Math.round(random() * 0x100000)
                if (show % 30 == 0) {
                    data.add({ x: x, y: y, z: z, style: 0xff0000 });
                }
            }
        }
    }
    return data
}

function ConvertToVisData(ledData){
    data = new vis.DataSet();
    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 32; y++) {
            for (var z = 0; z < 8; z++) {
                var idx = z + y * 8 + x * 8 * 32;
                if (ledData[idx]){
                    c = zeroPadding(ledData[idx].toString(16),6)
                    data.add({ x: x, y: y, z: z, style: "#"+c });
                }

            }
        }
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

