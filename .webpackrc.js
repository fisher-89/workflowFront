import env from './.env.json'
export default
    {
        "entry": "src/index.js",
        "extraBabelPlugins": [
            ["import", { "libraryName": "antd-mobile", "libraryDirectory": "es", "style": true }]
        ],
        "define": {
            "OA_PATH": env.OA_PATH,
            "UPLOAD_PATH": env.UPLOAD_PATH,
            "OA_CLIENT_ID": env.OA_CLIENT_ID,
            "OA_CLIENT_SECRET": env.OA_CLIENT_SECRET
        },
        "env": {
            "development": {
                "extraBabelPlugins": [
                    "dva-hmr"
                ],
                "define": {
                    "OA_PATH": "http://112.74.177.132:8002",
                    "UPLOAD_PATH": "http://112.74.177.132:8006",
                    "OA_CLIENT_ID": "99",
                    "OA_CLIENT_SECRET": "Z77PmFkOD9SMAIbVDZcKRxOD6f0YA0ck54amYEr1"
                }
            }
        },
        "ignoreMomentLocale": true,
        "theme": "./src/configs/theme.config.js",
        "publicPath": "/",
        "disableDynamicImport": true,
        "html": {
            "template": "./src/index.ejs"
        },
        "hash": true
    }