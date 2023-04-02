import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { initTextures } from "./init-texture.js";

main();

function validateNoneOfTheArgsAreUndefined(functionName, args) {
  for (var ii = 0; ii < args.length; ++ii) {
    if (args[ii] === undefined) {
      console.error(
        "undefined passed to gl." +
          functionName +
          "(" +
          WebGLDebugUtils.glFunctionArgsToString(functionName, args) +
          ")"
      );
    }
  }
}

function main() {
  const canvas = document.querySelector("#glcanvas");
  // Initialize the GL context

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  let gl = canvas.getContext("webgl");
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl = WebGLDebugUtils.makeDebugContext(
    gl,
    undefined,
    validateNoneOfTheArgsAreUndefined
  );

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Vertex shader program
  let vsSource, fsSource;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "cube.vert", false);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      vsSource = xhr.responseText;
    }
  };
  xhr.send();
  xhr = new XMLHttpRequest();
  xhr.open("GET", "cube.frag", false);
  xhr.onreadystatechange = function () {
    fsSource = xhr.responseText;
  };
  xhr.send();

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
      texCoord: gl.getAttribLocation(shaderProgram, "aTexCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      tex: gl.getUniformLocation(shaderProgram, "tex"),
    },
  };

  const buffers = initBuffers(gl, programInfo);
  const texture = initTextures(gl);

  let then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, texture, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
//  初始化着色器程序，让 WebGL 知道如何绘制我们的数据
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // 创建着色器程序

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // 如果创建失败，alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

//
// 创建指定类型的着色器，上传 source 源码并编译
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
