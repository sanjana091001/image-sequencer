module.exports = exports = function(pixels, options){

      var fillColor = options.fillColor || '100 100 100 255',
          x = parseInt(options.startingX) || 10,
          y = parseInt(options.startingY) || 10,
          height = pixels.shape[1],
          width = pixels.shape[0],
          r = pixels.get(x, y, 0),
          g = pixels.get(x,y,1),
          b = pixels.get(x,y,2),
          a = pixels.get(x, y, 3),
          queuex = [x],
          queuey = [y],
          curry, currx,
          north,
          south,
          n,
          tolerance = parseInt(options.tolerance) || 10,
          maxFactor = (1 + tolerance/100),
          minFactor = (1 - tolerance/100);

      fillColor = fillColor.split(" ");
      function isSimilar(currx, curry){
        return (pixels.get(currx, curry, 0) > r*minFactor && pixels.get(currx, curry, 0) < r*maxFactor &&
                pixels.get(currx, curry, 1) > g*minFactor && pixels.get(currx, curry, 1) < g*maxFactor &&
                pixels.get(currx, curry, 2) > b*minFactor && pixels.get(currx, curry, 2) < b*maxFactor &&
                pixels.get(currx, curry, 3) > a*minFactor && pixels.get(currx, curry, 3) < a*maxFactor);
      }

      while (queuey.length) {
        currx = queuex.pop()
        curry = queuey.pop()
        

        if (isSimilar(currx, curry)) {
          north = south = curry

          do {
            north -= 1
          } while (isSimilar(currx, north) && north >= 0)

          do {
            south += 1
          } while (isSimilar(currx, south) && south < height)
          
          for (n = north + 1; n < south; n += 1) {
            pixels.set(currx, n, 0, fillColor[0]);
            pixels.set(currx, n, 1, fillColor[1]);
            pixels.set(currx, n, 2, fillColor[2]);
            pixels.set(currx, n, 3, fillColor[3]);
            if (isSimilar(currx - 1, n)) {
              queuex.push(currx - 1)
              queuey.push(n)
            }
            if (isSimilar(currx + 1, n)) {
              queuex.push(currx + 1)
              queuey.push(n)
            }
          }
        }
      }

      return pixels;
}