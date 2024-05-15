import {Space, TDirectionInstruction, getMapData, show3dMap } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";


// See Trial API key Terms and Conditions
// https://developer.mappedin.com/web/v6/trial-keys-and-maps/
const options = {
  key: '65ca6d27d53f21f234ae6395',
  secret: '0b25fc24d564c644443663d0b4d083605090d349975d0983fc96e06a5b1934dd',
  mapId: '662804cd3d4f85efee0e48da'
};

async function init() {
  const mapData = await getMapData(options);
  const mappedinDiv = document.getElementById("mappedin-map") as HTMLDivElement;
  const floorSelector = document.createElement("select");
  mappedinDiv.appendChild(floorSelector);

  const mapView = await show3dMap(
    document.getElementById("mappedin-map") as HTMLDivElement, 
    mapData
  );

  mapData.getByType("floor").forEach((floor) => {
    const option = document.createElement("option");
    option.text = floor.name;
    option.value = floor.id;
    floorSelector.appendChild(option);
  });

  floorSelector.value = mapView.currentFloor.id;

  floorSelector.addEventListener("change", e => {
    mapView.setFloor((e.target as HTMLSelectElement)?.value);
  });

  mapView.on("floor-change", (event) => {
    // update the level selector
    const id = event?.floor.id;
    if (!id) return;
    floorSelector.value = id;
  });

  // cap
  // Set each space to be interactive.
// Set each space to be interactive and its hover color to red.
let startSpace: Space | null = null;
let path: Path | null = null;

mapData.getByType('space').forEach(space => {
	mapView.updateState(space, {
		interactive: true,
		hoverColor: '#f26336',
	});
});
mapView.Labels.all() 

// flooor
console.log(mapData.getByType('floor'));
floorSelector.style.position = "absolute"; // Position it relative to mappedinDiv
floorSelector.style.top = "10px"; // Adjust as needed
floorSelector.style.right = "10px"; // Adjust as needed
floorSelector.style.padding = "8px";
floorSelector.style.border = "2px solid #ccc";
floorSelector.style.zIndex = "1000"; // Ensure it's on top

// // navi

mapView.on("click", async (event) => {
  if (!event) return;
  if (!startSpace) {
    startSpace = event.spaces[0];
  } else if (!path && event.spaces[0]) {
    const directions = mapView.getDirections(startSpace, event.spaces[0]);
    if (!directions) return;
    path = mapView.Paths.add(directions.coordinates, {
      nearRadius: 0.7,
      farRadius: 0.7,
      color:"#90ee90",
      pulseColor:"cyan",
      displayArrowsOnPath : true
    });
  } else if (path) {
    mapView.Paths.remove(path);
    startSpace = null;
    path = null;
  }
});
// cam
// Act on the click event to animate to a new camera position.
let lastClickTime = 0;
const doubleClickDelay = 300; // Adjust the delay as needed

mapView.on('click', async event => {
  const currentTime = new Date().getTime();
  const timeSinceLastClick = currentTime - lastClickTime;
  if (timeSinceLastClick <= doubleClickDelay) {
    mapView.Camera.animate(
      {
        bearing: 30,
        pitch: 80,
        zoomLevel: 100,
        center: event.coordinate,
      },
      { duration: 4000, easing: 'ease-in-out' },
    );
  }
  lastClickTime = currentTime;
});

const html = `
	<button id="pitch-up">Pitch Up</button>
	<button id="pitch-down">Pitch Down</button>
	<button id="bearing-left">Bearing Left</button>
	<button id="bearing-right">Bearing Right</button>
	<button id="zoom-in">Zoom In</button>
	<button id="zoom-out">Zoom Out</button>
`;

const el = document.createElement("div");
Object.assign(el.style, {
  position: "fixed",
  top: "0",
  left: "0",
  zIndex: "1000",
});
el.innerHTML = html;
document.body.appendChild(el);

Array.from(el.children).forEach((element) => {
  element.addEventListener("click", () => {
    const transform: {
      pitch?: number;
      bearing?: number;
      zoomLevel?: number;
    } = {};
    switch (element.getAttribute("id")) {
      case "pitch-up":
        transform.pitch = mapView.Camera.pitch + 10;
        break;
      case "pitch-down":
        transform.pitch = mapView.Camera.pitch - 10;
        break;
      case "bearing-left":
        transform.bearing = (mapView.Camera.bearing - 45) % 360;
        break;
      case "bearing-right":
        transform.bearing = (mapView.Camera.bearing + 45) % 360;
        break;
      case "zoom-in":
        transform.zoomLevel = mapView.Camera.zoomLevel + 0.5;
        break;
      case "zoom-out":
        transform.zoomLevel = mapView.Camera.zoomLevel - 0.5;
        break;
    }
    mapView.Camera.animate(transform);
  });
});
// connection
mapData.getByType("connection").forEach((connection) => {
  // Find the coordinates for the current floor.
  const coords = connection.coordinates.find(
    (coord) => coord.floorId === mapView.currentFloor.id
  );
  // Label the connection.
  if (coords) {
    mapView.Labels.add(coords, connection.name);
  }
});
}

init();



// saad rules