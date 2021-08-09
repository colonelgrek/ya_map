'use strict';

let longitudeGr = 37.597664;
let latitudeGr = 55.750626;
let scale = 19;

console.log(`longitudeGr=${longitudeGr}град; latitudeGr=${latitudeGr}град`); //

console.log(`coordTile x = ${getTile(longitudeGr, latitudeGr, scale).x}; y = ${getTile(longitudeGr, latitudeGr, scale).y}`);

/**
 *
 * @param {*} longitudeGr географическая долгота в градусах.
 * @param {*} latitudeGr географическая широта в градусах.
 * @param {*} scale зум карты
 * @returns координаты X,Y для плитки (tile), в которую входят координаты.
 */
function getTile(longitudeGr, latitudeGr, scale) {
  let longitude = longitudeGr * Math.PI / 180;
  let latitude = latitudeGr * Math.PI / 180;

  let coordMercator = geoToMercator(longitude, latitude);

  let coordPx = mercatorToPixels(coordMercator);

  return {
    x: Math.floor(coordPx.x / 256 / Math.pow(2, (21 - scale))) - 1,
    y: Math.floor(coordPx.y / 256 / Math.pow(2, (21 - scale))) - 1
  }
}

/**
 *
 * @param {number} longitude географическая долгота в радианах.
 * @param {number} latitude географическая широта в радианах.
 * @returns координаты в проекции Меркаторa
 */
function geoToMercator(longitude, latitude) {
  let Rn = 6378137; // Экваториальный радиус
  let e = 0.0818191908426; // Эксцентриситет
  let esinLat = e * Math.sin(latitude);

  let tan_temp = Math.tan(Math.PI / 4.0 + latitude / 2.0);
  let pow_temp = Math.pow(Math.tan(Math.PI / 4.0 + Math.asin(esinLat) / 2), e);
  let U = tan_temp / pow_temp;

  return {
    x: Rn * longitude,
    y: Rn * Math.log(U)
  };
}

/**
 *
 * @param {object} coordMercator координаты в проекции Меркаторa
 * @returns Преобразование меркаторовых координат в пиксельные (на последнем масштабе = 21)
 */
function mercatorToPixels(coordMercator) {
  let equatorLength = 40075016.685578488; //Длина экватора
  let worldSize = Math.pow(2, 29); // Размер мира в пикселях
  let a = worldSize / equatorLength;
  let b = equatorLength / 2;

  return {
    x: Math.round((b + coordMercator.x) * a),
    y: Math.round((b - coordMercator.y) * a)
  };
}
