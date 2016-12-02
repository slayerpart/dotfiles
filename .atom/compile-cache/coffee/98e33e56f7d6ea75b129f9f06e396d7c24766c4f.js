(function() {
  var cmykToRGB, hcgToRGB, hexARGBToRGB, hexRGBAToRGB, hexToRGB, hslToRGB, hsvToHWB, hsvToRGB, hwbToHSV, hwbToRGB, rgbToCMYK, rgbToHCG, rgbToHSL, rgbToHSV, rgbToHWB, rgbToHex, rgbToHexARGB, rgbToHexRGBA;

  rgbToHex = function(r, g, b) {
    var rnd, value;
    rnd = Math.round;
    value = ((rnd(r) << 16) + (rnd(g) << 8) + rnd(b)).toString(16);
    while (value.length < 6) {
      value = "0" + value;
    }
    return value;
  };

  hexToRGB = function(hex) {
    var b, color, g, r;
    color = parseInt(hex, 16);
    r = (color >> 16) & 0xff;
    g = (color >> 8) & 0xff;
    b = color & 0xff;
    return [r, g, b];
  };

  rgbToHexARGB = function(r, g, b, a) {
    var rnd, value;
    rnd = Math.round;
    value = ((rnd(a * 255) << 24) + (rnd(r) << 16) + (rnd(g) << 8) + rnd(b)).toString(16);
    while (value.length < 8) {
      value = "0" + value;
    }
    return value;
  };

  rgbToHexRGBA = function(r, g, b, a) {
    var rnd, value;
    rnd = Math.round;
    value = ((rnd(r) << 24) + (rnd(g) << 16) + (rnd(b) << 8) + rnd(a * 255)).toString(16);
    while (value.length < 8) {
      value = "0" + value;
    }
    return value;
  };

  hexARGBToRGB = function(hex) {
    var a, b, color, g, r;
    color = parseInt(hex, 16);
    a = ((color >> 24) & 0xff) / 255;
    r = (color >> 16) & 0xff;
    g = (color >> 8) & 0xff;
    b = color & 0xff;
    return [r, g, b, a];
  };

  hexRGBAToRGB = function(hex) {
    var a, b, color, g, r;
    color = parseInt(hex, 16);
    r = (color >> 24) & 0xff;
    g = (color >> 16) & 0xff;
    b = (color >> 8) & 0xff;
    a = (color & 0xff) / 255;
    return [r, g, b, a];
  };

  rgbToHSV = function(r, g, b) {
    var delta, deltaB, deltaG, deltaR, h, maxVal, minVal, rnd, s, v;
    r = r / 255;
    g = g / 255;
    b = b / 255;
    rnd = Math.round;
    minVal = Math.min(r, g, b);
    maxVal = Math.max(r, g, b);
    delta = maxVal - minVal;
    v = maxVal;
    if (delta === 0) {
      h = 0;
      s = 0;
    } else {
      s = delta / v;
      deltaR = (((v - r) / 6) + (delta / 2)) / delta;
      deltaG = (((v - g) / 6) + (delta / 2)) / delta;
      deltaB = (((v - b) / 6) + (delta / 2)) / delta;
      if (r === v) {
        h = deltaB - deltaG;
      } else if (g === v) {
        h = (1 / 3) + deltaR - deltaB;
      } else if (b === v) {
        h = (2 / 3) + deltaG - deltaR;
      }
      if (h < 0) {
        h += 1;
      }
      if (h > 1) {
        h -= 1;
      }
    }
    return [h * 360, s * 100, v * 100];
  };

  hsvToRGB = function(h, s, v) {
    var b, comp1, comp2, comp3, dominant, g, r, rnd, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    h = h / 60;
    s = s / 100;
    v = v / 100;
    rnd = Math.round;
    if (s === 0) {
      return [rnd(v * 255), rnd(v * 255), rnd(v * 255)];
    } else {
      dominant = Math.floor(h);
      comp1 = v * (1 - s);
      comp2 = v * (1 - s * (h - dominant));
      comp3 = v * (1 - s * (1 - (h - dominant)));
      switch (dominant) {
        case 0:
          _ref = [v, comp3, comp1], r = _ref[0], g = _ref[1], b = _ref[2];
          break;
        case 1:
          _ref1 = [comp2, v, comp1], r = _ref1[0], g = _ref1[1], b = _ref1[2];
          break;
        case 2:
          _ref2 = [comp1, v, comp3], r = _ref2[0], g = _ref2[1], b = _ref2[2];
          break;
        case 3:
          _ref3 = [comp1, comp2, v], r = _ref3[0], g = _ref3[1], b = _ref3[2];
          break;
        case 4:
          _ref4 = [comp3, comp1, v], r = _ref4[0], g = _ref4[1], b = _ref4[2];
          break;
        default:
          _ref5 = [v, comp1, comp2], r = _ref5[0], g = _ref5[1], b = _ref5[2];
      }
      return [r * 255, g * 255, b * 255];
    }
  };

  rgbToHSL = function(r, g, b) {
    var d, h, l, max, min, s, _ref;
    _ref = [r / 255, g / 255, b / 255], r = _ref[0], g = _ref[1], b = _ref[2];
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = void 0;
    s = void 0;
    l = (max + min) / 2;
    d = max - min;
    if (max === min) {
      h = s = 0;
    } else {
      s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  hslToRGB = function(h, s, l) {
    var clamp, hue, m1, m2;
    clamp = function(val) {
      return Math.min(1, Math.max(0, val));
    };
    hue = function(h) {
      h = (h < 0 ? h + 1 : (h > 1 ? h - 1 : h));
      if (h * 6 < 1) {
        return m1 + (m2 - m1) * h * 6;
      } else if (h * 2 < 1) {
        return m2;
      } else if (h * 3 < 2) {
        return m1 + (m2 - m1) * (2 / 3 - h) * 6;
      } else {
        return m1;
      }
    };
    h = (h % 360) / 360;
    s = clamp(s / 100);
    l = clamp(l / 100);
    m2 = (l <= 0.5 ? l * (s + 1) : l + s - l * s);
    m1 = l * 2 - m2;
    return [hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255];
  };

  rgbToHCG = function(r, g, b) {
    var c, gr, h, max, min, _ref;
    r = r / 255;
    g = g / 255;
    b = b / 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    c = max - min;
    gr = 0;
    h = 0;
    if (c < 1) {
      gr = min / (1 - c);
    }
    if (c > 0) {
      switch (max) {
        case r:
          h = (g - b) / c + ((_ref = g < b) != null ? _ref : {
            6: 0
          });
          break;
        case g:
          h = (b - r) / c + 2;
          break;
        case b:
          h = (r - g) / c + 4;
      }
      h /= 6;
    }
    return [h * 360, c * 100, gr * 100];
  };

  hcgToRGB = function(h, c, gr) {
    var b, f, g, i, m, mod, q, r, t;
    h = h / 360 * 6;
    c = c / 100;
    gr = gr / 100;
    if (c <= 0) {
      return [gr * 255, gr * 255, gr * 255];
    }
    i = Math.floor(h);
    f = h - i;
    q = c * (1 - f);
    t = c * f;
    mod = i % 6;
    r = [c, q, 0, 0, t, c][mod];
    g = [t, c, c, q, 0, 0][mod];
    b = [0, 0, t, c, c, q][mod];
    m = (1 - c) * gr;
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  };

  hsvToHWB = function(h, s, v) {
    var b, w, _ref;
    _ref = [s / 100, v / 100], s = _ref[0], v = _ref[1];
    w = (1 - s) * v;
    b = 1 - v;
    return [h, w * 100, b * 100];
  };

  hwbToHSV = function(h, w, b) {
    var s, v, _ref;
    _ref = [w / 100, b / 100], w = _ref[0], b = _ref[1];
    s = 1 - (w / (1 - b));
    v = 1 - b;
    return [h, s * 100, v * 100];
  };

  rgbToHWB = function(r, g, b) {
    return hsvToHWB.apply(null, rgbToHSV(r, g, b));
  };

  hwbToRGB = function(h, w, b) {
    return hsvToRGB.apply(null, hwbToHSV(h, w, b));
  };

  cmykToRGB = function(c, m, y, k) {
    var b, g, r;
    r = 1 - Math.min(1, c * (1 - k) + k);
    g = 1 - Math.min(1, m * (1 - k) + k);
    b = 1 - Math.min(1, y * (1 - k) + k);
    r = Math.floor(r * 255);
    g = Math.floor(g * 255);
    b = Math.floor(b * 255);
    return [r, g, b];
  };

  rgbToCMYK = function(r, g, b) {
    var computedC, computedK, computedM, computedY, minCMY;
    if (r === 0 && g === 0 && b === 0) {
      return [0, 0, 0, 1];
    }
    computedC = 1 - (r / 255);
    computedM = 1 - (g / 255);
    computedY = 1 - (b / 255);
    minCMY = Math.min(computedC, Math.min(computedM, computedY));
    computedC = (computedC - minCMY) / (1 - minCMY);
    computedM = (computedM - minCMY) / (1 - minCMY);
    computedY = (computedY - minCMY) / (1 - minCMY);
    computedK = minCMY;
    return [computedC, computedM, computedY, computedK];
  };

  module.exports = {
    cmykToRGB: cmykToRGB,
    hexARGBToRGB: hexARGBToRGB,
    hexRGBAToRGB: hexRGBAToRGB,
    hexToRGB: hexToRGB,
    hslToRGB: hslToRGB,
    hsvToHWB: hsvToHWB,
    hsvToRGB: hsvToRGB,
    hcgToRGB: hcgToRGB,
    hwbToHSV: hwbToHSV,
    hwbToRGB: hwbToRGB,
    rgbToCMYK: rgbToCMYK,
    rgbToHex: rgbToHex,
    rgbToHexARGB: rgbToHexARGB,
    rgbToHexRGBA: rgbToHexRGBA,
    rgbToHSL: rgbToHSL,
    rgbToHSV: rgbToHSV,
    rgbToHWB: rgbToHWB,
    rgbToHCG: rgbToHCG
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL01hcnZpbi8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItY29udmVyc2lvbnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBUUE7QUFBQSxNQUFBLG9NQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFZLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEdBQUE7QUFDVixRQUFBLFVBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBWCxDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEdBQUEsQ0FBSSxDQUFKLENBQUEsSUFBVSxFQUFYLENBQUEsR0FBaUIsQ0FBQyxHQUFBLENBQUksQ0FBSixDQUFBLElBQVUsQ0FBWCxDQUFqQixHQUFpQyxHQUFBLENBQUksQ0FBSixDQUFsQyxDQUF5QyxDQUFDLFFBQTFDLENBQW1ELEVBQW5ELENBRFIsQ0FBQTtBQUlvQixXQUFNLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBckIsR0FBQTtBQUFwQixNQUFBLEtBQUEsR0FBUyxHQUFBLEdBQUcsS0FBWixDQUFvQjtJQUFBLENBSnBCO1dBTUEsTUFQVTtFQUFBLENBQVosQ0FBQTs7QUFBQSxFQWdCQSxRQUFBLEdBQVcsU0FBQyxHQUFELEdBQUE7QUFDVCxRQUFBLGNBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxRQUFBLENBQVMsR0FBVCxFQUFjLEVBQWQsQ0FBUixDQUFBO0FBQUEsSUFFQSxDQUFBLEdBQUksQ0FBQyxLQUFBLElBQVMsRUFBVixDQUFBLEdBQWdCLElBRnBCLENBQUE7QUFBQSxJQUdBLENBQUEsR0FBSSxDQUFDLEtBQUEsSUFBUyxDQUFWLENBQUEsR0FBZSxJQUhuQixDQUFBO0FBQUEsSUFJQSxDQUFBLEdBQUksS0FBQSxHQUFRLElBSlosQ0FBQTtXQU1BLENBQUMsQ0FBRCxFQUFJLENBQUos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

//# sourceURL=/Users/Marvin/.atom/packages/pigments/lib/color-conversions.coffee