module.exports = {
    presets: [
        ["@babel/preset-env", {
            targets: {
                node: 'current'
            }
        }],
        "@babel/preset-react",
        "@babel/preset-typescript"
    ],
    "plugins": [
        "react-hot-loader/babel",
        "@babel/plugin-proposal-class-properties"
    ]
}