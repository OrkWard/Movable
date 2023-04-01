function initTextures(gl) {
  const cubeTexture = gl.createTexture();
  const cubeImage = new Image();
  cubeImage.onload = function () {
    handleTextureLoaded(gl, cubeImage, cubeTexture);
  };
  cubeImage.src = "cubetexture.png";

  return cubeTexture;
}

function handleTextureLoaded(gl, image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

export { initTextures };
