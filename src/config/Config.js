let config = {
  env: __DEV__ ? 'dev' : 'prod',
  prefix: `/api/v1`,
  prod: {
    uri: 'flipsetter.com',
    janus: '/janus',
    janusws: '/janus-ws',
    echo: '/socket',
    client_id: '10',
    client_secret: '4HGLGxFAeX8aAYUreGH862QwO5oU4JPtGFjIhoLo',
  },
  dev: {
    uri: 'tippinweb.com',
    janus: '/janus',
    janusws: '/janus-ws',
    echo: '/socket',
    client_id: '5',
    client_secret: '5UgakrxzfZGYlu5hlWWi6Pu6ScWl3ahZblmkhpFq',
  },
};

export default config;

//
// let config = {
//
//     env: (__DEV__) ? "dev" : "prod",
//     apiVersion:1,
//     prefix: () => `api/v${config.apiVersion}`,
//     prod: {
//         http: "https://flipsetter.com/",
//         wss: "wss://flipsetter.com/janus"
//     },
//     dev: {
//         http: "https://tippinweb.com/",
//         wss: "wss://tippinweb.com/janus",
//         client_id: '5',
//         client_secret: '6tjWgp5B21sNtTV0SkR4uI77sMZwAtbx6OZcvgbT',
//     },
//     uri: (config.env === "dev") ? config.dev.http+this.prefix : config.prod.http+this.prefix,
//
// }
//
// export default config;

// export default config =  {
//     env: (__DEV__) ? "dev" : "prod",
//     apiVersion: 1,
//     uri: {
//         prefix: `/api/v${config.apiVersion}`,
//         prod: {
//             http: "https://flipsetter.com",
//             wss: "wss://flipsetter.com/janus",
//         },
//         dev: {
//             http: "https://tippinweb.com",
//             wss: "wss://tippinweb.com/janus",
//             client_id: '5',
//             client_secret: '6tjWgp5B21sNtTV0SkR4uI77sMZwAtbx6OZcvgbT',
//         }
//     }
//}
