module.exports = {
    purge: {
        enabled: true,
        content: [
            "sample/index.html"
        ]
    },
	theme: {
        extend: {
            fontSize: {
                "tiny": "0.5rem"
            }
        }
    },
    future: {
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true
    }
}