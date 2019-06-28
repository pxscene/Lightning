import Utils from "../tree/Utils.mjs";
import StageUtils from "../tree/StageUtils.mjs";
import StaticCanvasTexture from "../textures/StaticCanvasTexture.mjs"

export default class Tools {

    static getCanvasTexture(canvasFactory, lookupId) {
        return {type: StaticCanvasTexture, content: {factory: canvasFactory, lookupId: lookupId}}
    }

    static getRoundRect(w, h, radius, strokeWidth, strokeColor, fill, fillColor) {
        if (!Array.isArray(radius)){
            // upper-left, upper-right, bottom-right, bottom-left.
            radius = [radius, radius, radius, radius];
        }

        let factory = (cb, stage) => {
            cb(null, this.createRoundRect(stage, w, h, radius, strokeWidth, strokeColor, fill, fillColor));
        }
        let id = 'rect' + [w, h, strokeWidth, strokeColor, fill ? 1 : 0, fillColor].concat(radius).join(",");
        return Tools.getCanvasTexture(factory, id);
    }

    static createRoundRect(stage, w, h, radius, strokeWidth, strokeColor, fill, fillColor) {
        if (fill === undefined) fill = true;
        if (strokeWidth === undefined) strokeWidth = 0;
        
        let scene = stage.platform;

        fillColor = fill ? fillColor : "none";
        var boundW = w;
        var boundH = h;
        var data = "data:image/svg,"+'<svg viewBox="0 0 '+boundW+' '+boundH+'" xmlns="http://www.w3.org/2000/svg"><rect width="'+w+'" height="'+h+'" fill="'+fillColor+'" rx="'+radius+'" stroke="'+strokeColor+'" stroke-width="'+strokeWidth+'"/></svg>';
       
        var imgRes = scene.create({ t: "imageResource", url: data });
       
        var obj = scene.create({ t: "image", resource: imgRes, w:w, h:h, parent: scene});
    
        return obj;
    }

    static getShadowRect(w, h, radius = 0, blur = 5, margin = blur * 2) {
        if (!Array.isArray(radius)){
            // upper-left, upper-right, bottom-right, bottom-left.
            radius = [radius, radius, radius, radius];
        }

        let factory = (cb, stage) => {
            cb(null, this.createShadowRect(stage, w, h, radius, blur, margin));
        };
        let id = 'shadow' + [w, h, blur, margin].concat(radius).join(",");
        return Tools.getCanvasTexture(factory, id);
    }

    static createShadowRect(stage, w, h, radius, blur, margin) {
        let scene = stage.platform;
        var boundW = w + margin * 2;
        var boundH = h + margin * 2;
        var data = "data:image/svg,"+
              '<svg viewBox="0 0 '+boundW+' '+boundH+'" xmlns="http://www.w3.org/2000/svg" version="1.1"> \
                    <linearGradient id="rectGradient" gradientUnits="userSpaceOnUse" x1="0%" y1="180%" x2="100%" y2="-60%" gradientTransform="rotate(0)"> \
                    <stop offset="20%" stop-color="#00FF00" stop-opacity="0.5"/> \
                    <stop offset="50%" stop-color="#0000FF" stop-opacity=".8"/> \
                    <stop offset="80%" stop-color="#00FF00" stop-opacity=".5"/> \
                    </linearGradient> \
                    <filter id="rectBlur" x="0" y="0"> \
                    <feGaussianBlur in="SourceGraphic" stdDeviation="'+blur+'" /> \
                    </filter> \
                </defs> \
                <g enable-background="new" > \
                    <rect x="0" y="0" width="'+boundW+'" height="'+boundH+'" fill="url(#rectGradient)"  rx="'+radius+'" stroke-width="'+margin+'" filter="url(#rectBlur)"/> \
                </g> \
                </svg>';
       
        var imgRes = scene.create({ t: "imageResource", url: data });
       
        var obj = scene.create({ t: "image", resource: imgRes, w:boundW, h:boundH, parent: scene});
    
        return obj;
    }

    static getSvgTexture(url, w, h) {
        let factory = (cb, stage) => {
            this.createSvg(cb, stage, url, w, h);
        }
        let id = 'svg' + [w, h, url].join(",");
        return Tools.getCanvasTexture(factory, id);
    }

    static createSvg(cb, stage, url, w, h) {
        let scene = stage.platform;
        let img = scene.create({ t: "image", url: url, w:w, h:h, parent: scene, stretchX: 1, stretchY: 1 });
        img.ready.then(function () {
            cb(null, img);
        },
		function(err){ // reject
            cb(err);
		});
    }

}
