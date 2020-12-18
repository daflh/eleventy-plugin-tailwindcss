module.exports = {
  purge: {
    enabled: true,
    content: [
      'sample/index.html'
    ]
  },
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  }
};
